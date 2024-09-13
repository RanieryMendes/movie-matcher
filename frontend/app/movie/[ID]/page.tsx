"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/system';
import { Container, Typography, Box, Card, CardMedia, CardContent, Button, CircularProgress, Chip } from '@mui/material';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('./../../components/sideBar'), { ssr: false });

interface Movie {
  tmdb_id: number;
  title: string;
  vote_average?: number;
  vote_count?: number;
  status?: string;
  release_date?: string;
  revenue?: number;
  runtime?: number;
  adult: boolean;
  backdrop_path?: string;
  budget?: number;
  homepage?: string;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  tagline?: string;
  genres?: string[];
  production_companies?: string[];
  production_countries?: string[];
  spoken_languages?: string;
  keywords?: string;
}

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
}));

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
      <StyledBox>
        <Box sx={{ display: 'flex' }}>
          {typeof window !== 'undefined' && <Sidebar />}
          <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Container>
        </Box>
      </StyledBox>
    );
  }

  const moviePoster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;


  return (
    <StyledBox>
      <Box sx={{ display: 'flex' }}>
        {typeof window !== 'undefined' && <Sidebar />}
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 6 }}>
            {movie.title}
          </Typography>
          <ContentBox>
            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 3 }}>
              <CardMedia
                component="img"
                sx={{ width: { xs: '100%', md: 300 }, height: 'auto' }}
                image={moviePoster}
                alt={movie.title}
              />
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Overview
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {movie.overview}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={`Release Date: ${movie.release_date}`} variant="outlined" />
                    <Chip label={`Rating: ${movie.vote_average}/10`} variant="outlined" color="primary" />
                    <Chip label={`Popularity: ${movie.popularity?.toFixed(1)}`} variant="outlined" color="secondary" />
                  </Box>
                  {movie.genres && movie.genres.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        Genres
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {movie.genres.map((genre, index) => (
                          <Chip key={index} label={genre} variant="outlined" color="info" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/')}
                  sx={{ alignSelf: 'flex-start', mt: 2 }}
                >
                  Back to Home
                </StyledButton>
              </CardContent>
            </Card>
          </ContentBox>
        </Container>
      </Box>
    </StyledBox>
  );
}


