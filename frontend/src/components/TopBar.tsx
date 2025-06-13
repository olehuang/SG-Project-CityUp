import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate,useLocation,Link} from "react-router-dom";

interface TopBarProps {
    onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {

    const navigate=useNavigate();
    const handleClickToHome=()=>{//temp to homepage
        navigate("/");
    }
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/dashboard/upload':
                return 'Upload';
            case '/dashboard/tutorial':
                return 'Tutorial';
            case '/dashboard/buildingPhoto':
                return 'Building Photo Gallery';
            case '/dashboard/uploadHistory':
                return 'Upload History';
            case '/dashboard/productIntroduction':
                return 'Product Introduction';
            case '/dashboard/photoReview':
                return 'Photo Review';
            default:
                return 'Loading...';
        }
    };
    return (
        <AppBar position="static" sx={{
            // backgroundColor: '#1976d2',
            backgroundColor: '#5D4037',
            marginBottom:0,

        }}>
            <Toolbar  sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={onMenuClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ml: 2}} onClick={handleClickToHome}>
                        CityUp
                    </Typography>
                </Box>
                <Box sx=
                         {{
                             position: 'absolute',
                             left: '50%',
                             transform: 'translateX(-50%)',
                             color: "#fff",
                             textDecoration: 'none',
                             "&hover": {
                                 textDecoration:"underline"
                             }
                         }}
                     component={Link}
                     to="/dashboard">
                    <Typography variant="h6" component="div" sx={{justifyContent: "space-between",}}>
                        {getPageTitle()}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
export default TopBar;