import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';

interface TopBarProps {
    onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={onMenuClick}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                    CityUp
                </Typography>
            </Toolbar>
        </AppBar>
    );
}
export default TopBar;