import cloudinary
import cloudinary.uploader


def upload_photo(data: bytes, public_id: str) -> str:
    result = cloudinary.uploader.upload(data, public_id=public_id, folder="people")
    return result["secure_url"]
