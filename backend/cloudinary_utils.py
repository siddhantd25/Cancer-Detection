import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_image(file_bytes: bytes, user_id: str) -> str:
    """
    Upload image bytes to Cloudinary under the cancer_detect/uploads folder.
    Returns the secure URL of the uploaded image.
    """
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=f"cancer_detect/{user_id}",
        resource_type="image",
        quality="auto",
        fetch_format="auto",
    )
    return result["secure_url"]


def delete_image(public_id: str) -> None:
    """Delete an image from Cloudinary by its public_id."""
    cloudinary.uploader.destroy(public_id)
