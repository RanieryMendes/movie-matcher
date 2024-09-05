from django.db import models

# Create your models here.
class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    release_date = models.DateField(null=True, blank=True)
    tmdb_id = models.IntegerField(unique=True)
    imdb_rating = models.FloatField(null=True, blank=True)
    rotten_tomatoes_rating = models.FloatField(null=True, blank=True)

class StreamingPlatform(models.Model):
    name = models.CharField(max_length=255)

class StreamingAvailability(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='streaming_availability')
    platform = models.ForeignKey(StreamingPlatform, on_delete=models.CASCADE)
    available_since = models.DateField()