import csv
from db.postgres_store import close_pool, get_pool
from db.qdrant_store import  get_client


COLLECTION_NAME = "faces"
OUT_PATH = "data/qdrant_view.csv"

client = get_client()           #qdrant


with get_pool().connection() as connection:
    people = {
        person_id: (name, gender, race)
        for person_id, name, gender, race in connection.execute(
            "SELECT id, name, gender, race FROM people"
        )
    }
close_pool()


rows = []
offset = None

while True:
    points, offset = client.scroll(
        collection_name=COLLECTION_NAME,
        limit=256,
        offset=offset,
        with_payload=True,
        with_vectors=True,
    )

    for point in points:
        person_id = point.payload["personId"]
        name, gender, race = people.get(person_id, (None, None, None))
        rows.append([point.id, person_id, name, gender, race])

    if offset is None:
        break

client.close()

with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["point_id", "person_id", "name", "gender", "race"])
    writer.writerows(rows)

print(f"Wrote {len(rows)} rows to {OUT_PATH}")
