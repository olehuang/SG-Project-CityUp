import React, { useState } from 'react';
import Sidebar from "../components/Sidebar";
import TopBar from '../components/TopBar';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box sx={{ padding: 2, flex: 1, overflowY: 'hidden' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;