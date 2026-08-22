import uuid
from typing import Optional

import numpy as np
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from qdrant_client.models import PointStruct

from api.helpers import decode_and_embed
from api.schemas import CompareResponse, EnrollResponse, PersonOut, PersonUpdate, SearchResponse, SearchResult
from db.qdrant_store import insert, search
from db.sqlite_store import get_person, insert_person, list_people, update_person

router = APIRouter()

MIN_ENROLL_PHOTOS = 5
MATCH_THRESHOLD = 0.5


@router.get("/people", response_model=list[PersonOut])
def get_people():
    rows = list_people()
    return [
        PersonOut(id=row[0], name=row[1], gender=row[2], race=row[3], birthday=row[4], profession=row[5], slug=row[6])
        for row in rows
    ]


@router.patch("/people/{person_id}", response_model=PersonOut)
def update_person_route(person_id: int, payload: PersonUpdate):
    update_person(
        person_id,
        name=payload.name,
        gender=payload.gender,
        race=payload.race,
        birthday=payload.birthday,
        profession=payload.profession,
        slug=payload.slug,
    )
    row = get_person(person_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Person not found")
    return PersonOut(id=row[0], name=row[1], gender=row[2], race=row[3], birthday=row[4], profession=row[5], slug=row[6])


@router.post("/enroll", response_model=EnrollResponse)
async def enroll(
    name: str = Form(...),
    gender: Optional[str] = Form(None),
    race: Optional[str] = Form(None),
    birthday: Optional[str] = Form(None),
    profession: Optional[str] = Form(None),
    slug: str = Form(...),
    files: list[UploadFile] = File(...),
):
    embeddings = []
    skipped_files = []

    for file in files:
        data = await file.read()
        try:
            embedding = decode_and_embed(data, file.filename)
        except HTTPException:
            skipped_files.append(file.filename)
            continue

        embeddings.append(embedding)

    if len(embeddings) < MIN_ENROLL_PHOTOS:
        raise HTTPException(
            status_code=400,
            detail=f"Only {len(embeddings)} usable photos found, need at least {MIN_ENROLL_PHOTOS}",
        )

    person_id = insert_person(name, gender, race, birthday, profession, slug)

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


@router.post("/search", response_model=SearchResponse, response_model_exclude_none=True) #top_k = param -> ...?top_k=3
async def search_face(file: UploadFile = File(...), top_k: int = 3):
    data = await file.read()
    embedding = decode_and_embed(data, "uploaded image")

    results = search(embedding.tolist(), top_k)

    matches = []
    for result in results:
        person_id = result.payload["personId"]
        row = get_person(person_id)
        if row is None:
            continue
        _, name, gender, race, birthday, profession, slug = row
        matches.append(
            SearchResult(
                person_id=person_id,
                name=name,
                gender=gender,
                race=race,
                birthday=birthday,
                profession=profession,
                slug=slug,
                score=result.score,
            )
        )

    return SearchResponse(matches=matches)


@router.post("/compare", response_model=CompareResponse)
async def compare_faces(file_a: UploadFile = File(...), file_b: UploadFile = File(...)):
    data_a = await file_a.read()
    data_b = await file_b.read()

    embedding_a = decode_and_embed(data_a, "first image")
    embedding_b = decode_and_embed(data_b, "second image")

    similarity = float(
        np.dot(embedding_a, embedding_b)
        / (np.linalg.norm(embedding_a) * np.linalg.norm(embedding_b))
    )

    return CompareResponse(similarity=similarity, match=similarity >= MATCH_THRESHOLD)
