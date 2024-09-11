from ninja import Router, File
from ninja.security import HttpBearer
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from ..models import UserProfile
from .schemas import UserProfileSchema, UserProfileUpdateSchema
from ..auth.security import AuthBearer

from ninja.files import UploadedFile
import json

profile_router = Router()

@profile_router.get("/", response=UserProfileSchema, auth=AuthBearer())
def get_profile(request):
    profile, created = UserProfile.objects.get_or_create(user=request.auth)
    print(profile.get_profile_picture_url())
    return profile

@profile_router.put("/", response=UserProfileSchema, auth=AuthBearer())
def update_profile(request, data: UserProfileUpdateSchema):
    profile, created = UserProfile.objects.get_or_create(user=request.auth)
    for attr, value in data.dict(exclude_unset=True).items():
        setattr(profile, attr, value)
    profile.save()
    return profile

import os
from django.core.files.base import ContentFile

@profile_router.put("/upload_picture", auth=AuthBearer())
def upload_profile_picture(request):
    if 'file' not in request.FILES:
        # Try to get file from raw body
        file_content = ContentFile(request.body)
        file_name = request.headers.get('X-File-Name', 'uploaded_file.ico')
        
        profile, created = UserProfile.objects.get_or_create(user=request.auth)
        profile.profile_picture.save(file_name, file_content, save=True)
        return {"message": "Profile picture uploaded successfully"}
    
    file = request.FILES['file']
    profile, created = UserProfile.objects.get_or_create(user=request.auth)
    profile.profile_picture = file
    profile.save()
    return {"message": "Profile picture uploaded successfully"}
