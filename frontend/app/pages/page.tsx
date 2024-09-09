'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import MovieCarousel from './../components/MovieCarousel';
import Sidebar from './../components/Sidebar';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/movies/popular');
        const data = await response.json();
        setPopularMovies(data);
        console.log("Data",data);
      } catch (error) {
        console.error('Error fetching popular movies:', error);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div>
   
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Movie Matcher
        </Typography>
        <Typography variant="h6" gutterBottom>
          Top 10 Popular Movies
        </Typography>
        <MovieCarousel movies={popularMovies} />
      </Container>
    </Box>
    </div>
  );
}