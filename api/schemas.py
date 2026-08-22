from typing import Optional

from pydantic import BaseModel


class PersonOut(BaseModel):
    id: int
    name: str
    gender: Optional[str] = None
    race: Optional[str] = None
    birthday: Optional[str] = None
    profession: Optional[str] = None
    slug: str


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
    birthday: Optional[str] = None
    profession: Optional[str] = None
    slug: str 
    score: float


class SearchResponse(BaseModel):
    matches: list[SearchResult]


class CompareResponse(BaseModel):
    similarity: float
    match: bool
