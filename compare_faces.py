from utils.embedding import get_image_bgr, get_embedding
import numpy as np

IMAGE_PATH_A = "data/raw/test.jpg"
IMAGE_PATH_B = "data/raw/test4.jpg"

image_bgr_a = get_image_bgr(IMAGE_PATH_A)
image_bgr_b = get_image_bgr(IMAGE_PATH_B)

embedding_a = get_embedding(image_bgr_a)
embedding_b = get_embedding(image_bgr_b)

if embedding_a is None:
    raise ValueError(f"No face found in {IMAGE_PATH_A}")
if embedding_b is None:
    raise ValueError(f"No face found in {IMAGE_PATH_B}")

# vector calculation
dot_product = np.dot(embedding_a, embedding_b)
magnitude_a = np.linalg.norm(embedding_a)
magnitude_b = np.linalg.norm(embedding_b)

# final similarity score
similarity = dot_product / (magnitude_a * magnitude_b)

print(f"Cosine similarity: {similarity:.3f}")
