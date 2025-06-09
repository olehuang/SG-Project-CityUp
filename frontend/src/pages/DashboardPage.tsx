import React, {useEffect, useState} from "react";
import { Box, Button, Typography } from "@mui/material";
import {useNavigate} from "react-router-dom";
import pageBackgroundStyles from "./pageBackgroundStyles";
import {useAuthHook} from "../components/AuthProvider";
import KeycloakClient from "../components/keycloak";

const styles = {
    // container: {
    //     height: "100vh",
    //     margin: 0,
    //     padding: 0,
    //     boxSizing: "border-box",
    //     // backgroundColor: "#f5f9fc",
    //     backgroundColor: "#FFF8E1",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     overflowY: "hidden",
    // },
    // wrapper: {
    //     width: 1000,
    //     maxWidth: "100%",
    //     marginTop: "-60px",
    // },
    topRow: {
        display: "flex",
        justifyContent:  "center",
        gap: 15,
        mb: 3,
    },
    bottomRow: {
        display: "flex",
        justifyContent: "center",
        gap: 15,
    },
    buttonBase: {
        borderRadius: 16,
        width: 260,
        height: 220,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: 16,
        // color: "#003366",
        color: "#3E2723",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        // backgroundColor: "#d0e8ff",
        backgroundColor: "#D7CCC8",
        "&:hover": {
            // backgroundColor: "#a8d0f0",
            backgroundColor: "#A1887F",
        },
    },
    buttonSelected: {
        // backgroundColor: "#a0c8ff",
        backgroundColor: "#A1887F",
        color: "#FFF8E1",
    },
    buttonTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    buttonDesc: {
        mt: 1,
        // color: "#0055aa",
        color: "#6D4C41",
        fontWeight: "normal",
        textAlign: "center",
    },
};

const DashboardPage: React.FC = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const navigate = useNavigate();
    const {token}=useAuthHook();

    const [roles, setRoles] = useState<string[]>([]);
    useEffect(() => {
        const fetchRoles = async () => {
            const userInfo= await KeycloakClient.extractUserInfo(token);
            setRoles(userInfo?.roles||[]);
            console.log(userInfo?.roles);
        }
        if (token!==null && token!==undefined) {
            fetchRoles();
        }
    },[token]);

    //bottom Button in Daschboard page
    const topItems = [
        { label: "Tutorial", desc: "Step-by-step guide" },
        { label: "Upload", desc: "Add your files here"  },
        { label: "Building Information", desc: "Browse building details" },
    ];

    //bottom Button in Daschboard page
    const bottomItems =(
        [
            { label: "Product Introduction", desc: "Overview of the project" },
            { label: "Upload History", desc: "See your past uploads" },
            { label: "Photo Review", desc: "Review uploaded Photos" }
        ]
            .filter( item => item.label !== "Photo Review" || roles.includes("admin"))
    );

    const labelMap=(label:string)=>{
        switch (label) {
            case "Tutorial":return "tutorial";
            case "Upload":return "upload";
            case "Building Information":return "buildingInformation";
            case "Product Introduction": return "productIntroduction";
            case "Upload History":return "uploadHistory";
            case "Photo Review": return "photoReview";
            default:return "";
        }
    }

    const handleClick = (label: string) => {
        navigate("/dashboard/"+labelMap(label));// transfor to label page
        if (selected === label) {
            setSelected(null);  // 如果已经选中了，再点一次取消选中

        } else {
            setSelected(label);
        }
    };

    return (
        <Box sx={pageBackgroundStyles.container}>
            <Box sx={pageBackgroundStyles.wrapper}>
                <Box sx={styles.topRow}>
                    {topItems.map(({ label, desc }) => (
                        <Button
                            key={label}
                            onClick={() => handleClick(label)}
                            variant="contained"
                            sx={{
                                ...styles.buttonBase,
                                ...(selected === label ? styles.buttonSelected : {}),

                            }}
                        >
                            <Typography sx={styles.buttonTitle}>{label}</Typography>
                            <Typography sx={styles.buttonDesc}>{desc}</Typography>
                        </Button>
                    ))}
                </Box>
                <Box sx={styles.bottomRow}>
                    {bottomItems.map(({ label, desc }) => (
                        <Button
                            key={label}
                            onClick={() => handleClick(label)}
                            variant="contained"
                            sx={{
                                ...styles.buttonBase,
                                ...(selected === label ? styles.buttonSelected : {}),
                            }}
                        >
                            <Typography sx={styles.buttonTitle}>{label}</Typography>
                            <Typography sx={styles.buttonDesc}>{desc}</Typography>
                        </Button>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardPage;




