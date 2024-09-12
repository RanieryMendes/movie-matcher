from ninja import Schema
from datetime import datetime
from typing import List

# ... (keep your existing schemas) ...

class GroupIn(Schema):
    name: str
    streaming_services: List[str]
    genres_preference: List[str]
class GroupOut(Schema):
    id: int
    name: str
    code: str
    creator_id: int
    created_at: datetime

class MemberSchema(Schema):
    id: int
    username: str
class PartyOut(Schema):
    id: int
    name: str
    code: str
    creator_id: int
    created_at: datetime
    streaming_services: List[str]
    genres_preference: List[str]
    members: List[MemberSchema]


class JoinGroupIn(Schema):
    code: str

class UserMoviePreferenceIn(Schema):
    movie_id: int
    group_id: int
    liked: bool

class UserMoviePreferenceOut(Schema):
    id: int
    user_id: int
    movie_id: int
    group_id: int
    liked: bool
    created_at: datetime