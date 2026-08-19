import cv2
import numpy as np
from insightface.app import FaceAnalysis

IMAGE_PATH_A = "data/raw/test.jpg"
IMAGE_PATH_B = "data/raw/test4.jpg"

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=-1, det_size=(640, 640))


def get_embedding(image_path):
    # reads the image as a grid of numbers representing pixel colors by BGR order
    image_bgr = cv2.imread(image_path)
    # gets the image embedding
    faces = app.get(image_bgr)

    if not faces:
        raise ValueError(f"No face found in {image_path}")
    
    #returns the first face that matched
    return faces[0].embedding

embedding_a = get_embedding(IMAGE_PATH_A)
embedding_b = get_embedding(IMAGE_PATH_B)

# vector calculation
dot_product = np.dot(embedding_a, embedding_b)
magnitude_a = np.linalg.norm(embedding_a)
magnitude_b = np.linalg.norm(embedding_b)

# final similarity score
similarity = dot_product / (magnitude_a * magnitude_b)

print(f"Cosine similarity: {similarity:.3f}")
