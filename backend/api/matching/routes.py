from ninja import Router
from .schemas import GroupIn, GroupOut, JoinGroupIn, UserMoviePreferenceIn, UserMoviePreferenceOut, PartyOut, StartSessionIn, SessionOut, MovieVoteIn, MovieVoteOut, MatchResultOut
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from ..auth.security import AuthBearer
from typing import List, Optional       
from ..models import Movie, GroupMember, UserMoviePreference, Group, MatchingSession, UserMovieVote
from ..movies.schemas import MovieSchema
from django.core.cache import cache
import json
matching_group_router = Router()

@matching_group_router.post("/groups", response=GroupOut, auth=AuthBearer())
def create_group(request, group_in: GroupIn):  
    if not request.auth:
        return {"detail": "Authentication failed"}, 401
    group = Group.objects.create(name=group_in.name, creator=request.auth, streaming_services=group_in.streaming_services, genres_preference=group_in.genres_preference)
    GroupMember.objects.create(user=request.auth, group=group)
    return group

@matching_group_router.post("/party/join", response=GroupOut, auth=AuthBearer())
def join_group(request, join_in: JoinGroupIn):

    group = get_object_or_404(Group, code=join_in.code)
    GroupMember.objects.get_or_create(user=request.auth, group=group)
    return group

@matching_group_router.delete("/party/{group_id}", auth=AuthBearer())
def delete_group(request, group_id: str):
    group = get_object_or_404(Group, code=group_id)
    if group.creator != request.auth:
        return {"detail": "You are not authorized to delete this group"}, 403
    group.delete()
    return {"detail": "Group deleted successfully"}

@matching_group_router.get("/nextmovie/{session_id}", response=MovieSchema, auth=AuthBearer())
def get_next_movie(request, session_id: int):
    session_key = f"matching_session:{session_id}"
    session_data = cache.get(session_key)
    if not session_data:
        return {"detail": "Session not found or expired"}, 404
    
    session_data = json.loads(session_data)
    current_index = session_data["current_index"]
    
    if current_index >= len(session_data["movies"]):
        return {"detail": "No more movies in this session"}, 404
    
    movie_id = session_data["movies"][current_index]
    movie = get_object_or_404(Movie, tmdb_id=movie_id)
    
    # Prepare the response data
    response_data = {
        "tmdb_id": movie.tmdb_id,
        "title": movie.title,
        "vote_average": movie.vote_average,
        "vote_count": movie.vote_count,
        "status": movie.status,
        "release_date": movie.release_date,
        "revenue": movie.revenue,
        "runtime": movie.runtime,
        "adult": movie.adult,
        "backdrop_path": movie.backdrop_path,
        "budget": movie.budget,
        "homepage": movie.homepage,
        "imdb_id": movie.imdb_id,
        "original_language": movie.original_language,
        "original_title": movie.original_title,
        "overview": movie.overview,
        "popularity": movie.popularity,
        "poster_path": movie.poster_path,
        "tagline": movie.tagline,
        "genres": [genre.name for genre in movie.genres.all()],
        "production_companies": movie.production_companies.split(', ') if movie.production_companies else [],
        "production_countries": movie.production_countries.split(', ') if movie.production_countries else [],
        "spoken_languages": movie.spoken_languages,
        "keywords": movie.keywords,
    }
    return response_data


@matching_group_router.get("/groups", response=List[GroupOut], auth=AuthBearer())
def list_groups(request):
    if not request.auth:
        return [], 401  # Return an empty list and 401 Unauthorized status
    print(request.auth)
    user_groups = GroupMember.objects.filter(user=request.auth)
    print(user_groups)
    response =[member.group for member in user_groups]
    print("response ",response)
    return response
    # print("request.user.joined_groups.all()", request.user.joined_groups.all())
    # return request.user.joined_groups.all()

@matching_group_router.get("/groups/{group_id}", response=PartyOut, auth=AuthBearer())
def get_group_details(request, group_id: str):
    group = get_object_or_404(Group, code=group_id)
    members = [{"id": member.id, "username": member.username} for member in group.members.all()]

    return {
        "id": group.id,
        "name": group.name,
        "code": group.code,
        "creator_id": group.creator.id,
        "created_at": group.created_at,
        "streaming_services": group.streaming_services,
        "genres_preference": group.genres_preference,
        "members": members,
        "is_creator": group.creator == request.auth
    }

@matching_group_router.post("/preferences", response=UserMoviePreferenceOut, auth=AuthBearer())
def create_preference(request, preference_in: UserMoviePreferenceIn):
    movie = get_object_or_404(Movie, id=preference_in.movie_id)
    group = get_object_or_404(Group, id=preference_in.group_id)
    preference, created = UserMoviePreference.objects.update_or_create(
        user=request.user,
        movie=movie,
        group=group,
        defaults={'liked': preference_in.liked}
    )
    return preference

