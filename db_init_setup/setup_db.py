from db.sqlite_store import get_connection, DB_PATH

connection = get_connection()
cursor = connection.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS people (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL UNIQUE,
        gender     TEXT,
        race       TEXT,
        birthday   TEXT,
        profession TEXT
    )
""")

connection.commit()
connection.close()

print(f"Initialized {DB_PATH} with 'people' table.")