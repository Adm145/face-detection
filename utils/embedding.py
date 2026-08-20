import cv2
import numpy as np
from insightface.app import FaceAnalysis

app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=-1, det_size=(640, 640))

def get_image_bgr(image_path):
    image_bgr = cv2.imread(image_path)
    return image_bgr

def get_image_bgr_from_bytes(data):
    array = np.frombuffer(data, dtype=np.uint8)
    return cv2.imdecode(array, cv2.IMREAD_COLOR)

def get_embedding(image_bgr):
    faces = app.get(image_bgr)
    if not faces:
        return None
    return faces[0].embedding