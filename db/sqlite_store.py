import sqlite3

DB_PATH = "data/people.db"

def get_connection():
    return sqlite3.connect(DB_PATH)


def get_person(person_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "SELECT id, name, gender, race, birthday, profession, image_link, photo_position_x, photo_position_y FROM people WHERE id = ?",
        (person_id,),
    )
    row = cursor.fetchone()
    connection.close()
    return row


def list_people():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "SELECT id, name, gender, race, birthday, profession, image_link, photo_position_x, photo_position_y FROM people ORDER BY id"
    )
    rows = cursor.fetchall()
    connection.close()
    return rows


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

    set_clause = ", ".join(f"{column} = ?" for column in fields)
    values = list(fields.values()) + [person_id]

    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(f"UPDATE people SET {set_clause} WHERE id = ?", values)
    connection.commit()
    connection.close()


def insert_person(name, gender, race, birthday=None, profession=None, image_link=None):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "INSERT OR IGNORE INTO people (name, gender, race, birthday, profession, image_link) VALUES (?, ?, ?, ?, ?, ?)",
        (name, gender, race, birthday, profession, image_link),
    )
    connection.commit()

    cursor.execute("SELECT id FROM people WHERE name = ?", (name,))
    person_id = cursor.fetchone()[0]

    connection.close()
    return person_id


def delete_person(person_id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM people WHERE id = ?", (person_id,))
    connection.commit()
    connection.close()