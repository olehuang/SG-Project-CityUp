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
        background: "linear-gradient(to bottom right, #FFF8E1, #FBE9E7)",
        minHeight: "100vh",
        py: 6,
    },
    contentContainer: {
        maxWidth: 1100,
        margin: "0 auto",
        px: 2,
    },
    buttonGrid: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 4,
        mt: -10,
        mb: -3,
    },
    buttonContainer: {
        flex: "1 1 calc(33.333% - 32px)",
        minWidth: "280px",
        maxWidth: "350px",
    },
    buttonBase: {
        borderRadius: 16,
        width: "100%",
        height: 220,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 16,
        color: "#3E2723",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#D7CCC8",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            backgroundColor: "#A1887F",
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
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
        fontSize: 20,
        mt: 1,
    },
    buttonDesc: {
        mt: 1,
        color: "#6D4C41",
        fontWeight: "normal",
        textAlign: "center" as const,
    },
    rankingButtonContainer: {
        mt: 6,
        display: "flex",
        justifyContent: "center",
    },
    rankingButton: {
        borderRadius: 16,
        width: "100%",
        maxWidth: 1200,
        height: 110,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 16,
        color: "#3E2723",
        display: "flex",
        flexDirection: "row" as const,
        justifyContent: "center",
        alignItems: "center",
        paddingX: 4,
        backgroundColor: "#D7CCC8",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            backgroundColor: "#A1887F",
            transform: "translateY(-4px)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        },
    },
    rankingButtonIcon: {
        fontSize: 40,
        mr: 2,
    },
    rankingButtonTitle: {
        fontSize: 22,
        fontWeight: "bold",
    },
    rankingButtonDesc: {
        fontSize: 16,
        color: "#6D4C41",
    },
};

export default DashboardPage;