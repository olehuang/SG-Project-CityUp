import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton  from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import {Box, Typography, Container, Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Grid from '@mui/material/Grid';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


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
    const now = new Date();

    const photos = new Array(9).fill(null);
    const [updateTime,setUpdateTime]=useState(`${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`);
    const [photoNr,setPhotoNr]=useState(0);
    const [searchResult, setSearchResult] = useState<string[]>(mockResults);
    const [leftWidth, setLeftWidth] = useState(80);

    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);


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
        //handleSearch(selected);
        setSelectedAddress(selected);

    };
    return(
        <Box sx={pageBackgroundStyles.container} style={{justifyContent:"left",display:'contents',overflow: "hidden"}}>
            <Box  sx={styles.container}>
                <AdressSearchField  onSearch={handleSearch} onSelect={handleSelect}/>
                <Box id="resizable-container" sx={styles.innerContainer}>
                    <TableContainer component={Paper} style={{}}>
                        <Table size="medium" aria-label="building table">
                            <TableHead >
                                <TableRow >
                                    <TableCell><strong>Address</strong></TableCell>
                                    <TableCell><strong>Last Update Time</strong></TableCell>
                                    <TableCell><strong>Photo Count</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchResult.length > 0 ? (
                                    searchResult.map((addr, idx) => (
                                        <TableRow
                                            key={idx}
                                            hover
                                            sx={{...styles.serachResault,
                                                ...(addr === selectedAddress && {
                                                    backgroundColor: "#b2ebf2",  // click address highlight
                                                }),}}
                                            onClick={() => handleSelect(addr)}
                                        >
                                            <TableCell>{addr}</TableCell>
                                            <TableCell>{updateTime}</TableCell>
                                            <TableCell>{photoNr}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3}>No Match</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box onMouseDown={handleMouseDown} sx={styles.resizer} />
                    <Box sx={{ ...styles.rightContainer, width: `${100 - leftWidth}%` }}>

                        <Typography title="h1">Photo Area </Typography>
                        <Box>
                            {selectedAddress ? (
                                <PhotoGrid address={selectedAddress}/>
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    Please select an address to view photos.
                                </Typography>
                            )}

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
    searchTitle:{
        position: "absolut",
        display: "flex",
        justifyContent:"space-between",
        backgroundColor:"#fff",
        width:"100%",
        gridTemplateColumns: "50% 30% 20%",
    },
    serachResault:{
        //cursor: "pointer", transition: "all 0.2s ease-in-out"
        // display: "flex",
        // justifyContent:"space-between",
        // padding: "8px 12px",
        // gridTemplateColumns: "50% 30% 20%",
        // //border: "1px solid #ccc",
        // borderRadius: "5px",
        // backgroundColor: "#fff",
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