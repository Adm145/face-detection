from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PayloadSchemaType, PointStruct, VectorParams

from db.qdrant_store import COLLECTION_NAME, get_client

LOCAL_QDRANT_PATH = "data/qdrant_db"
VECTOR_SIZE = 512

local_client = QdrantClient(path=LOCAL_QDRANT_PATH)
cloud_client = get_client()

if not cloud_client.collection_exists(COLLECTION_NAME):
    cloud_client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
    )
    cloud_client.create_payload_index(
        collection_name=COLLECTION_NAME, field_name="personId", field_schema=PayloadSchemaType.INTEGER
    )
    print(f"Created collection '{COLLECTION_NAME}' ({VECTOR_SIZE}-d, cosine) with personId index on cloud cluster")

migrated = 0
offset = None
while True:
    points, offset = local_client.scroll(
        collection_name=COLLECTION_NAME,
        limit=100,
        offset=offset,
        with_vectors=True,
        with_payload=True,
    )
    if not points:
        break

    point_structs = [PointStruct(id=p.id, vector=p.vector, payload=p.payload) for p in points]
    cloud_client.upsert(collection_name=COLLECTION_NAME, points=point_structs)
    migrated += len(points)
    print(f"Migrated {migrated} points so far...")

    if offset is None:
        break

local_count = local_client.count(collection_name=COLLECTION_NAME).count
cloud_count = cloud_client.count(collection_name=COLLECTION_NAME).count
print(f"Done. Local count: {local_count}, cloud count: {cloud_count}")

local_client.close()
