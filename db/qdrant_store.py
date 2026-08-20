from qdrant_client import QdrantClient

QDRANT_PATH = "data/qdrant_db"
COLLECTION_NAME = "faces"

def get_client():
    return QdrantClient(path=QDRANT_PATH)


def search(vector, top_k=3):
    client = get_client()
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=top_k,
    ).points
    client.close()
    return results


def insert(points):
    client = get_client()
    client.upsert(collection_name=COLLECTION_NAME, points=points)
    client.close()