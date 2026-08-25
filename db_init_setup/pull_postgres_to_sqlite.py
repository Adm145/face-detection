from db.postgres_store import close_pool, get_local_connection, get_pool

with get_pool().connection() as connection:
    rows = connection.execute(
        "SELECT id, name, gender, race, birthday, profession, image_link, photo_position_x, photo_position_y FROM people"
    ).fetchall()
close_pool()

local = get_local_connection()

local.executemany(
    """
    INSERT INTO people (id, name, gender, race, birthday, profession, image_link, photo_position_x, photo_position_y)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
        name = excluded.name,
        gender = excluded.gender,
        race = excluded.race,
        birthday = excluded.birthday,
        profession = excluded.profession,
        image_link = excluded.image_link,
        photo_position_x = excluded.photo_position_x,
        photo_position_y = excluded.photo_position_y
    """,
    rows,
)

# Remove local rows for people deleted on Postgres since the last pull.
pulled_ids = [row[0] for row in rows]
if pulled_ids:
    placeholders = ",".join("?" for _ in pulled_ids)
    local.execute(f"DELETE FROM people WHERE id NOT IN ({placeholders})", pulled_ids)
else:
    local.execute("DELETE FROM people")

local.commit()
local_count = local.execute("SELECT COUNT(*) FROM people").fetchone()[0]
local.close()

print(f"Pulled {len(rows)} people from Postgres. Local backup now has {local_count}.")
