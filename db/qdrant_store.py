from qdrant_client import QdrantClient

QDRANT_PATH = "data/qdrant_db"
COLLECTION_NAME = "faces"

_client: QdrantClient | None = None

def get_client() -> QdrantClient:
    global _client
    if _client is None:
        _client = QdrantClient(path=QDRANT_PATH)
    return _client


def close_client() -> QdrantClient:
    global _client
    if _client is not None:
        _client.close()
        _client = None


def search(vector, top_k=3):
    return get_client().query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=top_k,
    ).points


def insert(points):
    get_client().upsert(collection_name=COLLECTION_NAME, points=points)