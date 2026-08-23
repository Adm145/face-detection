import cloudinary
import cloudinary.uploader


def upload_photo(data: bytes) -> str:
    result = cloudinary.uploader.upload(data, folder="people")
    return result["secure_url"]
