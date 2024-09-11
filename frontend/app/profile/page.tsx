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
} from '@mui/material';
import { getProfile, updateProfile, uploadProfilePicture, getStreamingPlatforms, getGenres } from '../lib/api';
import Sidebar from '../components/sideBar';
import { Chip, Paper } from '@mui/material';
import { Autocomplete } from '@mui/material';
import countries from '../lib/countries';
interface Profile {
  username: string;
  country: string;
  streaming_services: string[];
  preferred_genres: string[]
  profile_picture: string | null;
  bio: string;
}

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
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hi {profile.username}
        </Typography>
        <Card>
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
                      <Button variant="contained" component="span">
                        Upload New Picture
                      </Button>
                    </label>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={8}>
                {isEditing ? (
                  <form onSubmit={handleUpdate}>

                    {/* <TextField
                      fullWidth
                      label="Country"
                      value={profile.country}
                      onChange={(e) =>
                        setProfile({ ...profile, country: e.target.value })
                      }
                      margin="normal"
                    /> */}
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

                    {/* <TextField
                      fullWidth
                      label="Streaming Services"
                      value={profile.streaming_services}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          streaming_services: e.target.value,
                        })
                      }
                      margin="normal"
                    /> */}
                        {/* <FormGroup> */}
                            {/* <Typography variant="subtitle1">Streaming Services</Typography>
                            {availablePlatforms.map((platform) => (
                                <FormControlLabel
                                key={platform}
                                control={
                                    <Checkbox
                                    checked={profile.streaming_services.includes(platform)}
                                    onChange={() => handleStreamingServiceChange(platform)}
                                    />
                                }
                                label={platform}
                                />
                            ))}
                        {/* </FormGroup>

                        <FormGroup> 
                            <Typography variant="subtitle1">Preferred Genres</Typography>
                            {availableGenres.map((genre) => (
                            <FormControlLabel
                                key={genre}
                                control={
                                <Checkbox
                                    checked={profile.preferred_genres.includes(genre)}
                                    onChange={() => handleGenreChange(genre)}
                                />
                                }
                                label={genre}
                            />
                            ))}
                        </FormGroup> */}
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
                    <Button type="submit" variant="contained" color="primary">
                      Save Changes
                    </Button>
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
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
    </Box>
  );
}