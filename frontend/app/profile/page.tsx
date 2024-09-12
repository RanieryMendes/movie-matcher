'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Autocomplete,
  Chip,
  Paper,
  CircularProgress
} from '@mui/material';
import { getProfile, updateProfile, uploadProfilePicture, getStreamingPlatforms, getGenres } from '../lib/api';
import Sidebar from '../components/sideBar';
import countries from '../lib/countries';
import { styled } from '@mui/system';
interface Profile {
  username: string;
  country: string;
  streaming_services: string[];
  preferred_genres: string[]
  profile_picture: string | null;
  bio: string;
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

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
    fetchStreamingPlatforms();
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const genres = await getGenres();
      setAvailableGenres(genres);
      console.log("Genres", genres)

    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };
  const fetchStreamingPlatforms = async () => {
    try {
      const platforms = await getStreamingPlatforms();
      setAvailablePlatforms(platforms);
      console.log("Platforms", platforms)
    } catch (error) {
      console.error('Error fetching streaming platforms:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      console.log("Data", data)
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      router.push('/auth/login');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const updatedProfile = await updateProfile(profile);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadProfilePicture(file);
        setProfile((prevProfile) => ({
          ...prevProfile!,
          profile_picture: uploadedUrl,
        }));
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  const handleStreamingServiceChange = (platform: string) => {
    setProfile((prevProfile) => {
      const updatedServices = prevProfile!.streaming_services.includes(platform)
        ? prevProfile!.streaming_services.filter((service) => service !== platform)
        : [...prevProfile!.streaming_services, platform];
      return { ...prevProfile!, streaming_services: updatedServices };
    });
  };

  const handleGenreChange = (genre: string) => {
    setProfile((prevProfile) => {
      const updatedGenres = prevProfile!.preferred_genres.includes(genre)
        ? prevProfile!.preferred_genres.filter((g) => g !== genre)
        : [...prevProfile!.preferred_genres, genre];
      return { ...prevProfile!, preferred_genres: updatedGenres };
    });
  };

  const API_BASE_URL = process.env.API_BASE_URL;
  if (!profile) {
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
            Hi {profile.username}
          </Typography>
          <ContentBox>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Avatar
                      src={profile.profile_picture}
                      sx={{ width: 150, height: 150, margin: 'auto' }}
                    />
                    {isEditing && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="profile-picture-upload"
                          type="file"
                          onChange={handleProfilePictureChange}
                        />
                        <label htmlFor="profile-picture-upload">
                          <StyledButton variant="contained" component="span">
                            Upload New Picture
                          </StyledButton>
                        </label>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={8}>
                    {isEditing ? (
                      <form onSubmit={handleUpdate}>
                        <Autocomplete
                          options={countries}
                          autoHighlight
                          value={profile.country}
                          onChange={(event, newValue) => {
                            setProfile({ ...profile, country: newValue || '' });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Choose a country"
                              fullWidth
                              margin="normal"
                            />
                          )}
                        />

                        <Paper elevation={3} sx={{ p: 2, mt: 2, mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>Streaming Services</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {availablePlatforms.map((platform) => (
                              <Chip
                                key={platform}
                                label={platform}
                                onClick={() => handleStreamingServiceChange(platform)}
                                color={profile.streaming_services.includes(platform) ? "primary" : "default"}
                                variant={profile.streaming_services.includes(platform) ? "filled" : "outlined"}
                              />
                            ))}
                          </Box>
                        </Paper>

                        <Paper elevation={3} sx={{ p: 2, mt: 2, mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>Preferred Genres</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {availableGenres.map((genre) => (
                              <Chip
                                key={genre}
                                label={genre}
                                onClick={() => handleGenreChange(genre)}
                                color={profile.preferred_genres.includes(genre) ? "primary" : "default"}
                                variant={profile.preferred_genres.includes(genre) ? "filled" : "outlined"}
                              />
                            ))}
                          </Box>
                        </Paper>

                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={4}
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          margin="normal"
                        />
                        <StyledButton type="submit" variant="contained" color="primary">
                          Save Changes
                        </StyledButton>
                      </form>
                    ) : (
                      <>
                        <Typography variant="h6">Country: {profile.country}</Typography>
                        <Typography variant="body1">
                          Streaming Services: {Array.isArray(profile.streaming_services) ? profile.streaming_services.join(', ') : 'None'}
                        </Typography>
                        <Typography variant="body1">
                          Preferred Genres: {Array.isArray(profile.preferred_genres) ? profile.preferred_genres.join(', ') : 'None'}
                        </Typography>
                        <Typography variant="body1">Bio: {profile.bio}</Typography>
                        <StyledButton
                          onClick={() => setIsEditing(true)}
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                        >
                          Edit Profile
                        </StyledButton>
                      </>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </ContentBox>
        </Container>
      </Box>
    </StyledBox>
  );
}