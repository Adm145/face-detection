import cv2
import numpy as np
import faiss
import pickle
from insightface.app import FaceAnalysis

QUERY_IMAGE_PATH = "data/raw/test3.jpg"
INDEX_PATH = "data/face_index.faiss"
NAMES_PATH = "data/face_names.pkl"
TOP_K = 5

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=-1, det_size=(640, 640))

index = faiss.read_index(INDEX_PATH)
with open(NAMES_PATH, "rb") as f:
    names = pickle.load(f)

image_bgr = cv2.imread(QUERY_IMAGE_PATH)
face = app.get(image_bgr)

if not face:
    raise ValueError(f"No face found in query image: {QUERY_IMAGE_PATH}")

query_embedding = face[0].embedding
query_embedding = query_embedding.reshape(1, -1).astype("float32")
faiss.normalize_L2(query_embedding)

similarities, positions = index.search(query_embedding, TOP_K)

print(f"Top {TOP_K} matches for {QUERY_IMAGE_PATH}:")
for similarity, position in zip(similarities[0], positions[0]):
    print(f"  {names[position]} — similarity {similarity:.3f}")
