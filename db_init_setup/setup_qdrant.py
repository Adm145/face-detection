from qdrant_client.models import Distance, PayloadSchemaType, VectorParams
from db.qdrant_store import get_client, COLLECTION_NAME

client = get_client()
VECTOR_SIZE = 512

client.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
)
client.create_payload_index(collection_name=COLLECTION_NAME, field_name="personId", field_schema=PayloadSchemaType.INTEGER)

print(f"Created collection '{COLLECTION_NAME}' ({VECTOR_SIZE}-d, cosine) with personId index")

client.close()
