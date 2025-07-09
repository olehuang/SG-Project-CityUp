import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import TopBar from '../components/TopBar';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery'; // new
import { useTheme } from '@mui/material/styles'; // new

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const theme = useTheme(); //new
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); //new
    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFF8E1',
            }}
        >
            <TopBar onMenuClick={handleToggleSidebar} />

            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} variant= "temporary"  />
                <Box sx={{ flex: 1, overflowY: 'auto', padding: { xs: 1.5, sm: 2 } }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;