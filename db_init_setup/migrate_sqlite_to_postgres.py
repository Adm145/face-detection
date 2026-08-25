import sqlite3

from db.postgres_store import close_pool, get_pool

SQLITE_PATH = "data/people.db"

sqlite_connection = sqlite3.connect(SQLITE_PATH)
sqlite_cursor = sqlite_connection.cursor()
sqlite_cursor.execute(
    "SELECT id, name, gender, race, birthday, profession, image_link, photo_position_x, photo_position_y FROM people ORDER BY id"
)
rows = sqlite_cursor.fetchall()
sqlite_connection.close()

with get_pool().connection() as connection:
    for row in rows:
        connection.execute(
            """
            INSERT INTO people (id, name, gender, race, birthday, profession, image_link, photo_position_x, photo_position_y)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """,
            row,
        )

    # Future inserts that don't specify an id (insert_person) must continue
    # after the highest migrated id, not restart from 1.
    connection.execute(
        "SELECT setval(pg_get_serial_sequence('people', 'id'), COALESCE((SELECT MAX(id) FROM people), 1))"
    )
    migrated_count = connection.execute("SELECT COUNT(*) FROM people").fetchone()[0]

print(f"Migrated {len(rows)} rows from SQLite. Postgres now has {migrated_count} people.")
close_pool()
