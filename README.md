# face-detection

A full-stack face recognition app: enroll people from photos, then search an
uploaded photo against enrolled faces, compare two faces directly, and manage
enrolled people through a React admin UI.

Face embeddings are generated with [InsightFace](https://github.com/deepinsight/insightface)
(`buffalo_l`) and stored/searched with [Qdrant Cloud](https://qdrant.tech/), with a
local Qdrant copy kept as a write-through backup. Person metadata lives in
[PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/)),
enrollment photos are hosted on [Cloudinary](https://cloudinary.com/), and admin-only
actions (enrolling, editing, deleting, managing photos) are protected by JWT login.

## Tech stack

**Backend**
- **FastAPI** + Uvicorn — HTTP API
- **InsightFace** (`buffalo_l`) + OpenCV — face detection and 512-d embeddings
- **Qdrant Cloud** — primary vector similarity search, with a local embedded Qdrant
  copy at `data/qdrant_db` kept in sync as a backup on every insert/delete
- **PostgreSQL** (via `psycopg`, pooled) — primary store for person metadata
  (name, gender, race, birthday, profession, image link, profile photo framing),
  with a local SQLite copy at `data/people.db` kept in sync as a backup on every
  insert/update/delete
- **Cloudinary** — profile/enrollment photo storage
- **PyJWT** + **bcrypt** — admin authentication

**Frontend**
- **React** + **Vite** + **React Router**
- Plain CSS (no framework) — design tokens in `frontend/DESIGN.md`

## Setup

### 1. Install dependencies

```bash
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt

cd frontend
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Root `.env`:
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=cloudinary://${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}@${CLOUDINARY_CLOUD_NAME}

QDRANT_API_KEY=
QDRANT_CLUSTER_URL=

ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
JWT_SECRET=

DATABASE_URL=
```

- **Cloudinary**: from your [Cloudinary dashboard](https://console.cloudinary.com/).
  `CLOUDINARY_URL` is built from the three values above — change any one and it
  updates automatically.
- **Qdrant**: create a free cluster at [cloud.qdrant.io](https://cloud.qdrant.io),
  then copy its API key and cluster URL.
- **Admin credentials**: `ADMIN_USERNAME` is plain text. `ADMIN_PASSWORD_HASH` must
  be a bcrypt hash, not plain text — generate one with:
  ```bash
  .venv/Scripts/python -c "import bcrypt; print(bcrypt.hashpw(b'your-password', bcrypt.gensalt()).decode())"
  ```
  `JWT_SECRET` can be any long random string, e.g.
  `python -c "import secrets; print(secrets.token_hex(32))"`.
- **Database**: create a free project at [neon.tech](https://neon.tech) (or any
  Postgres host) and copy its connection string into `DATABASE_URL`.

`frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

`.env` files are gitignored; never commit real credentials.

### 3. Initialize data stores

Against a fresh Postgres database and/or Qdrant cluster:

```bash
.venv/Scripts/python db_init_setup/setup_db.py
.venv/Scripts/python db_init_setup/setup_qdrant.py
```

The repo also ships with a populated `data/qdrant_db` folder (the local Qdrant
backup mirror) so the app has data to work with out of the box once you've pointed
`DATABASE_URL` at your own Postgres instance and re-run the migration below.

Moving existing data to a new provider:
- `db_init_setup/migrate_qdrant_to_cloud.py` — copies every point from the local
  Qdrant backup into a (new) cloud cluster.
- `db_init_setup/migrate_sqlite_to_postgres.py` — one-time historical script that
  moved this project's original SQLite data into Postgres, preserving row `id`s
  (which Qdrant's vectors reference via `personId`). Kept as a reference/template
  if you ever need to do the same.

## Running

Backend:
```bash
fastapi dev main.py
```
By default this binds to `127.0.0.1` (localhost only). To make it reachable from
another device on the same network (e.g. testing on your phone):
```bash
fastapi dev main.py --host 0.0.0.0
```
Interactive API docs (Swagger UI) are available at `/docs`.

Frontend:
```bash
cd frontend
npm run dev
```
For the frontend to be reachable from other devices too, `frontend/vite.config.js`
already sets `server: { host: true }` — just make sure `VITE_API_URL` in
`frontend/.env` points at your machine's LAN IP rather than `localhost` in that case.

## Local backup automation

Both cloud stores (Qdrant Cloud, Neon Postgres) are mirrored to local files —
`data/qdrant_db` and `data/people.db` — as a safety net against free-tier
suspension/deletion. Rather than relying on the *deployed* app to keep these
current (which only works if the host has persistent storage), a scheduled task
on this machine pulls the latest state down on its own schedule:

- `db_init_setup/pull_postgres_to_sqlite.py` / `pull_qdrant_to_local.py` — read
  everything from the cloud stores and overwrite the local copies (including
  removing anything deleted on the cloud side since the last pull).
- `db_init_setup/run_backup_pull.bat` runs both, logging to `data/backup_pull.log`.
- Registered as a Windows Scheduled Task (`FaceDetectionBackupPull`, daily at
  8:00 PM) — check on it with
  `schtasks /Query /TN "FaceDetectionBackupPull" /V /FO LIST`.

If a cloud provider ever wipes a free-tier cluster/database: create a fresh one,
point the deployed app's env vars at it, then run `migrate_qdrant_to_cloud.py`
and/or `migrate_sqlite_to_postgres.py` using the local copies as the source —
those already do the "push local data back up" direction.

This means the deployed host itself never needs a persistent volume — its own
local backup writes (from the same dual-write code, still active in production)
are just a bonus that may or may not survive a restart depending on the host;
the real safety net is this machine's scheduled pull.

## Deployment

Backend on [Railway](https://railway.app), frontend on [Netlify](https://netlify.com).

**Backend (Railway)**: deploys from the root `Dockerfile`. In the Railway
dashboard, set every variable from your local `.env` as an environment variable
on the service (Cloudinary, Qdrant, admin/JWT, `DATABASE_URL`) — do not upload
the `.env` file itself. Railway assigns a public URL once deployed.

**Frontend (Netlify)**: `netlify.toml` at the repo root already configures the
build (`base = frontend`, `npm run build`, publish `frontend/dist`).
`frontend/public/_redirects` handles client-side routing (without it, refreshing
on any route other than `/` would 404, since a static host otherwise looks for a
literal file at that path). Set `VITE_API_URL` as a Netlify environment variable
to the Railway backend's URL — this must happen *after* the backend is deployed,
since Vite bakes env vars in at build time, not runtime.

**Then, tighten CORS**: once you have the Netlify URL, set `CORS_ORIGINS` in
Railway to that domain (comma-separated if there's more than one) instead of the
default `*`, and redeploy the backend.

## Authentication

Enrolling, editing, deleting, and managing a person's photos requires an admin
login; browsing people, searching, and comparing do not.

| Gated (admin only) | Public |
|---|---|
| `POST /enroll` | `GET /people` |
| `PATCH /people/{id}` | `GET /people/{id}` |
| `DELETE /people/{id}` | `POST /search` |
| `POST /people/{id}/photo` | `POST /compare` |
| `POST /people/{id}/photos` | |

Log in via `POST /auth/login` (or the `/login` page in the UI) to get a JWT, then
send it as `Authorization: Bearer <token>` on gated requests. Tokens expire after
24 hours.

## API

| Method | Path                        | Auth  | Description                                                        |
|--------|-----------------------------|-------|----------------------------------------------------------------------|
| GET    | `/health`                   | –     | Health check                                                       |
| POST   | `/auth/login`                | –     | Log in, returns a JWT                                              |
| GET    | `/people`                   | –     | List all enrolled people                                           |
| GET    | `/people/{person_id}`        | –     | Get one person's details                                           |
| PATCH  | `/people/{person_id}`        | admin | Partially update a person's metadata or profile-photo framing      |
| DELETE | `/people/{person_id}`        | admin | Delete a person and their face vectors                             |
| POST   | `/people/{person_id}/photo`  | admin | Replace the profile photo (must match the person's own face)       |
| POST   | `/people/{person_id}/photos` | admin | Add more enrollment photos to an existing person                    |
| POST   | `/enroll`                    | admin | Enroll a person from name + metadata + at least 5 usable photos    |
| POST   | `/search`                    | –     | Upload a photo, get the closest matching enrolled people           |
| POST   | `/compare`                   | –     | Upload two photos, get a similarity score and match/no-match       |

### `POST /enroll`

Form fields: `name` (required), `gender`, `race`, `birthday`, `profession`
(optional), `files` (multipart image files, at least 5 must yield a detectable face).
The first successfully-processed photo is uploaded to Cloudinary and stored as that
person's `image_link`.

### `POST /people/{person_id}/photo`

Multipart `file`. The photo must score above the match threshold against that
person's *existing* face embeddings (rejected otherwise) — this replaces the
display photo only and does not add a new search vector. Resets the photo's
framing (`photo_position_x/y`) back to centered.

### `POST /people/{person_id}/photos`

Multipart `files` (one or more). Each photo is checked the same way as above
(detectable face + matches this person); anything that fails either check is
skipped and listed in the response rather than rejecting the whole request.

### `POST /search`

Multipart `file` + optional `top_k` query param (default 1). Returns the closest
matching enrolled people with a similarity `score`.

### `POST /compare`

Multipart `file_a` + `file_b`. Returns a cosine similarity `score` and a boolean
`match` (threshold: 0.5).

## Frontend routes

| Path | Page | Auth |
|---|---|---|
| `/` | Search — upload a photo, find matches | Public |
| `/compare` | Compare two photos | Public |
| `/people/:id` | Person detail — view, and (if logged in) edit/delete/manage photos | Public to view |
| `/enroll` | Enroll a new person | Admin |
| `/people` | Browse the full roster | Admin |
| `/login` | Admin login | Public |

## Project structure

```
main.py                       FastAPI app, CORS, global error handler, Qdrant client lifecycle
api/
  routes.py                   Route handlers
  schemas.py                  Pydantic request/response models
  helpers.py                  Shared image-decode + embedding helper
  auth.py                     JWT issuance/verification, bcrypt check, require_admin dependency
db/
  postgres_store.py           Person metadata (Postgres, pooled connections)
  qdrant_store.py              Face embeddings (Qdrant Cloud + local backup mirror)
  cloudinary_store.py         Photo uploads
db_init_setup/
  setup_db.py                 Creates the Postgres `people` table
  setup_qdrant.py              Creates the Qdrant `faces` collection (cloud)
  migrate_qdrant_to_cloud.py  One-off: copy a local Qdrant collection to a cloud cluster
  migrate_sqlite_to_postgres.py  One-off: historical SQLite → Postgres data migration
  backfill_profile_photos.py  One-off: bulk-upload profile photos from a local folder
utils/
  embedding.py                InsightFace wrapper (detect + embed)
frontend/
  src/
    pages/                    UploadPage, PeopleListPage, PersonDetailPage, SearchPage,
                               ComparePage, LoginPage — one folder per page (jsx + css)
    components/                Presentational + form components shared across pages
    hooks/                     Per-feature state/data hooks (one per page's data needs)
    context/                   AuthContext (JWT token, login/logout)
    styles/                    Shared CSS (design tokens, reusable classes)
```
