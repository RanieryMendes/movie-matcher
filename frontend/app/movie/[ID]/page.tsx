"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Typography, Box, Card, CardMedia, CardContent, Button, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('./../../components/sideBar'), { ssr: false });

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string; 
  vote_average: number;
  poster_path: string;
}

export default function MoviePage() {
  const router = useRouter();
  const params = useParams();
  const tmdb_id = params.ID;
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (tmdb_id) {
      fetchMovieDetails(tmdb_id as string);
    }
  }, [tmdb_id]);

  const fetchMovieDetails = async (movieId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${movieId}`);
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  if (!movie) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Sidebar /> 
        <CircularProgress />
      </Box>
    );
  }

  const moviePoster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Box sx={{ display: 'flex' }}>
      {typeof window !== 'undefined' && <Sidebar />}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 4 }}>
          <CardMedia
            component="img"
            sx={{ width: { xs: '100%', md: 300 }, height: 'auto' }}
            image={moviePoster}
            alt={movie.title}
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {movie.title}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Release Date:</strong> {movie.release_date}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Rating:</strong> {movie.vote_average}/10
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Overview:</strong> {movie.overview}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/')}
              sx={{ mt: 2 }}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}


