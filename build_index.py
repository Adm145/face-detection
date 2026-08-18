import cv2
import numpy as np
import faiss
import pickle
from sklearn.datasets import fetch_lfw_people
from insightface.app import FaceAnalysis

MIN_FACES_PER_PERSON = 20
INDEX_PATH = "data/face_index.faiss"
NAMES_PATH = "data/face_names.pkl"

# 'buffalo_l' - a model bundle that handles face detection & embedding
app = FaceAnalysis(name="buffalo_l")

# standard version choice and setting a fixed the resolution size
app.prepare(ctx_id=-1, det_size=(640, 640))


def get_embedding(image_bgr):
    #app.get -> 1) detects face from pixel array returning a box and facial features
    #           2) aligns and crops the image to a 112x112 size
    #           3) passes the cropped 112x112 through the recog model producing the 512-d vector
    faces = app.get(image_bgr)

    if not faces:
        return None
    
    return faces[0].embedding


print("Loading LFW dataset...")
lfw = fetch_lfw_people(min_faces_per_person=MIN_FACES_PER_PERSON, color=True, resize=1.0)
print("Finished loading LFW dataset!")

embeddings = []
names = []
skipped = 0

for image, label in zip(lfw.images, lfw.target):
    # 'lfw' stores pixels as floates -> cv2 and insightFace accept standard uint8 (0-255) types
    image_uint8 = (image * 255).astype(np.uint8)
    image_bgr = cv2.cvtColor(image_uint8, cv2.COLOR_RGB2BGR)
    image_bgr = cv2.copyMakeBorder(image_bgr, 60, 60, 60, 60, cv2.BORDER_REPLICATE)
    embedding = get_embedding(image_bgr)

    if embedding is None:
        skipped += 1
        print(skipped)
        continue

    embeddings.append(embedding)
    names.append(lfw.target_names[label])

print(f"Embedded {len(embeddings)} faces, skipped {skipped} (no face detected)")


embeddings = np.array(embeddings).astype("float32")
faiss.normalize_L2(embeddings)

index = faiss.IndexFlatIP(embeddings.shape[1])
index.add(embeddings)

faiss.write_index(index, INDEX_PATH)
with open(NAMES_PATH, "wb") as f:
    pickle.dump(names, f)

print(f"Saved index with {index.ntotal} vectors to {INDEX_PATH}")