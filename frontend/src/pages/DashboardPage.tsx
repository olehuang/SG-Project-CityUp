import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import {
    UploadFile,
    Info,
    History,
    PhotoLibrary,
    MenuBook,
    RateReview,
    Checklist,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import pageBackgroundStyles from "./pageBackgroundStyles";
import { useAuthHook } from "../components/AuthProvider";
import KeycloakClient from "../components/keycloak";
import { useTranslation } from 'react-i18next';
const iconMap: Record<string, React.ReactNode> = {
    "Upload": <UploadFile fontSize="large" />,
    "Product Introduction": <Info fontSize="large" />,
    "Upload History": <History fontSize="large" />,
    "Photo Gallery": <PhotoLibrary fontSize="large" />,
    "Tutorial": <MenuBook fontSize="large" />,
    "Photo Review": <RateReview fontSize="large" />,
};

const DashboardPage: React.FC = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const navigate = useNavigate();
    const { token } = useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRoles = async () => {
            const userInfo= await KeycloakClient.extractUserInfo(token);
            setRoles(userInfo?.roles||[]);

        }
        if (token!==null && token!==undefined) {
            fetchRoles();
        }
    },[token]);

    const topItems = [
        { label: "Tutorial", desc: t("dashboard.tutorialDesc") },
        { label: "Upload", desc: t("dashboard.uploadDesc") },
        { label: "Photo Gallery", desc: t("dashboard.buildingPhotoDesc")},
    ];

    const bottomItems = [
        { label: "Product Introduction", desc: t("dashboard.productIntroDesc") },
        { label: "Upload History", desc: t("dashboard.historyDesc") },
        { label: "Photo Review", desc: t("dashboard.reviewDesc") },
    ].filter((item) => item.label !== "Photo Review" || roles.includes("admin"));

    const labelMap = (label: string) => {
        switch (label) {
            case "Tutorial": return "tutorial";
            case "Upload": return "upload";
            case "Photo Gallery": return "photoGallery";
            case "Product Introduction": return "productIntroduction";
            case "Upload History": return "uploadHistory";
            case "Photo Review": return "photoReview";
            case "Ranking": return "ranking";
            default: return "";
        }
    };

    const handleClick = (label: string) => {
        navigate("/dashboard/" + labelMap(label));
        setSelected((prev) => (prev === label ? null : label));
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.contentContainer}>
                <Box sx={styles.buttonGrid}>
                    {[...topItems, ...bottomItems].map(({ label, desc }) => (
                        <Box
                            key={label}
                            sx={styles.buttonContainer}
                        >
                            <Button
                                onClick={() => handleClick(label)}
                                variant="contained"
                                sx={{
                                    ...styles.buttonBase,
                                    ...(selected === label ? styles.buttonSelected : {}),
                                }}
                            >
                                {iconMap[label]}
                                <Typography sx={styles.buttonTitle}>{t(`dashboard.${labelMap(label)}Title`)}</Typography>
                                <Typography sx={styles.buttonDesc}>{desc}</Typography>
                            </Button>
                        </Box>
                    ))}
                </Box>
                <Box sx={styles.rankingButtonContainer}>
                    <Button
                        onClick={() => handleClick("Ranking")}
                        variant="contained"
                        sx={styles.rankingButton}
                    >
                        <Checklist sx={styles.rankingButtonIcon} />
                        <Box>
                            <Typography sx={styles.rankingButtonTitle}>{t("dashboard.rankingTitle")}</Typography>
                            <Typography sx={styles.rankingButtonDesc}>{t("dashboard.rankingDesc")}</Typography>

                        </Box>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
