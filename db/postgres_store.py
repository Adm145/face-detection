import logging
import os
import sqlite3

from dotenv import load_dotenv
from psycopg_pool import ConnectionPool

load_dotenv()

logger = logging.getLogger(__name__)

LOCAL_DB_PATH = "data/people.db"

_pool: ConnectionPool | None = None


def get_pool() -> ConnectionPool:
    global _pool
    if _pool is None:
        _pool = ConnectionPool(
            os.environ["DATABASE_URL"],
            kwargs={"autocommit": True},
            open=True,
            check=ConnectionPool.check_connection,
        )
    return _pool


def close_pool():
    global _pool
    if _pool is not None:
        _pool.close()
        _pool = None


def get_local_connection():
    connection = sqlite3.connect(LOCAL_DB_PATH)
    connection.execute("""
        CREATE TABLE IF NOT EXISTS people (
            id                 INTEGER PRIMARY KEY,
            name               TEXT NOT NULL UNIQUE,
            gender             TEXT,
            race               TEXT,
            birthday           TEXT,
            profession         TEXT,
            image_link         TEXT,
            photo_position_x   REAL DEFAULT 50,
            photo_position_y   REAL DEFAULT 50
        )
    """)
    return connection


def get_person(person_id):
    with get_pool().connection() as connection:
        cursor = connection.execute(
            "SELECT id, name, gender, race, birthday, profession, image_link, photo_position_x, photo_position_y FROM people WHERE id = %s",
            (person_id,),
        )
        return cursor.fetchone()


def list_people():
    with get_pool().connection() as connection:
        cursor = connection.execute(
            "SELECT id, name, gender, race, birthday, profession, image_link, photo_position_x, photo_position_y FROM people ORDER BY id"
        )
        return cursor.fetchall()


def update_person(
    person_id,
    name=None,
    gender=None,
    race=None,
    birthday=None,
    profession=None,
    image_link=None,
    photo_position_x=None,
    photo_position_y=None,
):
    fields = {}
    if name is not None:
        fields["name"] = name
    if gender is not None:
        fields["gender"] = gender
    if race is not None:
        fields["race"] = race
    if birthday is not None:
        fields["birthday"] = birthday
    if profession is not None:
        fields["profession"] = profession
    if image_link is not None:
        fields["image_link"] = image_link
    if photo_position_x is not None:
        fields["photo_position_x"] = photo_position_x
    if photo_position_y is not None:
        fields["photo_position_y"] = photo_position_y

    if not fields:
        return

    with get_pool().connection() as connection:
        set_clause = ", ".join(f"{column} = %s" for column in fields)
        values = list(fields.values()) + [person_id]
        connection.execute(f"UPDATE people SET {set_clause} WHERE id = %s", values)

    try:
        local = get_local_connection()
        set_clause = ", ".join(f"{column} = ?" for column in fields)
        values = list(fields.values()) + [person_id]
        local.execute(f"UPDATE people SET {set_clause} WHERE id = ?", values)
        local.commit()
        local.close()
    except Exception:
        logger.exception("Failed to write local SQLite backup copy")


def insert_person(name, gender, race, birthday=None, profession=None, image_link=None):
    with get_pool().connection() as connection:
        connection.execute(
            """
            INSERT INTO people (name, gender, race, birthday, profession, image_link)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (name) DO NOTHING
            """,
            (name, gender, race, birthday, profession, image_link),
        )
        cursor = connection.execute("SELECT id FROM people WHERE name = %s", (name,))
        person_id = cursor.fetchone()[0]

    try:
        local = get_local_connection()
        local.execute(
            "INSERT OR IGNORE INTO people (id, name, gender, race, birthday, profession, image_link) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (person_id, name, gender, race, birthday, profession, image_link),
        )
        local.commit()
        local.close()
    except Exception:
        logger.exception("Failed to write local SQLite backup copy")

    return person_id


def delete_person(person_id):
    with get_pool().connection() as connection:
        connection.execute("DELETE FROM people WHERE id = %s", (person_id,))

    try:
        local = get_local_connection()
        local.execute("DELETE FROM people WHERE id = ?", (person_id,))
        local.commit()
        local.close()
    except Exception:
        logger.exception("Failed to delete local SQLite backup copy")
