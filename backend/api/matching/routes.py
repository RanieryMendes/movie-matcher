from ninja import Router
from .schemas import GroupIn, GroupOut, JoinGroupIn, UserMoviePreferenceIn, UserMoviePreferenceOut
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from ..auth.security import AuthBearer
from typing import List
from ..models import Movie, GroupMember, UserMoviePreference, Group

matching_group_router = Router()

@matching_group_router.post("/groups", response=GroupOut, auth=AuthBearer())
def create_group(request, group_in: GroupIn):  
    if not request.auth:
        return {"detail": "Authentication failed"}, 401
    group = Group.objects.create(name=group_in.name, creator=request.auth, streaming_services=group_in.streaming_services, genres_preference=group_in.genres_preference)
    GroupMember.objects.create(user=request.auth, group=group)
    return group

@matching_group_router.post("/groups/join", response=GroupOut, auth=AuthBearer())
def join_group(request, join_in: JoinGroupIn):
    group = get_object_or_404(Group, code=join_in.code)
    GroupMember.objects.get_or_create(user=request.user, group=group)
    return group

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