import numpy as np
from fastapi import HTTPException

from utils.embedding import get_embedding, get_image_bgr_from_bytes


def decode_and_embed(data: bytes, label: str) -> np.ndarray:
    image_bgr = get_image_bgr_from_bytes(data)
    if image_bgr is None:
        raise HTTPException(status_code=400, detail=f"Could not read {label} as an image")

    embedding = get_embedding(image_bgr)
    if embedding is None:
        raise HTTPException(status_code=400, detail=f"No face found in {label}")

    return embedding
