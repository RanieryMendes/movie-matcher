'use client';
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MatchingWelcome from "../components/matchingWelcome";
import BeginNewParty from "../components/beginParty";
import Sidebar from "../components/sideBar";
import { Box } from "@mui/material";
import MyParties from "../components/myParties";
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1',
    },
    secondary: {
      main: '#3B82F6',
    },
  },
});

export default function Matching() {
  const [currentView, setCurrentView] = useState('welcome');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {currentView === 'welcome' && <MatchingWelcome onBeginNewParty={() => setCurrentView('newParty')} onMyParties={() => setCurrentView('myParties')}/>}
          {currentView === 'newParty' && <BeginNewParty  onBackToWelcome={() => setCurrentView('welcome')} onMyParties={() => setCurrentView('myParties')}/>}
          {currentView === 'myParties' && <MyParties />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}