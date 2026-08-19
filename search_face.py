from utils.embedding import get_image_bgr, get_embedding
from db.qdrant_store import search
from db.sqlite_store import get_person

QUERY_IMAGE_PATH = "data/raw/test1.jpg"
TOP_K = 3

image_bgr = get_image_bgr(QUERY_IMAGE_PATH)
embedding = get_embedding(image_bgr)

if embedding is None:
    raise ValueError(f"No face found in query image: {QUERY_IMAGE_PATH}")

results = search(embedding.tolist(), TOP_K)

print(f"Top {TOP_K} matches for {QUERY_IMAGE_PATH}:")
for result in results:
    person_id = result.payload["personId"]
    _, name, gender, race = get_person(person_id)
    print(f"  {name} ({gender}, {race}) — similarity {result.score:.3f}")