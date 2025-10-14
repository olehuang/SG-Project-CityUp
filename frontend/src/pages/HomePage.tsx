
import { Routes,Route,BrowserRouter,Link} from 'react-router-dom';
import React, {useState, useEffect, useContext} from "react";
import {Button, Box, Typography} from "@mui/material";

import { AuthProvider,useAuthHook} from "../components/AuthProvider";
import KeycloakClient from "../components/keycloak";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from 'react-i18next';
const HomePage = () => {
    const {auth,setAuth,setAuthLoading}=useAuthHook();
    const [clicked, setClicked] = useState(false);
    const { t } = useTranslation();
    const hanldeLogin= async ()=>{
        setClicked(true);
        //click Get Start translat to keycloak webseite
        await KeycloakClient.creatKeycloak.login({
                redirectUri: `${window.location.origin}/dashboard`,
            }
        )

        setAuthLoading(false);
    }

    const styles = {
        container: {
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
        },
        topContent: {
            paddingTop: { xs: "30vh", sm: "22vh", md: "25vh" }, // Responsive top spacing
            zIndex: 2,
            px: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding to prevent content from sticking to the edges
        },
        background: {
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100vh",
            backgroundImage: 'url("/assets/City.jpg")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
            filter: "brightness(0.8) saturate(1) opacity(0.3)",
        },

        title: {
            fontWeight: "bold",
            // color: "#0d3b66",
            color: "#3E2723",
            fontSize: {
                xs: "4rem",    // Mobile: 64px
                sm: "6rem",    //Tablet: 96px
                md: "8rem",    // Medium screen: 128px
                lg: "10rem",   // Tablet: 96px
                xl: "12rem"    // Extra large screen: 192px
            },
            marginBottom: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // Responsive bottom margin
            lineHeight: { xs: 0.9, sm: 1, md: 1.1 }, // Responsive line height to prevent text from being too high
            // Prevent long text from overflowing
            wordBreak: "break-word",
            maxWidth: "100%",
        },
        button: {
            bgcolor: clicked ? "#ffb703" : "#fb8500",
            color: "#fff",
            px: { xs: 3, sm: 3.5, md: 4 }, // Responsive horizontal padding
            py: { xs: 1.2, sm: 1.35, md: 1.5 }, // Responsive vertical padding
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" }, // Responsive font size
            borderRadius: "50px",
            boxShadow: clicked
                ? "0 0 15px 5px rgba(251, 133, 0, 0.7)"
                : "0 4px 8px rgba(251, 133, 0, 0.5)",
            transition: "all 0.3s ease",
            "&:hover": {
                bgcolor: "#ffb703",
                boxShadow: "0 0 20px 8px rgba(255, 183, 3, 0.9)",
            },
            // Mobile click effect
            "&:active": {
                transform: "scale(0.95)",
                boxShadow: clicked
                    ? "0 0 12px 4px rgba(251, 133, 0, 0.6)"
                    : "0 2px 6px rgba(251, 133, 0, 0.4)",
            },
            position: "relative",
            overflow: "visible",
            // Make sure buttons are visible and easy to tap on small screens
            minWidth: { xs: "140px", sm: "160px", md: "180px" },
            minHeight: { xs: "44px", sm: "48px", md: "52px" }, // Follow the minimum click area standard on mobile devices
        },
        bubble: {
            position: "absolute",
            top: { xs: "-8px", sm: "-9px", md: "-10px" }, // Responsive positioning
            right: { xs: "-8px", sm: "-9px", md: "-10px" }, // Responsive positioning
            width: { xs: "16px", sm: "18px", md: "20px" }, // Responsive sizing
            height: { xs: "16px", sm: "18px", md: "20px" }, // Responsive sizing
            bgcolor: "#ffb703",
            borderRadius: "50%",
            animation: "bubble 1s ease-out",
            boxShadow: "0 0 8px 3px #ffb703",
        },
    };

    return (
        <Box sx={styles.container}>
            <Box sx={styles.topContent}>
                <Typography variant="h1" component="h1" sx={styles.title}>
                    CityUp
                </Typography>

                <Button onClick={hanldeLogin} variant="contained" sx={styles.button}>
                    {t('getStart')}
                    {clicked && <Box component="span" sx={styles.bubble} />}
                </Button>
            </Box>

            <Box sx={styles.background} />

            <style>{`
      @keyframes bubble {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
      /* Mobile optimization: Prevent page zooming */
                @media (max-width: 600px) {
                    body {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                }
                
                /* Ensure background images display correctly on mobile devices */
                @media (max-width: 600px) {
                    .background-image {
                        background-attachment: scroll !important;
                    }
                }
    `}</style>
        </Box>
    );
};



export default HomePage;