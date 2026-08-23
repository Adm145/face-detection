# face-detection

A FastAPI service for face recognition: enroll people from photos, then search an
uploaded photo against enrolled faces, or compare two faces directly.

Face embeddings are generated with [InsightFace](https://github.com/deepinsight/insightface)
(`buffalo_l`), stored and searched with [Qdrant](https://qdrant.tech/) (embedded/local mode),
person metadata lives in SQLite, and enrollment photos are hosted on
[Cloudinary](https://cloudinary.com/).

## Tech stack

- **FastAPI** + Uvicorn — HTTP API
- **InsightFace** (`buffalo_l`) + OpenCV — face detection and 512-d embeddings
- **Qdrant** (embedded, file-based) — vector similarity search
- **SQLite** — person metadata (name, gender, race, birthday, profession, image link)
- **Cloudinary** — enrollment photo storage

## Setup

### 1. Install dependencies

```bash
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt
```

### 2. Configure environment variables

Copy the example file and fill in your own Cloudinary credentials (from your
[Cloudinary dashboard](https://console.cloudinary.com/)):

```bash
cp .env.example .env
```

`.env`:
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=cloudinary://${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}@${CLOUDINARY_CLOUD_NAME}
```

`CLOUDINARY_URL` is built from the three values above — change any one of them and
it updates automatically. `.env` is gitignored; never commit real credentials.

### 3. Initialize local data stores

The repo already ships with a populated `data/` folder (SQLite DB + Qdrant collection),
so this step is only needed if you're starting from an empty `data/` directory:

```bash
.venv/Scripts/python db_init_setup/setup_db.py
.venv/Scripts/python db_init_setup/setup_qdrant.py
```

## Running the server

```bash
fastapi dev main.py
```

By default this binds to `127.0.0.1` (localhost only). To make it reachable from
another machine on the same network:

```bash
fastapi dev main.py --host 0.0.0.0
```

Interactive API docs (Swagger UI) are available at `/docs` once the server is running.

## API

| Method | Path                 | Description                                                        |
|--------|----------------------|----------------------------------------------------------------------|
| GET    | `/health`            | Health check                                                       |
| GET    | `/people`            | List all enrolled people                                           |
| PATCH  | `/people/{person_id}`| Partially update a person's metadata                                |
| POST   | `/enroll`             | Enroll a person from name + metadata + at least 5 usable photos    |
| POST   | `/search`             | Upload a photo, get the closest matching enrolled people           |
| POST   | `/compare`            | Upload two photos, get a similarity score and match/no-match       |

### `POST /enroll`

Form fields: `name` (required), `gender`, `race`, `birthday`, `profession`
(optional), `files` (multipart image files, at least 5 must yield a detectable face).
The first successfully-processed photo is uploaded to Cloudinary and stored as that
person's `image_link`.

### `POST /search`

Multipart `file` + optional `top_k` query param (default 3). Returns the closest
matching enrolled people with a similarity `score`.

### `POST /compare`

Multipart `file_a` + `file_b`. Returns a cosine similarity `score` and a boolean
`match` (threshold: 0.5).

## Project structure

```
main.py                       FastAPI app, CORS, global error handler, Qdrant client lifecycle
api/
  routes.py                   Route handlers
  schemas.py                  Pydantic request/response models
  helpers.py                  Shared image-decode + embedding helper
db/
  sqlite_store.py             Person metadata (SQLite)
  qdrant_store.py             Face embeddings (Qdrant)
  cloudinary_store.py         Enrollment photo uploads
db_init_setup/
  setup_db.py                 Creates the SQLite `people` table
  setup_qdrant.py             Creates the Qdrant `faces` collection
utils/
  embedding.py                InsightFace wrapper (detect + embed)
```
