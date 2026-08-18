import glob
import cv2
import numpy as np
import faiss
import pickle
from insightface.app import FaceAnalysis

PERSON_NAME = "Your_Name_Here"
PHOTOS_FOLDER = f"data/enroll/{PERSON_NAME}"
MIN_PHOTOS = 5
INDEX_PATH = "data/face_index.faiss"
NAMES_PATH = "data/face_names.pkl"

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=-1, det_size=(640, 640))

index = faiss.read_index(INDEX_PATH)
with open(NAMES_PATH, "rb") as f:
    names = pickle.load(f)

photo_paths = glob.glob(f"{PHOTOS_FOLDER}/*.jpg")

embeddings = []

for photo_path in photo_paths:
    image_bgr = cv2.imread(photo_path)
    faces = app.get(image_bgr)

    if not faces:
        print(f"Skipped {photo_path}: no face detected")
        continue

    embeddings.append(faces[0].embedding)

if len(embeddings) < MIN_PHOTOS:
    raise ValueError(f"Only {len(embeddings)} usable photos found for {PERSON_NAME}, need at least {MIN_PHOTOS}")

embeddings = np.array(embeddings).astype("float32")
faiss.normalize_L2(embeddings)

index.add(embeddings)
names.extend([PERSON_NAME] * len(embeddings))

faiss.write_index(index, INDEX_PATH)
with open(NAMES_PATH, "wb") as f:
    pickle.dump(names, f)

print(f"Enrolled {PERSON_NAME} with {len(embeddings)} photos. Index now has {index.ntotal} vectors.")
