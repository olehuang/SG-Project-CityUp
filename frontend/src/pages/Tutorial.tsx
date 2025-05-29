import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton  from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

import {
    Box,
    Grid,
    Tabs,
    Tab,
    Stepper,
    Step,
    StepLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    List,
    ListItem,
    Drawer,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import {useAuthHook} from "../components/AuthProvider";
import KeycloakClient from "../components/keycloak";


const Tutorial=()=>{
    const drawerWidth = 240;
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

    const sections = [
        "Tutorial",
        "Photograph",
        "Photo Upload",
        "Upload Histoty",
        "Building Information",
        ...(roles.includes("admin") ? ["Photo Review", "User Management"] : [])
    ];


    return(
        <Box sx={pageBackgroundStyles.container}
             style={{
                 justifyContent: "flex-start",
                 alignItems: "stretch",
                 overflow:"auto"  }}>
            {/* 左边栏 */}
            <Box
                sx={{
                    position: "fixed",
                    top: `${64}px`, // 关键：贴紧 AppBar
                    left: 0,
                    width: `${drawerWidth}px`,
                    height: `calc(100% - ${64}px)`,
                    borderRight: "1px solid #ddd",
                    backgroundColor: "#fdfdfb",
                    overflowY: "auto",
                    zIndex: 1000,
                    padding:0
                }}
            >
                <Box sx={{overflow: "auto", p: 2}}>
                    <List>
                        {sections.map((text, index) => (
                                <ListItem key={index} disablePadding onClick={() => {
                                    const element = document.getElementById(text);
                                    if (element) {
                                        element.scrollIntoView({behavior: 'smooth', block: 'start'});
                                    }
                                }}>
                                    <ListItemButton>
                                        <ListItemText primary={text}/>
                                    </ListItemButton>
                                </ListItem>
                            )
                        )
                        }
                    </List>
                </Box>
            </Box>
            {/*right seid*/}
                <Box
                    component={"main"}
                    sx={{
                        flexGrow: 1,
                        marginLeft: ` ${drawerWidth}px`,
                        height: `100vh`,
                        paddingLeft: "0px",
                        paddingTop: "0px",
                        backgroundColor: "#fdfdfb",
                        border: `1px solid #fdf`,
                    }}
                >
                    <Typography id={"Tutorial"} variant="h2"
                                sx={{paddingLeft: '16px'}}>CityUp Tutorial</Typography>
                    <Divider sx={styles.divider}/>


                    <Box id={"Photograph"} sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>Photograph</Typography>
                    </Box>
                    <Divider sx={styles.divider}/>

                    <Box id={"Photo Upload"} sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>Photo Upload</Typography>
                    </Box>
                    <Divider sx={styles.divider}/>

                    <Box id={"Upload Histoty"} sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>Upload Histoty</Typography>
                    </Box>
                    <Divider sx={styles.divider}/>

                    <Box id={"Building Information"} sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>Building Information</Typography>
                    </Box>
                    <Divider sx={styles.divider}/>

                    {roles.includes('admin') &&
                        <>
                            <Box id={"Photo Review"} sx={styles.tutorialModelBox}>
                                <Typography variant="h4" sx={styles.title}>Photo Review</Typography>
                            </Box>
                            <Divider sx={styles.divider}/>
                        </>
                    }

                    {roles.includes('admin') &&
                        <>
                            <Box id={"User Management"} sx={styles.tutorialModelBox}>
                                <Typography variant="h4" sx={styles.title}>User Management</Typography>
                            </Box>
                            <Divider sx={styles.divider}/>
                        </>
                    }


                    {/* 这里可以继续添加内容 */}
                </Box>

        </Box>
    )
}

const styles={
    divider:{paddingLeft: 0},
    tutorialModelBox:{
        paddingTop:"16px"
    },
    title:{
        paddingLeft: '16px'
    },
};

export default Tutorial;