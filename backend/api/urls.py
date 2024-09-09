
from django.urls import path
from . import views
from django.urls import path
from .api import api

urlpatterns = [
    # path('test/', views.test_api, name='test_api'),
    path("", api.urls),
]