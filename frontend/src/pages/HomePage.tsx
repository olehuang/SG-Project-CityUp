
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
            paddingTop: "25vh",
            zIndex: 2,
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
            fontSize: { xs: "8rem", md: "10rem", lg: "12rem" },
            marginBottom: "1.5rem",
        },
        button: {
            bgcolor: clicked ? "#ffb703" : "#fb8500",
            color: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1.25rem",
            borderRadius: "50px",
            boxShadow: clicked
                ? "0 0 15px 5px rgba(251, 133, 0, 0.7)"
                : "0 4px 8px rgba(251, 133, 0, 0.5)",
            transition: "all 0.3s ease",
            "&:hover": {
                bgcolor: "#ffb703",
                boxShadow: "0 0 20px 8px rgba(255, 183, 3, 0.9)",
            },
            position: "relative",
            overflow: "visible",
        },
        bubble: {
            position: "absolute",
            top: "-10px",
            right: "-10px",
            width: "20px",
            height: "20px",
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
    `}</style>
        </Box>
    );
};



export default HomePage;