import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import {useNavigate,useLocation,Link} from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface TopBarProps {
    onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
            case '/dashboard/ranking':
                return 'Rankings';
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
            <Toolbar  sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={onMenuClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ ml: 2, cursor: 'pointer', fontSize: { xs: '1rem', sm: '1.25rem' } }} onClick={handleClickToHome}>
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
                    <Typography variant="h6" component="div" sx={{fontSize: { xs: '1rem', sm: '1.25rem' }}}>
                        {getPageTitle()}
                    </Typography>
                </Box>
                <Button
                    onClick={()=>{navigate("/dashboard")}}
                    sx={{...styles.extiButton
                    }}
                    variant="outlined"
                >
                    Exit</Button>
            </Toolbar>
        </AppBar>
    );
}
const styles = {
    extiButton: {
        justifyContent: "space-between",
        borderRadius: 10,
        borderColor: "white",
        margin:"auto 5% auto auto",
        color:"white",
        fontWeight: "bold",

    }
}
export default TopBar;