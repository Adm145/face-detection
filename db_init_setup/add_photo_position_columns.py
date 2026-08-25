from db.sqlite_store import get_connection

connection = get_connection()
cursor = connection.cursor()
cursor.execute("ALTER TABLE people ADD COLUMN photo_position_x REAL DEFAULT 50")
cursor.execute("ALTER TABLE people ADD COLUMN photo_position_y REAL DEFAULT 50")
connection.commit()
connection.close()

print("Added photo_position_x/photo_position_y columns (default 50, 50)")
