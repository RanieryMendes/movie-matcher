from ninja import Schema
from datetime import datetime


# ... (keep your existing schemas) ...

class GroupIn(Schema):
    name: str

class GroupOut(Schema):
    id: int
    name: str
    code: str
    creator_id: int
    created_at: datetime

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