import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import TopBar from '../Components/TopBar';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box>
            <TopBar onMenuClick={handleToggleSidebar} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Box sx={{ padding: 2 }}>
                <Outlet />
            </Box>
        </Box>
    );
}

export default DashboardLayout;