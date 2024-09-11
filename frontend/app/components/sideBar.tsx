import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Favorite, Search, Settings, Dashboard, Person } from '@mui/icons-material';
import Link from 'next/link';

const drawerWidth = 200;

const Sidebar: React.FC = () => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        {[
          { text: 'Home', icon: <Home />,link: '/' },
          { text: 'Favorites', icon: <Favorite />,link: '/profile' },
          { text: 'Search', icon: <Search /> ,link: '/profile'},
          { text: 'Matching', icon: <Dashboard />,link: '/profile' },
          { text: 'Settings', icon: <Settings />, link: '/profile'},
          { text: 'Profile', icon: <Person />, link: '/profile' },
        ].map((item, index) => (
          <ListItem button key={item.text} component={Link} href={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;