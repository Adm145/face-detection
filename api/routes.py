import uuid
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from qdrant_client.models import PointStruct

from api.schemas import EnrollResponse, PersonOut, SearchResponse, SearchResult
from db.qdrant_store import insert, search
from db.sqlite_store import get_person, insert_person, list_people
from utils.embedding import get_embedding, get_image_bgr_from_bytes

router = APIRouter()

MIN_ENROLL_PHOTOS = 5


@router.get("/people", response_model=list[PersonOut])
def get_people():
    rows = list_people()
    return [
        PersonOut(id=row[0], name=row[1], gender=row[2], race=row[3])
        for row in rows
    ]


@router.post("/enroll", response_model=EnrollResponse)
async def enroll(
    name: str = Form(...),
    gender: Optional[str] = Form(None),
    race: Optional[str] = Form(None),
    files: list[UploadFile] = File(...),
):
    embeddings = []
    skipped_files = []

    for file in files:
        data = await file.read()
        image_bgr = get_image_bgr_from_bytes(data)
        embedding = get_embedding(image_bgr)

        if embedding is None:
            skipped_files.append(file.filename)
            continue

        embeddings.append(embedding)

    if len(embeddings) < MIN_ENROLL_PHOTOS:
        raise HTTPException(
            status_code=400,
            detail=f"Only {len(embeddings)} usable photos found, need at least {MIN_ENROLL_PHOTOS}",
        )

    person_id = insert_person(name, gender, race)

    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding.tolist(),
            payload={"personId": person_id},
        )
        for embedding in embeddings
    ]

    insert(points)

    return EnrollResponse(
        person_id=person_id,
        name=name,
        enrolled_count=len(points),
        skipped_files=skipped_files,
    )


@router.post("/search", response_model=SearchResponse)
async def search_face(file: UploadFile = File(...), top_k: int = 3):
    data = await file.read()
    image_bgr = get_image_bgr_from_bytes(data)
    embedding = get_embedding(image_bgr)

    if embedding is None:
        raise HTTPException(status_code=400, detail="No face found in uploaded image")

    results = search(embedding.tolist(), top_k)

    matches = []
    for result in results:
        person_id = result.payload["personId"]
        row = get_person(person_id)
        if row is None:
            continue
        _, name, gender, race = row
        matches.append(
            SearchResult(
                person_id=person_id,
                name=name,
                gender=gender,
                race=race,
                score=result.score,
            )
        )

    return SearchResponse(matches=matches)
