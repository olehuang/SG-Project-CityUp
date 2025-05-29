import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton  from "@mui/material/ListItemButton";
import pageBackgroundStyles from "../pages/pageBackgroundStyles";
import React,{useState}from "react";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const Tutorial=()=>{
    return(
        <Box sx={pageBackgroundStyles.container} style={{justifyContent: "left !important"}}>
            <Box sx={{ display: "flex", height: "100vh",}}>
                {/* left seid */}
                <Box sx={{
                    width: 280,
                    border: "1px solid #ddd",
                    overflowY: "auto",
                    px: 2,
                    py: 4,
                }}>
                </Box>
            </Box>
            {/*right seid*/}
            <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto" }}>
            </Box>
        </Box>
    )
}
export default Tutorial;