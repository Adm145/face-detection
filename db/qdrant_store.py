import logging
import os

from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, FieldCondition, Filter, MatchValue, PayloadSchemaType, VectorParams

load_dotenv()

logger = logging.getLogger(__name__)

COLLECTION_NAME = "faces"
VECTOR_SIZE = 512
LOCAL_QDRANT_PATH = "data/qdrant_db"

_client: QdrantClient | None = None
_local_client: QdrantClient | None = None

def get_client() -> QdrantClient:
    global _client
    if _client is None:
        _client = QdrantClient(url=os.environ["QDRANT_CLUSTER_URL"], api_key=os.environ["QDRANT_API_KEY"])
    return _client


def get_local_client() -> QdrantClient:
    global _local_client
    if _local_client is None:
        _local_client = QdrantClient(path=LOCAL_QDRANT_PATH)
        if not _local_client.collection_exists(COLLECTION_NAME):
            _local_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
            )
        _local_client.create_payload_index(
            collection_name=COLLECTION_NAME, field_name="personId", field_schema=PayloadSchemaType.INTEGER
        )
    return _local_client


def close_client() -> None:
    global _client, _local_client
    if _client is not None:
        _client.close()
        _client = None
    if _local_client is not None:
        _local_client.close()
        _local_client = None


def search(vector, top_k=3):
    return get_client().query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=top_k,
    ).points


def insert(points):
    get_client().upsert(collection_name=COLLECTION_NAME, points=points)
    try:
        get_local_client().upsert(collection_name=COLLECTION_NAME, points=points)
    except Exception:
        logger.exception("Failed to write local Qdrant backup copy")


def search_within_person(vector, person_id: int, top_k=1):
    return get_client().query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        query_filter=Filter(must=[FieldCondition(key="personId", match=MatchValue(value=person_id))]),
        limit=top_k,
    ).points


def delete_by_person(person_id: int):
    get_client().delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(must=[FieldCondition(key="personId", match=MatchValue(value=person_id))]),
    )
    try:
        get_local_client().delete(
            collection_name=COLLECTION_NAME,
            points_selector=Filter(must=[FieldCondition(key="personId", match=MatchValue(value=person_id))]),
        )
    except Exception:
        logger.exception("Failed to delete local Qdrant backup copy")