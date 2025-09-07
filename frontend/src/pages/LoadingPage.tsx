import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

/**
 * this page is hidden a bug, if user status is between auth and unauth
 * is base of Homepage
 *
 * */
const LoadingPage=()=>{
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);

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
            paddingTop: { xs: "30vh", sm: "22vh", md: "25vh" },
            zIndex: 2,
            px: { xs: 2, sm: 3, md: 4 }, // 添加水平内边距
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
                xs: "4rem",    // Mobil
                sm: "6rem",    // Table
                md: "8rem",    // Medium screen
                lg: "10rem",   // large
                xl: "12rem"    // Extra-large screen
            },
            marginBottom: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            lineHeight: { xs: 0.9, sm: 1, md: 1.1 },
            wordBreak: "break-word",
            maxWidth: "100%",
        },
        button: {
            bgcolor: clicked ? "#ffb703" : "#fb8500",
            color: "#fff",
            px: { xs: 3, sm: 3.5, md: 4 },
            py: { xs: 1.2, sm: 1.35, md: 1.5 },
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
            borderRadius: "50px",
            boxShadow: clicked
                ? "0 0 15px 5px rgba(251, 133, 0, 0.7)"
                : "0 4px 8px rgba(251, 133, 0, 0.5)",
            transition: "all 0.3s ease",
            "&:hover": {
                bgcolor: "#ffb703",
                boxShadow: "0 0 20px 8px rgba(255, 183, 3, 0.9)",
            },
            "&:active": {
                transform: "scale(0.95)",
                boxShadow: clicked
                    ? "0 0 12px 4px rgba(251, 133, 0, 0.6)"
                    : "0 2px 6px rgba(251, 133, 0, 0.4)",
            },
            position: "relative",
            overflow: "visible",
            minWidth: { xs: "140px", sm: "160px", md: "180px" },
            minHeight: { xs: "44px", sm: "48px", md: "52px" },
        },
        bubble: {
            position: "absolute",
            top: { xs: "-8px", sm: "-9px", md: "-10px" },
            right: { xs: "-8px", sm: "-9px", md: "-10px" },
            width: { xs: "16px", sm: "18px", md: "20px" },
            height: { xs: "16px", sm: "18px", md: "20px" },
            bgcolor: "#ffb703",
            borderRadius: "50%",
            animation: "bubble 1s ease-out",
            boxShadow: "0 0 8px 3px #ffb703",
        },
        prograssBar: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        loadingText: {
            fontWeight: "bold",
            // color: "#0d3b66",
            color: "#3E2723",
            fontSize: {xs: "1rem", md: "1rem", lg: "1.2rem"},
            marginBottom: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
        },
    };

    const handleCombackToHome = () => {
        setClicked(true);
        return navigate("/")
    }

    return(
        <Box sx={styles.container}>
            <Box sx={styles.topContent}>
                <Typography variant="h1" component="h1" sx={styles.title}>
                    CityUp
                </Typography>
                <Box style={styles.prograssBar}>
                    <Stack spacing={2} alignItems="center" height={"50%"}>
                        <CircularProgress sx={{
                            color: "#3E2723",
                            width: { xs: "3rem", sm: "4rem", md: "5rem" },
                            height: { xs: "3rem", sm: "4rem", md: "5rem" }
                        }}/>
                        <Typography variant="h6" component="h6" sx={styles.loadingText}>
                            Loading...
                        </Typography>
                        <Button onClick={handleCombackToHome} variant="contained" sx={styles.button}>
                            Get Home
                            {clicked && <Box component="span" sx={styles.bubble} />}
                        </Button>
                    </Stack>
                </Box>
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
            /* Mobile optimization */
            @media (max-width: 600px) {
                body {
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
            }
            }`}</style>
        </Box>
    )
}


export default LoadingPage;