@matching_group_router.get("/groups/{group_id}/matches", response=List[int], auth=AuthBearer())
def get_group_matches(request, group_id: int):
    group = get_object_or_404(Group, id=group_id)
    members = group.members.all()
    liked_movies = UserMoviePreference.objects.filter(
        group=group,
        liked=True
    ).values_list('movie_id', flat=True)
    
    # Count likes for each movie
    movie_likes = {}
    for movie_id in liked_movies:
        if movie_id not in movie_likes:
            movie_likes[movie_id] = 1
        else:
            movie_likes[movie_id] += 1
    
    # Find movies liked by all members
    matches = [movie_id for movie_id, likes in movie_likes.items() if likes == members.count()]
    return matches

@matching_group_router.post("/start-session", response=SessionOut, auth=AuthBearer())
def start_matching_session(request, data: StartSessionIn):
    group = get_object_or_404(Group, code=data.code)

    # Check for an existing active session
    existing_session = MatchingSession.objects.filter(group=group, status='active').first()
    print(MatchingSession.objects.filter(group=group))
    print("existing_session", existing_session)
    if existing_session:
        return SessionOut.from_orm(existing_session)
    
    movies = get_random_movies(data.genre, limit=20)
    session = MatchingSession.objects.create(
        group=group,
        movies=[movie.tmdb_id for movie in movies],
        status='active'
    )
    
    # Store session data in Redis
    session_key = f"matching_session:{session.id}"
    session_data = {
        "group_id": group.id,
        "movies": [movie.tmdb_id for movie in movies],
        "current_index": 0,
        "votes": {},
        "members": list(group.members.values_list('id', flat=True))
    }
    cache.set(session_key, json.dumps(session_data), timeout=3600)  # 1 hour expiration
    
    return SessionOut.from_orm(session)

@matching_group_router.get("/session-status/{group_id}", response=SessionOut, auth=AuthBearer())
def get_session_status(request, group_id: str):
    group = get_object_or_404(Group, code=group_id)
    session = MatchingSession.objects.filter(group=group, status='active').first()
    if session:
        return SessionOut.from_orm(session)
    return {"detail": "No active session found"}, 404


@matching_group_router.post("/vote", response=MovieVoteOut, auth=AuthBearer())
def vote_movie(request, vote: MovieVoteIn):
    session_key = f"matching_session:{vote.session_id}"
    session_data = cache.get(session_key)
    
    if not session_data:
        return {"detail": "Session not found or expired"}, 404
    
    session_data = json.loads(session_data)
    
    if vote.movie_id not in session_data["movies"]:
        return {"detail": "Invalid movie for this session"}, 400
    
    user_id = str(request.auth.id)
    if user_id not in session_data["votes"]:
        session_data["votes"][user_id] = {}
    
    session_data["votes"][user_id][vote.movie_id] = vote.liked
    
    # Update the current_index for all users
    session_data["current_index"] = min(session_data["current_index"] + 1, len(session_data["movies"]))
    
    cache.set(session_key, json.dumps(session_data), timeout=3600)
    
    # Create a database record for persistence
    session = get_object_or_404(MatchingSession, id=vote.session_id)
    movie = get_object_or_404(Movie, tmdb_id=vote.movie_id)
    user_vote = UserMovieVote.objects.create(
        user=request.auth,
        session=session,
        movie=movie,
        liked=vote.liked
    )   
    
    if check_all_members_voted(session, session_data):
        broadcast_result(session)
    return MovieVoteOut.from_orm(user_vote)

def check_all_members_voted(session, session_data):
    voted_members = len(session_data["votes"])
    return voted_members == len(session_data["members"])

def broadcast_result(session):
    result = get_matching_result(session.id)
    # Here you would implement the logic to broadcast the result to all members
    # This could involve WebSockets, push notifications, or updating a shared state
    # For now, we'll just update the session status
    session.status = 'completed'
    session.save()
@matching_group_router.get("/result/{session_id}", response=MatchResultOut, auth=AuthBearer())
def get_matching_result(request, session_id: int):
    session_key = f"matching_session:{session_id}"
    session_data = cache.get(session_key)
    
    if not session_data:
        return {"detail": "Session not found or expired"}, 404
    
    session_data = json.loads(session_data)
    
    if session_data["current_index"] < len(session_data["movies"]):
        return {"detail": "Matching session is not complete"}, 400
    
    vote_counts = {}
    for user_votes in session_data["votes"].values():
        for movie_id, liked in user_votes.items():
            if liked:
                vote_counts[movie_id] = vote_counts.get(movie_id, 0) + 1
    
    if not vote_counts:
        return {"detail": "No movies were liked in this session"}, 404
    
    matched_movie_id = max(vote_counts, key=vote_counts.get)
    movie = get_object_or_404(Movie, tmdb_id=matched_movie_id)
    
    return MatchResultOut(
        movie_id=movie.tmdb_id,
        title=movie.title,
        overview=movie.overview,
        poster_path=movie.poster_path,
        vote_count=vote_counts[matched_movie_id],
        vote_average=vote_counts[matched_movie_id] / len(session_data["votes"])
    )

def get_random_movies(genre: Optional[str] = None, limit: int = 20) -> List[Movie]:
    queryset = Movie.objects.all()
    if genre:
        queryset = queryset.filter(genres__name=genre)
    return queryset.order_by('?')[:limit]