from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator

BIRTHDAY_FORMAT = "%d-%m-%Y"


def validate_birthday(value: Optional[str]) -> Optional[str]:
    if value is None:
        return value
    try:
        datetime.strptime(value, BIRTHDAY_FORMAT)
    except ValueError:
        raise ValueError("birthday must be in DD-MM-YYYY format")
    return value


class PersonOut(BaseModel):
    id: int
    name: str
    gender: Optional[str] = None
    race: Optional[str] = None
    birthday: Optional[str] = None
    profession: Optional[str] = None
    image_link: Optional[str] = None
    photo_position_x: float = 50
    photo_position_y: float = 50

    _validate_birthday = field_validator("birthday")(validate_birthday)


class PersonUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    race: Optional[str] = None
    birthday: Optional[str] = None
    profession: Optional[str] = None
    image_link: Optional[str] = None
    photo_position_x: Optional[float] = None
    photo_position_y: Optional[float] = None

    _validate_birthday = field_validator("birthday")(validate_birthday)


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
    image_link: Optional[str] = None
    photo_position_x: float = 50
    photo_position_y: float = 50
    score: float


class SearchResponse(BaseModel):
    matches: list[SearchResult]


class CompareResponse(BaseModel):
    similarity: float
    match: bool


class DeleteResponse(BaseModel):
    person_id: int
    deleted: bool


class AddPhotosResponse(BaseModel):
    person_id: int
    added_count: int
    skipped_files: list[str]


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
