
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
            paddingTop: { xs: "30vh", sm: "22vh", md: "25vh" }, // 响应式顶部间距
            zIndex: 2,
            px: { xs: 2, sm: 3, md: 4 }, // 响应式水平内边距，防止内容贴边
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
                xs: "4rem",    // 手机端: 64px
                sm: "6rem",    // 平板端: 96px
                md: "8rem",    // 中等屏幕: 128px
                lg: "10rem",   // 大屏幕: 160px
                xl: "12rem"    // 超大屏幕: 192px
            },
            marginBottom: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // 响应式下边距
            lineHeight: { xs: 0.9, sm: 1, md: 1.1 }, // 响应式行高，防止文字过高
            // 防止长文本溢出
            wordBreak: "break-word",
            maxWidth: "100%",
        },
        button: {
            bgcolor: clicked ? "#ffb703" : "#fb8500",
            color: "#fff",
            px: { xs: 3, sm: 3.5, md: 4 }, // 响应式水平内边距
            py: { xs: 1.2, sm: 1.35, md: 1.5 }, // 响应式垂直内边距
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" }, // 响应式字体大小
            borderRadius: "50px",
            boxShadow: clicked
                ? "0 0 15px 5px rgba(251, 133, 0, 0.7)"
                : "0 4px 8px rgba(251, 133, 0, 0.5)",
            transition: "all 0.3s ease",
            "&:hover": {
                bgcolor: "#ffb703",
                boxShadow: "0 0 20px 8px rgba(255, 183, 3, 0.9)",
            },
            // 移动端点击效果
            "&:active": {
                transform: "scale(0.95)",
                boxShadow: clicked
                    ? "0 0 12px 4px rgba(251, 133, 0, 0.6)"
                    : "0 2px 6px rgba(251, 133, 0, 0.4)",
            },
            position: "relative",
            overflow: "visible",
            // 确保按钮在小屏幕上可见且易于点击
            minWidth: { xs: "140px", sm: "160px", md: "180px" },
            minHeight: { xs: "44px", sm: "48px", md: "52px" }, // 遵循移动端最小点击区域标准
        },
        bubble: {
            position: "absolute",
            top: { xs: "-8px", sm: "-9px", md: "-10px" }, // 响应式定位
            right: { xs: "-8px", sm: "-9px", md: "-10px" }, // 响应式定位
            width: { xs: "16px", sm: "18px", md: "20px" }, // 响应式尺寸
            height: { xs: "16px", sm: "18px", md: "20px" }, // 响应式尺寸
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
      /* 移动端优化：防止页面缩放 */
                @media (max-width: 600px) {
                    body {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
                }
                
                /* 确保背景图片在移动端正确显示 */
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