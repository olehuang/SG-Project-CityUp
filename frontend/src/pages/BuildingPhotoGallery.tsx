import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton  from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import {Box, Typography, Container, Button,Dialog, DialogTitle,} from "@mui/material";
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


import React, {useEffect, useState} from "react";
import AdressSearchField from "../components/AdressSearchField";
import PhotoGrid from "../components/PhotoGrid";
import {hover} from "@testing-library/user-event/dist/hover";
import axios from "axios";
import PhotoViewDialog from "../components/PhotoViewDialog";
import BuildingPhotoGalleryStyles from "./BuildingPhotoStyles";
import {useNavigate} from "react-router-dom";
import {photoReviewStyles} from "./PhotoReviewStyles";

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

const BuildingPhotoGallery=()=>{
    const now = new Date();

    const photos = new Array(9).fill(null);

    const [leftWidth, setLeftWidth] = useState(60);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [allAddresses, setAllAddresses] = useState<string[]>([]);
    const [searchResult, setSearchResult] = useState<string[]>([...mockResults]);

    const [open,setOpen]=useState(false);//Photo dialog
    const [isNomatch,setIsNomatch]=useState(false);

    const [photoInfoMap, setPhotoInfoMap] = useState<Record<string, { updateTime: string, photoNr: number }>>({});

    const navigat=useNavigate();

    const url="http://127.0.0.1:8000"
    useEffect(() => {
        const fetchAllData=async ()=>{
            try {
                const response = await axios.get(url+"/buildings/get_all_build_addr");
                const addrList =response.data.sort((a: string, b: string) => a.localeCompare(b));
                console.log("addr_list:",addrList)
                setAllAddresses(addrList);
                setSearchResult([...addrList]);

                const infoMap: Record<string, { updateTime: string, photoNr: number }> = {};
                await Promise.all(
                    addrList.map(async (address:string) => {
                        try {
                            const [updateResp, countResp] = await Promise.all([
                                axios.get(url + "/photos/get_first_upload_time", { params: { address } }),
                                axios.get(url + "/photos/photoNumber", { params: { address } }),
                            ]);

                            const rawtime = updateResp.data;
                            const formatTime = new Intl.DateTimeFormat("de-DE",{
                                timeZone: "Europe/Berlin",
                                dateStyle: "medium",
                                timeStyle: "medium",
                                }).format(new Date(rawtime));

                            infoMap[address] = {
                                updateTime: formatTime,
                                photoNr: countResp.data,
                            };
                        } catch (err: any) {
                            console.warn(`Failed to fetch info for ${address}:`, err.message);
                            infoMap[address] = {
                                updateTime: "Error",
                                photoNr: -1,
                            };
                        }
                    })
                );
                setPhotoInfoMap(infoMap);
            }catch (e:any) {
                console.log(e.message || "Unknown error")
                setAllAddresses(mockResults);
                setSearchResult(mockResults);
            }
        }
        fetchAllData();
    }, []);


    const handleDialogOpen = (index: number) => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);

    };

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

        const result = allAddresses.filter((addr) =>
            addr.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResult(result);

    };


    const handleSelect = (selected: string) => {
        //handleSearch(selected);
        setSelectedAddress(selected);

    };

    useEffect(()=>{
        if (searchResult.length>0) return;

        if (searchResult.length===0){
            setIsNomatch(true);
        }
    },[searchResult])



    return(
        <Box sx={{
            ...pageBackgroundStyles.container,
            justifyContent:"content",
            display:'contents',
            overflow: "hidden",
            position: 'relative'
        }}>
            <Box  sx={BuildingPhotoGalleryStyles.container}>
                {/*Search box*/}
                <AdressSearchField
                    isNomatch={isNomatch}
                    setIsNomatch={setIsNomatch}
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    setSearchResult={setSearchResult}
                    allAddresses={allAddresses}

                />
                {/*under Big Box/Container include Address Table Area and Photo Preview Area*/}
                <Box id="resizable-container" sx={BuildingPhotoGalleryStyles.innerContainer}>
                    {/*Adresse Table */}
                    <TableContainer component={Paper} style={{backgroundColor: "#e3eaed",}}>
                        <Table  size="medium" aria-label="building table">
                            <TableHead sx={{backgroundColor:"#abd1e6", position: "sticky", top: 0}}>
                                <TableRow >
                                    <TableCell><strong>Address</strong></TableCell>
                                    <TableCell><strong>Last Update Time</strong></TableCell>
                                    <TableCell><strong>Photo Count</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchResult.length > 0 ? (
                                    searchResult.filter(addr => (photoInfoMap[addr]?.photoNr ?? 0) > 0)
                                        .map((addr, idx) => (
                                        <TableRow
                                            key={idx}
                                            hover
                                            sx={{...BuildingPhotoGalleryStyles.serachResault,
                                                ...(addr === selectedAddress && {
                                                    backgroundColor: "#e3eaed",  // click address highlight
                                                }),}}
                                            onClick={() => handleSelect(addr)}
                                        >
                                            <TableCell>{addr.replace(/,/g, '').replace(/Deutschland/gi, '').replace(/Hessen/gi,'')}</TableCell>
                                            <TableCell>{photoInfoMap[addr]?.updateTime || "Loading..."}</TableCell>
                                            <TableCell>{photoInfoMap[addr]?.photoNr ?? "-"}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} >No Match</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </TableContainer>
                    {/*Photo Preview Area include 9 Photos follow upload time 1. Photo is the neu*/}
                    <Box onMouseDown={handleMouseDown} sx={BuildingPhotoGalleryStyles.resizer} />
                    <Box sx={{ ...BuildingPhotoGalleryStyles.rightContainer, width: `${100 - leftWidth}%` }}>
                        <Box >
                            <Box sx={BuildingPhotoGalleryStyles.rightContainerTitle}>
                                <Typography ><strong>Photos Preview</strong> </Typography>
                                <Button variant={"outlined"}
                                        onClick={()=>setOpen(true)}>View all</Button>
                            </Box>
                            <Box sx={{marginTop: "1%"}}>
                                {selectedAddress && (photoInfoMap[selectedAddress]?.photoNr ?? 0) > 0 ? (
                                    <PhotoGrid address={selectedAddress}/>
                                ) :
                                    isNomatch ? (
                                        <Box sx={{minWidth:"100%", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <Typography variant="body2" color="textSecondary">
                                            Please enter a valid address to view photos.

                                        </Typography>
                                        </Box>
                                        )
                                    : (<Box sx={{minWidth:"100%", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <Typography variant="body2" color="textSecondary">
                                            Please select an address to view photos.
                                        </Typography>
                                     </Box>
                                    )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {/*All photo Dialog */}
            <PhotoViewDialog selectedAddress={selectedAddress} open={open} handleDialogClose={handleDialogClose}/>
            <Button
                variant="outlined"
                onClick={()=>{navigat("/dashboard");}}
                sx={{...photoReviewStyles.exitButton, position: 'absolute',marginTop:"1.5%",bottom:"1%",right:"4%"}}
            >Exit</Button>
        </Box>
    )

}


export default BuildingPhotoGallery;