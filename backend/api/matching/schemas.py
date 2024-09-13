from ninja import Schema
from datetime import datetime
from typing import List, Optional

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
    is_creator: bool


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


class StartSessionIn(Schema):
    code: str
    genre: Optional[str] = None

class SessionOut(Schema):
    id: int
    group_id: int
    current_index: int
    is_active: bool
    created_at: datetime

class MovieVoteIn(Schema):
    session_id: int
    movie_id: int
    liked: bool

class MovieVoteOut(Schema):
    id: int
    user_id: int
    session_id: int
    movie_id: int
    liked: bool

class MatchResultOut(Schema):
    movie_id: int
    title: str
    overview: str
    poster_path: str
    vote_count: int
    vote_average: float