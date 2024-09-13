'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';
import MovieCarousel from './../components/MovieCarousel';
import dynamic from 'next/dynamic';

// ... existing interfaces and dynamic import ...

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



const Sidebar = dynamic(() => import('./../components/sideBar'), { ssr: false });
export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/movies/popular');
        const data = await response.json();
        setPopularMovies(data);
      
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    };

    fetchPopularMovies();
  }, []);
 
  return (
    <StyledBox>
      <Box sx={{ display: 'flex' }}>
        {typeof window !== 'undefined' && <Sidebar />}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 6 }}>
            Welcome to Movie Matcher
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <ContentBox>
                <Typography variant="h4" component="h2" gutterBottom>
                  Be Careful. You may view it only once 🍿
                </Typography>
                <MovieCarousel movies={popularMovies} />
              </ContentBox>
            </Grid>
            {/* Add more content sections here if needed */}
          </Grid>
        </Container>
      </Box>
    </StyledBox>
  );
}