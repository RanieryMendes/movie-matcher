from ninja import Router
from typing import List
from django.shortcuts import get_object_or_404
from .schemas import StreamingPlatformSchema
from ..models import StreamingPlatform
from ..auth.security import AuthBearer
from django.http import JsonResponse
router_streaming_platform = Router()

@router_streaming_platform.get("/", response=List[StreamingPlatformSchema], auth=AuthBearer())
def get_streaming_platforms(request):
    platforms = StreamingPlatform.objects.all().values_list('name', flat=True)
    return JsonResponse({'platforms': list(platforms)})