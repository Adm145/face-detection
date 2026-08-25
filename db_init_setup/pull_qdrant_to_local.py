from qdrant_client.models import PointStruct

from db.qdrant_store import COLLECTION_NAME, get_client, get_local_client

cloud_client = get_client()
local_client = get_local_client()

cloud_ids = set()
pulled = 0
offset = None

while True:
    points, offset = cloud_client.scroll(
        collection_name=COLLECTION_NAME,
        limit=100,
        offset=offset,
        with_vectors=True,
        with_payload=True,
    )
    if not points:
        break

    point_structs = [PointStruct(id=p.id, vector=p.vector, payload=p.payload) for p in points]
    local_client.upsert(collection_name=COLLECTION_NAME, points=point_structs)
    cloud_ids.update(p.id for p in points)
    pulled += len(points)
    print(f"Pulled {pulled} points so far...")

    if offset is None:
        break

# Remove local points for vectors deleted on the cloud since the last pull.
local_ids = set()
offset = None
while True:
    points, offset = local_client.scroll(
        collection_name=COLLECTION_NAME, limit=100, offset=offset, with_vectors=False, with_payload=False
    )
    if not points:
        break
    local_ids.update(p.id for p in points)
    if offset is None:
        break

stale_ids = local_ids - cloud_ids
if stale_ids:
    local_client.delete(collection_name=COLLECTION_NAME, points_selector=list(stale_ids))

local_count = local_client.count(collection_name=COLLECTION_NAME).count
cloud_count = cloud_client.count(collection_name=COLLECTION_NAME).count
print(f"Done. Pulled {pulled} points, removed {len(stale_ids)} stale. Local count: {local_count}, cloud count: {cloud_count}")

local_client.close()
