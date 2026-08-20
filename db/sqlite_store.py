import sqlite3

DB_PATH = "data/people.db"

def get_connection():
    return sqlite3.connect(DB_PATH)


def get_person(person_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT id, name, gender, race, birthday, profession FROM people WHERE id = ?", (person_id,))
    row = cursor.fetchone()
    connection.close()
    return row


def list_people():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT id, name, gender, race FROM people ORDER BY name")
    rows = cursor.fetchall()
    connection.close()
    return rows


def update_person(person_id, name=None, gender=None, race=None):
    fields = {}
    if name is not None:
        fields["name"] = name
    if gender is not None:
        fields["gender"] = gender
    if race is not None:
        fields["race"] = race

    if not fields:
        return

    set_clause = ", ".join(f"{column} = ?" for column in fields)
    values = list(fields.values()) + [person_id]

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(f"UPDATE people SET {set_clause} WHERE id = ?", values)
    connection.commit()
    connection.close()


def insert_person(name, gender, race):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT OR IGNORE INTO people (name, gender, race) VALUES (?, ?, ?)",
        (name, gender, race),
    )
    connection.commit()

    cursor.execute("SELECT id FROM people WHERE name = ?", (name,))
    person_id = cursor.fetchone()[0]

    connection.close()
    return person_id