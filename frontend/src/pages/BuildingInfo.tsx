import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton  from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import {Box, Typography, Container, Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Grid from '@mui/material/Grid';

import React, {useState} from "react";
import AdressSearchField from "../components/AdressSearchField";
import PhotoGrid from "../components/PhotoGrid";
import {hover} from "@testing-library/user-event/dist/hover";

const mockResults = [
    "Karolinenpl. 5, 64289 Darmstadt ",
    "Karolinenpl. 5, 64283 Darmstadt",
    "Luisenplatz, Luisenpl. 5, 64283 Darmstadt",
    "Marktpl. 15, 64283 Darmstadt",
    "Friedenspl. 1, 64283 Darmstadt",
    "Schloßgartenstraße, 64289 Darmstadt",
    "Schloßgartenstraße 10, 64289 Darmstadt",
    "Schloßgartenstraße 6b, 64289 Darmstadt",
    "Schloßgartenstraße 7, 64289 Darmstadt",
    "Hochschulstraße 14, 64289 Darmstadt",
    "Schlossgraben 1, 64283 Darmstadt",
    "Landgraf-Georg-Straße, 64283 Darmstadt",
    "Magdalenenstraße 8, 64289 Darmstadt",
].sort((a,b)=>a.localeCompare(b));

const BuildingInfo=()=>{
    const utcString = new Date().toUTCString();

    const photos = new Array(9).fill(null);
    const [updateTime,setUpdateTime]=useState(utcString);
    const [photoNr,setPhotoNr]=useState(0);
    const [searchResult, setSearchResult] = useState<string[]>([]);
    const [leftWidth, setLeftWidth] = useState(80);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const container = document.getElementById("resizable-container");
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (newLeftWidth > 10 && newLeftWidth < 90) {
            setLeftWidth(newLeftWidth);
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };


    const handleSearch = (query: string) => {
        const result = mockResults.filter((addr) =>
            addr.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResult(result);
    };

    const handleSelect = (selected: string) => {
        // 也可以在这里记录用户选择的地址
        handleSearch(selected);

    };
    return(
        <Box sx={pageBackgroundStyles.container} style={{justifyContent:"left",display:'contents',overflow: "hidden"}}>
            <Box  sx={styles.container}>
                <AdressSearchField  onSearch={handleSearch} onSelect={handleSelect}/>
                <Box id="resizable-container" sx={styles.innerContainer}>
                    <Box sx={{...styles.leftContainer, width : `${leftWidth}%`}}>
                        {searchResult.length > 0 ? (
                            searchResult.map((addr, idx) => <Box
                                key={idx}
                                sx={styles.serachResault}
                            >
                                <Typography variant="body2">{addr} </Typography>
                                <Typography variant="body2">Last Update: {updateTime}</Typography>
                                <Typography variant="body2">Count:{photoNr}</Typography>

                            </Box>)
                        ) : (
                            <Box>No Match</Box>
                        )}
                    </Box>
                    <Box onMouseDown={handleMouseDown} sx={styles.resizer} />
                    <Box sx={{ ...styles.rightContainer, width: `${100 - leftWidth}%` }}>

                        <Typography title="h1">Photo Area </Typography>
                        <Box>
                            <PhotoGrid/>
                        </Box>
                    </Box>
                </Box>

            </Box>

        </Box>
    )

}

const styles={
    container:{
        position: "absolute",
        top: `${60}px`,
        left:0,
        right:0,
        margin:0,
        paddingTop: "0.5%",
        height:`calc(100vh - ${70}px)`,
        //border:"1px solid skyblue",
        borderRadius:"5px",
        overflow:"hidden",
        backgroundColor: "#e3f2fd",
        display: "flex",
        flexDirection: "column",
    },
    innerContainer:{
        top:"2%",
        marginTop:"0.5%",
        paddingTop:"0%",
        justifyContent:"left",
        display:"flex",
        flexDirection: "row",//  Direction of all result
        gap: "8px",// space between resualt
        height:"95%",
        width:"100%",
       // border:"1px solid red",
        borderRadius:"5px",
        overflowY: "auto",
    },
    leftContainer:{
        paddingBottom:"0",
        justifyContent:"left",
        display:"flex",
        flexDirection:"column",//  Direction of all result
        gap: "8px",// space between resualt
        height:"99%",
        //border:"1px solid black",
        borderRadius:"5px",
        overflowY: "auto",
    },
    serachResault:{
        display: "flex",
        height:"15%",
        justifyContent:"space-between",
        padding: "8px 12px",
        //border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#fff",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover()":{
            backgroundColor: "#e0f7fa",
            borderColor: "#128d9e",
        },
        "&:active": {
            transform: "scale(0.98)",
            backgroundColor: "#b2ebf2",
        },
    },

    rightContainer:{
        // justifyContent:"flex-start",
        // alignItems:"flex-start",
        paddingBottom:"0",
        display:"flex",
        flexDirection: "column",
        flexWrap:"warp",
        gap: "8px",// space between resualt
        padding:"0 0 0 0 ",
        height:"99%",
        //border:"1px solid blue",
        borderRadius:"5px",
        overflowY: "auto",
    },
    resizer: {
        width: "6px",
        cursor: "col-resize",
        backgroundColor: "#ddd",
        "&:hover": {
            backgroundColor: "#bbb",
        },
    }
}
export default BuildingInfo;