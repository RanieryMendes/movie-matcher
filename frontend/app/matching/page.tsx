'use client';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MatchingWelcome from "../components/matchingWelcome";
import Sidebar from "../components/sideBar";
import { Box } from "@mui/material";

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <MatchingWelcome />
        </Box>
      </Box>
    </ThemeProvider>
  );
}