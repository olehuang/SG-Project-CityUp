import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton  from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import {Box, Typography, Container, Button,Dialog, DialogTitle,LinearProgress,Alert} from "@mui/material";
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
import BuildingPhotoGalleryStyles from "./PhotoGarlleryStyles";
import {useNavigate} from "react-router-dom";
import {photoReviewStyles} from "./PhotoReviewStyles";
import {useAuthHook} from "../components/AuthProvider";
import KeycloakClient from "../components/keycloak";

import CircularProgress from '@mui/material/CircularProgress';

const mockResults = [
    "Karolinenpl. 5, 64289 Darmstadt ",

].sort((a,b)=>a.localeCompare(b));

/**
 * type Dataform from DBMS
 * */
type BuildingInfo = {
    address: string;
    photoNr: number;
    updateTime: string;
};

/**
 *  show user which photo under which address has in DBMS storage.
 *  user can first 9 photo preview (order follow time )and can see all photo in View ALL
 * */
const PhotoGallery=()=>{


    const [leftWidth, setLeftWidth] = useState(70);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [allAddresses, setAllAddresses] = useState<string[]>([]);
    const [searchResult, setSearchResult] = useState<string[]>([...mockResults]);

    const [open,setOpen]=useState(false);//Photo dialog
    const [viewAddress,setViewAddress] = useState<string | null>(null)
    const [isNomatch,setIsNomatch]=useState(false);

    const [photoInfoMap, setPhotoInfoMap] = useState<Record<string, { updateTime: string, photoNr: number }>>({});

    const navigat=useNavigate()

    const [isLoading,setIsLoading] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    const [error,setError] = useState<string>("")
    const [isError,setIsError] = useState<false>(false)

    const url="http://127.0.0.1:8000"
    useEffect(() => {

        setIsLoading(true);
        setProgress(0);

        /**
         * fetch Address data from DBMS
         * */
        const fetchAllData=async ()=>{
            try {

                const response =await axios.get(url+"/buildings/get_addr_with_status");

                const raw_list: BuildingInfo[] = response.data.map((item: any) => ({
                    address: item.building_addr,
                    photoNr: item.photo_count,
                    updateTime: formatTime(item.last_update_time),
                }));

                //take a address list
                const addrList = raw_list.map(item=>item.address);
                setAllAddresses(addrList);
                setSearchResult([...addrList]);

                const infoMap:Record<string,{updateTime: string,photoNr:number}>={};
                raw_list.forEach((item,idx)=>{
                    // Time format to change
                    infoMap[item.address]={
                        updateTime:item.updateTime,
                        photoNr:item.photoNr
                    }

                })

                setPhotoInfoMap(infoMap);

            }catch (e:any) {
                setError(e.message || "Unknown error")
                setAllAddresses(mockResults);
                setSearchResult(mockResults);

            }finally {
                setIsLoading(false);
            }
        }
        fetchAllData();

    }, []);

    // change Time format to EU format
    const formatTime =  (time:any)=>{
        let formattedTime = "N/A";
        if (time && time.trim()) {
            try {
                const timeStr = time+ (
                    time.includes('Z') || time.includes('+') ? '' : 'Z'
                );
                formattedTime = new Intl.DateTimeFormat("de-DE",{
                    timeZone:"Europe/Berlin",
                    dateStyle:"medium",
                    timeStyle:"medium",
                }).format(new Date(timeStr));
            } catch (error) {
                console.error(error, "updateTime:", time);
                formattedTime = "Invalid Date";
            }finally {
                return formattedTime;
            }
        }

    }

    const handleDialogOpen = () => {
        setOpen(true);
        setViewAddress(selectedAddress)
    };

    const handleDialogClose = () => {
        setOpen(false);
        setViewAddress(null)
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
                {isLoading && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress color={"success"}  variant="indeterminate" value={progress} />
                        <Typography sx={{}}>Loading...</Typography>
                    </Box>
                )}
                {error && <Alert severity="error">{error}</Alert>}
                {/*under Big Box/Container include Address Table Area and Photo Preview Area*/}
                <Box id="resizable-container"
                     sx={{...BuildingPhotoGalleryStyles.innerContainer}}>
                    {/*Adresse Table */}
                    <Box sx={{...BuildingPhotoGalleryStyles.leftContainer,
                        width: `calc(${leftWidth}% - 6px)`
                    }}>
                    <TableContainer component={Paper}
                                    style={{backgroundColor:"#FAF6E9",//"#d9e7f1",
                                    }}>
                        <Table  size="medium" aria-label="building table">
                            <TableHead sx={{backgroundColor:"#F1EFEC",//"#abd1e6",
                                position: "sticky", top: 0}}>
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
                                                    backgroundColor: "#bbdefb",//"#e3eaed",  // click address highlight
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
                    </Box>
                    {/*Photo Preview Area include 9 Photos follow upload time 1. Photo is the neu*/}
                    <Box onMouseDown={handleMouseDown} sx={BuildingPhotoGalleryStyles.resizer} />
                    <Box sx={{ ...BuildingPhotoGalleryStyles.rightContainer,
                        //width: `calc(${100 - leftWidth}% - 6px)`
                        flex: 1
                    }}>
                        <Box >
                            <Box sx={BuildingPhotoGalleryStyles.rightContainerTitle}>
                                <Typography ><strong>Photos Preview</strong> </Typography>
                                <Button variant={"outlined"}
                                        onClick={handleDialogOpen}
                                            sx={{visibility:selectedAddress? "visible":"hidden" }}>
                                            View all</Button>
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
            <PhotoViewDialog viewAddress={viewAddress} open={open} handleDialogClose={handleDialogClose}/>

        </Box>
    )

}


export default PhotoGallery;