import glob
import uuid

from qdrant_client.models import PointStruct

from utils.embedding import get_image_bgr, get_embedding
from db.sqlite_store import insert_person
from db.qdrant_store import insert

PERSON_NAME = "Kendrick Lamar"
GENDER = "Male"
RACE = "White"
PHOTOS_FOLDER = f"data/enroll/{PERSON_NAME}"
MIN_PHOTOS = 5

photo_paths = glob.glob(f"{PHOTOS_FOLDER}/*.jpg")

embeddings = []

for photo_path in photo_paths:
    image_bgr = get_image_bgr(photo_path)
    embedding = get_embedding(image_bgr)

    if embedding is None:
        print(f"Skipped {photo_path}: no face detected")
        continue

    embeddings.append(embedding)

if len(embeddings) < MIN_PHOTOS:
    raise ValueError(f"Only {len(embeddings)} usable photos found for {PERSON_NAME}, need at least {MIN_PHOTOS}")

person_id = insert_person(PERSON_NAME, GENDER, RACE)

points = [
    PointStruct(
        id=str(uuid.uuid4()),
        vector=embedding.tolist(),
        payload={"personId": person_id},
    )
    for embedding in embeddings
]

insert(points)

print(f"Enrolled {PERSON_NAME} with {len(points)} photos (personId={person_id}).")