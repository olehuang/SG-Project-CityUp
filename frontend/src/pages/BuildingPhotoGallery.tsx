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
import BuildingPhotoGalleryStyles from "./BuildingPhotoStyles";
import {useNavigate} from "react-router-dom";
import {photoReviewStyles} from "./PhotoReviewStyles";
import {useAuthHook} from "../components/AuthProvider";
import KeycloakClient from "../components/keycloak";

import CircularProgress from '@mui/material/CircularProgress';
import { List, ListItem,useTheme, useMediaQuery } from '@mui/material';

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
const BuildingPhotoGallery=()=>{


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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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




    return (
        <Box
            sx={{
                ...pageBackgroundStyles.container,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                maxWidth: '100vw',
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    ...BuildingPhotoGalleryStyles.container,
                    width: '100%',
                    maxWidth: '100vw',
                    margin: '0 auto',
                    padding: { xs: '8px', sm: '12px', md: '16px' },
                    boxSizing: 'border-box',
                }}
            >
                {/* Search box */}
                <Box sx={{ width: '100%', marginBottom: 2, boxSizing: 'border-box' }}>
                    <AdressSearchField
                        isNomatch={isNomatch}
                        setIsNomatch={setIsNomatch}
                        onSearch={handleSearch}
                        onSelect={handleSelect}
                        setSearchResult={setSearchResult}
                        allAddresses={allAddresses}
                    />
                </Box>

                {isLoading && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress color="success" variant="indeterminate" value={progress} />
                        <Typography>Loading...</Typography>
                    </Box>
                )}
                {error && <Alert severity="error">{error}</Alert>}

                {/* Main container: Address Table + Photo Preview */}
                <Box id="resizable-container" sx={{ ...BuildingPhotoGalleryStyles.innerContainer }}>
                    {/* Address Section */}
                    <Box
                        sx={{
                            ...BuildingPhotoGalleryStyles.leftContainer,
                            width: { xs: '100%', md: `calc(${leftWidth}% - 6px)` },
                        }}
                    >
                        {isMobile ? (
                            <List sx={{ width: '100%', backgroundColor: '#FAF6E9' }}>
                                {searchResult.length > 0 ? (
                                    searchResult
                                        .filter((addr) => (photoInfoMap[addr]?.photoNr ?? 0) > 0)
                                        .map((addr, idx) => (
                                            <ListItem
                                                key={idx}
                                                component="button"
                                                onClick={() => handleSelect(addr)}
                                                sx={{
                                                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                                                    backgroundColor: addr === selectedAddress ? '#bbdefb' : 'inherit',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    gap: 0.5,
                                                }}
                                            >
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {addr.replace(/,/g, '').replace(/Deutschland/gi, '').replace(/Hessen/gi, '')}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Last Update: {photoInfoMap[addr]?.updateTime || 'Loading...'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Photo Count: {photoInfoMap[addr]?.photoNr ?? '-'}
                                                </Typography>
                                            </ListItem>
                                        ))
                                ) : (
                                    <ListItem>
                                        <Typography>No Match</Typography>
                                    </ListItem>
                                )}
                            </List>
                        ) : (
                            <TableContainer
                                component={Paper}
                                style={{
                                    backgroundColor: '#FAF6E9',
                                    overflowX: 'auto',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Table size="medium" aria-label="building table">
                                    <TableHead
                                        sx={{
                                            backgroundColor: '#F1EFEC',
                                            position: 'sticky',
                                            top: 0,
                                        }}
                                    >
                                        <TableRow>
                                            <TableCell>
                                                <strong>Address</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Last Update Time</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Photo Count</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {searchResult.length > 0 ? (
                                            searchResult
                                                .filter((addr) => (photoInfoMap[addr]?.photoNr ?? 0) > 0)
                                                .map((addr, idx) => (
                                                    <TableRow
                                                        key={idx}
                                                        hover
                                                        sx={{
                                                            ...BuildingPhotoGalleryStyles.serachResault,
                                                            ...(addr === selectedAddress && {
                                                                backgroundColor: '#bbdefb',
                                                            }),
                                                        }}
                                                        onClick={() => handleSelect(addr)}
                                                    >
                                                        <TableCell>
                                                            {addr
                                                                .replace(/,/g, '')
                                                                .replace(/Deutschland/gi, '')
                                                                .replace(/Hessen/gi, '')}
                                                        </TableCell>
                                                        <TableCell>{photoInfoMap[addr]?.updateTime || 'Loading...'}</TableCell>
                                                        <TableCell>{photoInfoMap[addr]?.photoNr ?? '-'}</TableCell>
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
                        )}
                    </Box>

                    {/* Resizer */}
                    <Box
                        onMouseDown={handleMouseDown}
                        sx={{
                            ...BuildingPhotoGalleryStyles.resizer,
                            display: { xs: 'none', md: 'block' },
                        }}
                    />

                    {/* Photo Preview Section */}
                    <Box
                        sx={{
                            ...BuildingPhotoGalleryStyles.rightContainer,
                            flex: 1,
                            width: { xs: '100%', md: `calc(${100 - leftWidth}% - 6px)` },
                        }}
                    >
                        <Box>
                            <Box
                                sx={{
                                    ...BuildingPhotoGalleryStyles.rightContainerTitle,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: { xs: '6px', md: '10px' },
                                    mb: { xs: 1, md: 2 },
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: { xs: 16, sm: 18, md: 20 },
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Photos Preview
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleDialogOpen}
                                    fullWidth={isMobile}
                                    sx={{
                                        visibility: selectedAddress ? 'visible' : 'hidden',
                                        minWidth: 'auto',
                                        flexShrink: 0,
                                        alignSelf: { xs: 'center', md: 'flex-end' },
                                        mt: { xs: 1, md: 0 },
                                    }}
                                >
                                    View all
                                </Button>
                            </Box>
                            {/* Content */}
                            <Box sx={{ marginTop: { xs: '2%', md: '1%' } }}>
                                {selectedAddress && (photoInfoMap[selectedAddress]?.photoNr ?? 0) > 0 ? (
                                    <PhotoGrid address={selectedAddress} />
                                ) : (
                                    <Box
                                        sx={{
                                            minWidth: '100%',
                                            minHeight: '300px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            padding: 2,
                                            flexDirection: 'column',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant="h6" color="textSecondary" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                                            📷 No photos to display
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {isNomatch
                                                ? 'Please enter a valid address to view photos.'
                                                : 'Please select an address to view photos.'}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* All photo dialog */}
            <PhotoViewDialog viewAddress={viewAddress} open={open} handleDialogClose={handleDialogClose} />
        </Box>
    );
};


export default BuildingPhotoGallery;