const styles = {
    mainContainer: {
        ...pageBackgroundStyles.container,
        margin:"auto",// Control the border outside the button area so that the button appears in the center of the page
        paddingTop: {xs:"7%",md:"2%"},// Control the border outside the button area so that the button appears in the center of the page

    },
    contentContainer: {
        maxWidth: { xs: "100%", sm: 600, md: 900, lg: 1100 }, // Responsive maximum width
        margin: "auto auto",
        px: { xs: 1, sm: 2 }, // Responsive horizontal spacing
    },
    buttonGrid: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: { xs: 2, sm: 3, md: 3 }, // Responsive spacing
        mt: { xs: -6, sm: -8, md: -6 }, // Responsive top margin
        mb: { xs: -1, sm: -2, md: -1 }, // Responsive bottom margin
    },
    buttonContainer: {
        flex: {
            xs: "1 1 calc(50% - 8px)", // 2 columns on mobile phone
            sm: "1 1 calc(50% - 12px)", // 2 columns on tablet side
            md: "1 1 calc(33.333% - 16px)", // 3 columns on desktop
            lg: "1 1 calc(33.333% - 32px)"
        },

    },
    buttonBase: {
        borderRadius: { xs: 12, sm: 14, md: 16 }, // Responsive rounded corners
        width: "100%",
        height:  "100%" , // button height
        textTransform: "none",
        fontWeight: "bold",
        fontSize: { xs: 12, sm: 14, md: 16 }, // Responsive font size
        color: "#3E2723",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: "5%", sm: "8%", md: "10%" }, // Responsive padding
        backgroundColor: "#D7CCC8",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            backgroundColor: "#A1887F",
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        },
        // 移动端点击效果
        "&:active": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        },
    },
    buttonSelected: {
        backgroundColor: "#A1887F",
        color: "#FFF8E1",
        border: "2px solid #5D4037",
        transform: "scale(1.03)",
    },
    buttonTitle: {
        fontWeight: "bold",
        fontSize: { xs: 16, sm: 18, md: 20 }, // Responsive title fonts
        mt: 1,
        textAlign: "center" as const,
        lineHeight: 1.2,
    },
    buttonDesc: {
        mt: 1,
        color: "#6D4C41",
        fontWeight: "normal",
        textAlign: "center" as const,
        fontSize: { xs: 12, sm: 13, md: 14 }, // Responsive description fonts
        display: { xs: "none", sm: "block" },// hidden Desc if mobil
        lineHeight: 1.3,
        px: 0.5, // Prevent long text from wrapping
    },
    rankingButtonContainer: {
        mt: { xs: 3, sm: 4, md: 4 },
        display: "flex",
        justifyContent: "center",
    },
    rankingButton: {
        borderRadius: { xs: 12, sm: 14, md: 16 }, // Responsive rounded corners
        width: "100%",
        maxWidth: { xs: "100%", sm: 500, md: 800, lg: 1200 }, // Responsive maximum width
        height: { xs: 80, sm: 90, md: 90 }, // Responsive height
        textTransform: "none",
        fontWeight: "bold",
        fontSize: { xs: 14, sm: 15, md: 16 }, // Responsive fonts
        color: "#3E2723",
        display: "flex",
        flexDirection: "row" as const,
        justifyContent: "center",
        alignItems: "center",
        paddingX: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding
        backgroundColor: "#D7CCC8",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            backgroundColor: "#A1887F",
            transform: "translateY(-4px)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        },
        // 移动端点击效果
        "&:active": {
            transform: "translateY(-2px)",
            boxShadow: "0 5px 10px rgba(0,0,0,0.12)",
        },
    },
    rankingButtonIcon: {
        fontSize: { xs: 28, sm: 32, md: 40 }, // Responsive icon sizes
       // mr: { xs: 1, sm: 1.5, md: 2 }, // Responsive right margin
    },
    rankingButtonTitle: {
        fontSize: { xs: 18, sm: 20, md: 22 }, // Responsive title fonts
        fontWeight: "bold",
        lineHeight: 1.2,
    },
    rankingButtonDesc: {
        fontSize: { xs: 12, sm: 14, md: 16 }, // Responsive description fonts
        color: "#6D4C41",
        lineHeight: 1.3,
        display: { xs: "none", sm: "block" }, // Hide description text on mobile phones to save space

    },
};

export default DashboardPage;