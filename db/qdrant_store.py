from qdrant_client import QdrantClient
from qdrant_client.models import FieldCondition, Filter, MatchValue

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


def delete_by_person(person_id: int):
    get_client().delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(must=[FieldCondition(key="personId", match=MatchValue(value=person_id))]),
    )