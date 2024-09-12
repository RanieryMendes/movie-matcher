'use client'
import { getPartyDetails } from '../../lib/api';
import { Box, Typography, Chip, List, ListItem, ListItemText, Paper, Container, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/sideBar';

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
}));

const ContentBox = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

interface PartyDetails {
    name: string;
    streaming_services: string[];
    genres_preference: string[];
    members: { id: number; username: string }[];
}

export default function PartyPage() {
    const [partyDetails, setPartyDetails] = useState<PartyDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const partyID = params.ID as string;

    useEffect(() => {
        const fetchPartyDetails = async () => {
            try {
                const details = await getPartyDetails(partyID);
                setPartyDetails(details);
            } catch (error) {
                console.error('Error fetching party details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPartyDetails();
    }, [partyID]);

    return (
        <StyledBox>
            <Box sx={{ display: 'flex' }}>
                {typeof window !== 'undefined' && <Sidebar />}
                <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h2" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 6 }}>
                        Party Details
                    </Typography>
                    <ContentBox>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <CircularProgress />
                            </Box>
                        ) : partyDetails ? (
                            <>
                                <Typography variant="h4" gutterBottom>
                                    {partyDetails.name}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Streaming Services:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                    {partyDetails.streaming_services.map((service: string) => (
                                        <Chip key={service} label={service} />
                                    ))}
                                </Box>
                                {partyDetails.genres_preference.length > 0 && (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            Preferred Genres:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {partyDetails.genres_preference.map((genre: string) => (
                                                <Chip key={genre} label={genre} />
                                            ))}
                                        </Box>
                                    </>
                                )}
                                <Typography variant="h6" gutterBottom>
                                    Members:
                                </Typography>
                                <List>
                                    {partyDetails.members.map((member: { id: number; username: string }) => (
                                        <ListItem key={member.id}>
                                            <ListItemText primary={member.username} />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        ) : (
                            <Typography>No party details found.</Typography>
                        )}
                    </ContentBox>
                </Container>
            </Box>
        </StyledBox>
    );
}