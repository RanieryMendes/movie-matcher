from ninja import Schema
from typing import Optional, List

class UserProfileSchema(Schema):
    country: str
    streaming_services: List[str]
    preferred_genres: List[str]
    profile_picture: Optional[str] = None
    bio: str
    username:str

    @staticmethod
    def resolve_profile_picture(obj):
        return obj.get_profile_picture_url()

class UserProfileUpdateSchema(Schema):
    country: Optional[str]
    streaming_services: Optional[List[str]]
    preferred_genres: Optional[List[str]]
    bio: Optional[str]
   