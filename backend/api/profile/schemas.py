from ninja import Schema
from typing import Optional

class UserProfileSchema(Schema):
    country: str
    streaming_services: str
    preferred_genres: str
    profile_picture: Optional[str] = None
    bio: str

    @staticmethod
    def resolve_profile_picture(obj):
        return obj.get_profile_picture_url()

class UserProfileUpdateSchema(Schema):
    country: Optional[str]
    streaming_services: Optional[str]
    preferred_genres: Optional[str]
    bio: Optional[str]
   