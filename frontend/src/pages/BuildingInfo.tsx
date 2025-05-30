import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton  from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import {Box, Typography, Container, Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import React, {useState} from "react";
import AdressSearchField from "../components/AdressSearchField";

const BuildingInfo=()=>{

    const [photoNr,setPhotoNr]=useState(0);
    const mockResults = [
        "Karolinenpl. 5, 64289 Darmstadt ",
        "Luisenplatz, Luisenpl. 5, 64283 Darmstadt",
        "Marktpl. 15, 64283 Darmstadt"
    ];

    return(
        <Box sx={pageBackgroundStyles.container} >
            <Container sx={styles.containerLeft}>
                <Container sx={styles.leftInnerContainer}>
                    <AdressSearchField />
                    {mockResults.map((item, index) => (
                        <Box
                            key={index}
                            sx={styles.serachResault}
                        >
                            <Typography variant="body2">{item} </Typography>
                            <Typography variant="body2">Count:{photoNr}</Typography>
                        </Box>
                    ))}
                </Container>
            </Container>
            <Container sx={styles.containerRight}>
                <Container sx={styles.rightInnerContainer}>

                </Container>
            </Container>
        </Box>
    )

}

const styles={
    outSideContainer:{
        justifyContent:"left",
        display: 'flex',
        width: "100%",
        height: "100%",
    },
    containerLeft:{
        flex: 2,
        marginLeft:"0",
        marginRight:"1%",
        marginBottom:"5%",
        height:"85%",
        border:"1px solid skyblue",
        borderRadius:"5px",
        overflow:"auto",
        backgroundColor: "#e3f2fd",
        paddingLeft:"0",
    },
    containerRight:{
        flex: 2,
        position:"fiex",
        height:"85%",
        width:"100%",
        marginBottom:"5%",
        marginLeft:"0",
        backgroundColor: "#e8f5e9",//heil green
        border:"1px solid black",
        borderRadius:"5px",
        overflowY:"auto"
    },
    leftInnerContainer:{
        top:"2%",
        paddingTop:"2%",
        justifyContent:"left",
        display:"flex",
        flexDirection:"column",//  Direction of all result
        gap: "8px",// space between resualt
        height:"100%",
        border:"1px  skyblue",
        borderRadius:"5px",
        overflowY: "auto",
    },
    serachResault:{
        display: "flex",
        justifyContent:"space-between",
        direction: "column",
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#fff",
    },

    rightInnerContainer:{
        justifyContent:"flex-start",
        alignItems:"flex-start",
        display:"flex",
        flexWrap:"warp",
        gap: "8px",// space between resualt
        padding:"12px",
        height:"100%",
        border:"1px solid red",
        borderRadius:"5px",
        overflowY: "auto",
    }
}
export default BuildingInfo;