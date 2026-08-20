from typing import Optional

from pydantic import BaseModel


class PersonOut(BaseModel):
    id: int
    name: str
    gender: str
    race: str


class EnrollResponse(BaseModel):
    person_id: int
    name: str
    enrolled_count: int
    skipped_files: list[str]


class SearchResult(BaseModel):
    person_id: int
    name: str
    gender: Optional[str] = None
    race: Optional[str] = None
    score: float


class SearchResponse(BaseModel):
    matches: list[SearchResult]
