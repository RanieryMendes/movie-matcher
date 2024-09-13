'use client'
import { getPartyDetails, deleteParty } from '../../lib/api';
import { Box, Typography, Chip, List, ListItem, ListItemText, Paper, Container, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/sideBar';
import Link from 'next/link';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(2, 4),
    fontSize: '1.1rem',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
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
    is_creator: boolean;
}

export default function PartyPage() {
    const [partyDetails, setPartyDetails] = useState<PartyDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const params = useParams();
    const partyID = params.ID as string;
    const router = useRouter();

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

    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteParty(partyID);
            router.push('/matching');
        } catch (error) {
            console.error('Error deleting party:', error);
            // You might want to show an error message to the user here
        }
        setOpenDialog(false);
    };

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
                                <StyledButton
                                variant="contained"
                                color="primary"
                                onClick={() => router.push(`/matching/on/${partyID}`)}
                                >
                                 <PlayArrowIcon />
                                </StyledButton>
                                {partyDetails.is_creator && (
                                    <StyledButton
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        onClick={handleDeleteClick}
                                        sx={{ mt: 2 }}
                                    >
                                        Delete Party
                                    </StyledButton>
                                )}
                            </>
                        ) : (
                            <Typography>No party details found.</Typography>
                        )}
                    </ContentBox>
                    <Link href="/matching">
                    <StyledButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<ArrowBackIcon />}
                    >
                    Return
                    </StyledButton>
                    </Link>
                </Container>
            </Box>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Party?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this party? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledBox>
    );
}