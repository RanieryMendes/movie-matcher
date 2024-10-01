'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/system';
import { Box, Button, Typography, Card, CardMedia, CardContent, Container, CircularProgress, Chip } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { startMatchingSession, getNextMovie, voteMovie, getMatchingResult } from './../../../lib/api';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('./../../../components/sideBar'), { ssr: false });

interface Movie {
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  popularity: number;
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
  },
}));

export default function MatchingPage() {
  const { ID } = useParams();
  const [sessionId, setSessionId] = useState(null);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [matchedMovie, setMatchedMovie] = useState<Movie | null>(null);
  const [waitingForResults, setWaitingForResults] = useState(false);
  
   
  useEffect(() => {
    if (ID && !sessionId) {
      checkOrStartSession();
    }
  }, [ID, sessionId]);
  useEffect(() => {
    if (sessionId) {
      fetchNextMovie();
      return () => clearTimeout(fetchNextMovie);
    }
  }, [sessionId]);
  
  useEffect(() => {
    console.log("In useEffect for sessionId ", sessionId)
    if (sessionId) {
      const intervalId = setInterval(fetchNextMovie, 5000); // Check every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [sessionId]);

  const initialCheckDone = useRef(false);

  useEffect(() => {
    if (ID && !sessionId && !initialCheckDone.current) {
      initialCheckDone.current = true;
      checkOrStartSession();
    }
  }, [ID, sessionId]);
  const checkOrStartSession = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/matching/session-status/${ID}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
  
      if (response.ok) {
        const sessionData = await response.json();
        setSessionId(sessionData.id);
        fetchNextMovie();
      } else if (response.status === 404) {
        // No active session, start a new one
        const session = await startMatchingSession(ID as string);
        setSessionId(session.id);
        fetchNextMovie();
      } else {
        throw new Error('Unexpected error occurred');
      }
    } catch (error) {
      console.error('Error checking or starting session:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const fetchNextMovie = async () => {
    if (!sessionId) return;
  
    try {
      const movie = await getNextMovie(sessionId);
      if (movie.detail === "No more movies in this session") {
        setWaitingForResults(true);
        checkSessionStatus();
      } else {
        setCurrentMovie(movie);
        setTimeout(fetchNextMovie, 5000);
      }
    } catch (error) {
      console.error('Error fetching next movie:', error);
      setWaitingForResults(true);
      checkSessionStatus();
    }
  };
  
  

  const checkSessionStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/matching/session-status/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const sessionData = await response.json();
        if (sessionData.status === 'completed') {
          const result = await getMatchingResult(sessionId);
          setMatchedMovie(result);
          setWaitingForResults(false);
        }
      }
    } catch (error) {
      console.error('Error checking session status:', error);
    }
  };

  const handleVote = async (liked: boolean) => {
    if (!sessionId || !currentMovie) return;

    await voteMovie({
      session_id: sessionId,
      movie_id: currentMovie.tmdb_id,
      liked: liked
    });
    fetchNextMovie();
  };


  if (matchedMovie) {
    return (
      <StyledBox>
        <Box sx={{ display: 'flex' }}>
          {typeof window !== 'undefined' && <Sidebar />}
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h2" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 6 }}>
              It's a Match!
            </Typography>
            <ContentBox>
              <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  sx={{ width: { xs: '100%', md: 300 }, height: 'auto' }}
                  image={`https://image.tmdb.org/t/p/w500${matchedMovie.poster_path}`}
                  alt={matchedMovie.title}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {matchedMovie.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {matchedMovie.overview}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </ContentBox>
          </Container>
        </Box>
      </StyledBox>
    );
  }

  if (waitingForResults) {
    return (
      <StyledBox>
        <Box sx={{ display: 'flex' }}>
          {typeof window !== 'undefined' && <Sidebar />}
          <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="h5" align="center">
              Waiting for other members to finish voting...
            </Typography>
          </Container>
        </Box>
      </StyledBox>
    );
  }

  if (!currentMovie) {
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

  return (
    <StyledBox>
      <Box sx={{ display: 'flex' }}>
        {typeof window !== 'undefined' && <Sidebar />}
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 6 }}>
            {currentMovie.title}
          </Typography>
          <ContentBox>
            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 3 }}>
              <CardMedia
                component="img"
                sx={{ width: { xs: '100%', md: 300 }, height: 'auto' }}
                image={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                alt={currentMovie.title}
              />
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Overview
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentMovie.overview}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={`Release Date: ${currentMovie.release_date}`} variant="outlined" />
                    <Chip label={`Rating: ${currentMovie.vote_average}/10`} variant="outlined" color="primary" />
                    <Chip label={`Popularity: ${currentMovie.popularity?.toFixed(1)}`} variant="outlined" color="secondary" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    startIcon={<ThumbDown />}
                    onClick={() => handleVote(false)}
                    sx={{ mr: 2 }}
                  >
                    Dislike
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={<ThumbUp />}
                    onClick={() => handleVote(true)}
                    sx={{ ml: 2 }}
                  >
                    Like
                  </StyledButton>
                </Box>
              </CardContent>
            </Card>
          </ContentBox>
        </Container>
      </Box>
    </StyledBox>
  );
}