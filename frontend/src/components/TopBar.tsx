import React,{useState,useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import {useNavigate,useLocation,Link} from "react-router-dom";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import {useAuthHook} from "../components/AuthProvider";
interface TopBarProps {
    onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
    const {user_id}=useAuthHook();
    const navigate=useNavigate();
    const { t, i18n } = useTranslation();
    const handleClickToHome=()=>{//temp to homepage
        navigate("/");
    }
    const location = useLocation();
    //setLanguage accept language from <LanguageSelector/>
    const [language,setLanguage]=useState("en");

    //user language to accept from backend default value EN(language) and light(theme)
    const [giveLanguage,setGiveLanguage]=useState("en");


    //Mobil-End
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md:  <900px

    // Fetch user settings from backend,language preference etc.
    useEffect(() => {
        async function fetchUserSetting() {
            if (!user_id) return;
            try {
                const res = await fetch(`http://127.0.0.1:8000/users/get_or_create_user?user_id=${user_id}`);
                const user = await res.json();
                if (user && user.language) {
                    setGiveLanguage(user.language); // Update state with user preference
                    setLanguage(user.language);
                    i18n.changeLanguage(user.language);  // Apply language change in i18n
                }
            } catch (err) {
                console.error("Failed to get user settings:", err);
            }
        }
        fetchUserSetting();
    }, [user_id, i18n]);

    // Handle language change，which triggered from LanguageSelector
    const handleLanguageChange = async (lang: string) => {
        setLanguage(lang);
        i18n.changeLanguage(lang); // Apply immediately
        console.log(user_id,lang);
        if (!user_id) return;
        console.log(user_id,lang)
        try {
            // Send update request to backend
            await axios.post(
                `http://127.0.0.1:8000/users/update_language`,
                { language: lang },
                { params: { user_id },headers: { "Content-Type": "application/json" } }
            );

            setGiveLanguage(lang);
        } catch (err) {
            console.error("Failed to update language:", err);
        }
    };

    // Return different page titles depending on current route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return t('bar.dashboard');
            case '/dashboard/upload':
                return t('bar.upload');
            case '/dashboard/tutorial':
                return t('bar.tutorial');
            case '/dashboard/photoGallery':
                return t('bar.photoGallery');
            case '/dashboard/uploadHistory':
                return t('bar.uploadHistory');
            case '/dashboard/productIntroduction':
                return t('bar.productIntroduction');
            case '/dashboard/photoReview':
                return t('bar.photoReview');
            case '/dashboard/ranking':
                return t('bar.ranking');
            default:
                return t('bar.loading');
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
                    <Typography variant="h6" component="div"
                                sx={{
                                    ml: {xs:1,sm:2},
                                    cursor: 'pointer',
                                    fontSize: { xs: '1rem', sm: '1.25rem' }}}
                                onClick={handleClickToHome}>
                        CityUp
                    </Typography>
                </Box>
                <Box sx=
                         {{
                             position: 'absolute',
                             left: location.pathname=== '/dashboard/productIntroduction'?'47%' : '50%',
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
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mr: {sx:"0.1%",sm:"3%"},//margin right
                }}>
                    {!isMobile && (<LanguageSelector
                        setLanguage={handleLanguageChange}
                        giveLanguage={giveLanguage}
                    />)}
                    <Button
                        onClick={() => {
                            navigate('/dashboard');
                        }}
                        sx={{
                            ...styles.extiButton,
                            visibility: location.pathname === '/dashboard' ? 'hidden' : 'visible',
                            justifyContent: 'center',
                            textAlign: 'center',
                            width: {sx:"90%",sm:"100%"},
                            minWidth: "120px",
                        }}
                        variant="outlined"
                    >
                        {t('bar.exit')}
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
const styles = {
    extiButton: {
        justifyContent: "space-between",
        borderRadius: 10,
        borderColor: "white",
        // border: 'none',
        margin:"auto 1% auto auto",
        color:"white",
        fontWeight: "bold",
        ml:2,
    }
}
export default TopBar;