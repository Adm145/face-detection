import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from db.cloudinary_store import upload_photo
from db.sqlite_store import get_connection, update_person

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def find_person_id(cursor, name: str):
    cursor.execute("SELECT id FROM people WHERE LOWER(name) = LOWER(?)", (name,))
    row = cursor.fetchone()
    return row[0] if row else None


def main(folder: str):
    folder_path = Path(folder)
    if not folder_path.is_dir():
        print(f"Not a directory: {folder_path}")
        return

    connection = get_connection()
    cursor = connection.cursor()

    uploaded = []
    unmatched = []

    for file_path in sorted(folder_path.iterdir()):
        if file_path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        name = file_path.stem.replace("_", " ").strip()
        person_id = find_person_id(cursor, name)

        if person_id is None:
            unmatched.append(file_path.name)
            continue

        image_link = upload_photo(file_path.read_bytes())
        update_person(person_id, image_link=image_link)
        uploaded.append((person_id, name))
        print(f"Uploaded photo for '{name}' (id {person_id})")

    connection.close()

    print(f"\nDone. {len(uploaded)} uploaded, {len(unmatched)} unmatched.")
    if unmatched:
        print("Unmatched files (no person with this exact name):")
        for filename in unmatched:
            print(f"  {filename}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python db_init_setup/backfill_profile_photos.py <folder>")
        sys.exit(1)
    main(sys.argv[1])
