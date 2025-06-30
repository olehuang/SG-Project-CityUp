import React, {useEffect, useState} from "react";
import {Box, Dialog, DialogTitle, Typography,ImageList,
    ImageListItem,
    ImageListItemBar,
    Button,
    IconButton,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import PhotoOrderSelector from "./PhotoOrderSelector";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import PhotoCarousel from "./PhotoCarousel";
import qs from "qs";
import {useAuthHook} from "./AuthProvider";
import KeycloakClient from "./keycloak";
import Photo  from "./PhotoGrid"



interface Props {
    selectedAddress: string|null;
    open: boolean;
    handleDialogClose: () => void;
}

interface Photo {
    id: string;
    src: string;
    title: string;
    uploader_id:string;
    uploader: string;
    uploadTime: string;
    canLike:boolean;
}
const PhotoViewDialog:React.FC<Props>=({selectedAddress,open,handleDialogClose})=>{

    const [photos, setPhotos] = useState<Photo[]>([]);//backend return photo list
    const [loading, setLoading] = useState(false); //loding photo
    const [error, setError] = useState<string | null>(null); // error
    const [selectOrder,setSelectOrder] = useState<string>("Time Asc");
    const [sortedPhotos, setSortedPhotos] = useState<Photo[]>([]);

    const [isSelecting, setIsSelecting] = useState(false);// open select function
    const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());//select photo to download

    //clicke photo to see big photo
    const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const [previewIndex, setPreviewIndex] = useState<number>(0);

    const { token } = useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);
    // Take user from KeycloakClient and if token exist take into roles
    useEffect(() => {
        const fetchRoles = async () => {
            const userInfo = await KeycloakClient.extractUserInfo(token);
            setRoles(userInfo?.roles || []);
            console.log(userInfo?.roles);
        };
        if (token !== null && token !== undefined) {
            fetchRoles();
        }
    }, [token]);


    // photo from DB laden and username as uploder change
    useEffect(() => {
        if (!selectedAddress) return;

        const fetchPhoto = async (address: string) => {
            setLoading(true);
            setError(null);
            console.log("address:", address);

            const url = "http://127.0.0.1:8000/photos/get_photo_list"
            try {
                const response = await axios.get(url, {params: {address: address}});
                const data = response.data;
                console.log(data);

                const formattedPhotos: Photo[] = data.map((item: any) => ({
                    id:item.photo_id,
                    src: item.image_url,
                    title: item.title,
                    uploader_id:item.user_id,
                    uploader: item.username,
                    uploadTime: formatTime(item.upload_time),
                    canLike:item.canLike,
                }));

                setPhotos(formattedPhotos);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }
        fetchPhoto(selectedAddress)
    }, [selectedAddress]);

    // order method change
    useEffect(() => {
        const toggleSortOrder = (selectOrder: string) => {
            let order = 'tasc';
            switch (selectOrder) {
                case "Time Asc" :
                    order = 'tasc';
                    break;
                case "Time Desc":
                    order = 'tdesc';
                    break;
                case "Name Asc" :
                    order = 'nasc';
                    break;
                case "Name Desc":
                    order = 'ndesc';
                    break;
            }
            return order;
        }
        //follow time/upload Name Desc(Z-A)/Asc(A-Z) Order Photos
        const orderPhoto = (order: string) => {
            return [...photos].sort((a, b) => {
                const timeA = new Date(a.uploadTime).getTime();
                const timeB = new Date(b.uploadTime).getTime();
                const nameA = a.uploader.toLowerCase();
                const nameB = b.uploader.toLowerCase();
                console.log("NameA:",nameA);
                console.log("NameB:",nameB);

                switch (order) {
                    case 'tasc':
                        return timeA - timeB;
                    case 'tdesc':
                        return timeB - timeA;
                    case 'nasc' :
                        return nameA.localeCompare(nameB);
                    case 'ndesc':
                        return nameB.localeCompare(nameA);
                    default:
                        return 0;
                }

            });
        }
        const sort = toggleSortOrder(selectOrder);
        setSortedPhotos(orderPhoto(sort));
    }, [selectOrder, photos]);

    // select photos then download
    const toggleSelect = (photoId: string) => {
        setSelectedPhotoIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(photoId)) {
                newSet.delete(photoId);
            } else {
                newSet.add(photoId);
            }
            return newSet;
        });
    };

    // download selected photo,single Photo will be direct download, more will as Zip download
    const handleDownloadSelected = async () => {
        //const selectedPhotos = sortedPhotos.filter(p => selectedPhotoIds.has(p.id));
        if (roles.includes("admin")){
            const selectedPhotosIds = Array.from(selectedPhotoIds);
            let url = "";
            let link = document.createElement("a");
            try {
                let blob: Blob;
                let filename: string;
                if (selectedPhotosIds.length === 1) {
                    const response = await (await axios.get(
                        `http://localhost:8000/photos/download_photo/${selectedPhotosIds[0]}`,
                        {
                            responseType: 'blob',
                        }));
                    blob = response.data
                    filename = `${'download'}.jpg`;

                } else {
                    const response = await axios.post(
                        `http://127.0.0.1:8000/photos/download_zip`, selectedPhotosIds,
                        {
                            responseType: "blob"
                        }
                    );
                    blob = new Blob([response.data], {type: "application/zip"});
                    filename = "photos.zip";
                }

                url = URL.createObjectURL(blob);
                link = document.createElement("a");
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error: any) {
                console.error("Download ZIP failed", error);
                setError("Failed to download photos as ZIP.");
            }
        }
    };

    //come to prev Photo
    const handlePreview =(photo:Photo)=>{
        const index = sortedPhotos.findIndex(p => p.id === photo.id);
        setPreviewIndex(index);
        setPreviewPhoto(photo);
        setPreviewOpen(true)
    }

    //come to next photo
    const handleNext=()=>{
        const nextIndex = (previewIndex+ 1) % sortedPhotos.length;
        setPreviewIndex(nextIndex);
        setPreviewPhoto(sortedPhotos[nextIndex]);
    }
    //come to last Photo
    const handlePrev = ()=>{
        const prevIndex = (previewIndex-1+sortedPhotos.length)% sortedPhotos.length;
        setPreviewIndex(prevIndex);
        setPreviewPhoto(sortedPhotos[prevIndex]);
    }
    // set all photos select / delete all selected Photos
    const handleAllSelect=()=>{
        if(selectedPhotoIds.size===sortedPhotos.length){
            setSelectedPhotoIds(new Set());
        }else{
            const allIds= new Set(sortedPhotos.map(p => p.id));
            setSelectedPhotoIds(allIds);
        }
    }

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

    return(
        <>
            <Dialog open={open}
                    onClose={handleDialogClose}
                    maxWidth={'lg'}
                    fullWidth
            >
                <DialogTitle sx={{backgroundColor: "#FAF6E9",padding:"1% 1% 0 1%"}}> Photos Under Adresse - {selectedAddress}</DialogTitle>
                <Box sx={{padding: 2,backgroundColor: "#FAF6E9",}}>
                    <Box sx={{display: "flex", mb: 1, alignItems: "center",margin:0}}>
                        <Typography variant="h5" sx={{}}>Photos Preview</Typography>
                        {/*Download button*/}
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center",marginLeft: "auto"}}>
                            {isSelecting && selectedPhotoIds.size > 0 && (
                                <Button
                                    onClick={handleDownloadSelected}
                                    variant="contained"
                                    color="success"
                                >
                                    Download ({selectedPhotoIds.size})
                                </Button>
                            )}
                            {/*Select Button*/}
                            {isSelecting && <Button
                                variant="contained"
                                color="info"
                                onClick={handleAllSelect}>Select All</Button>}
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIsSelecting(!isSelecting);
                                    setSelectedPhotoIds(new Set());
                                }}
                                color={isSelecting ? "error" : "primary"}
                                sx={{visibility: roles.includes("admin")? "visible":"hidden",}}
                            >
                                {isSelecting ? "Cancel" : "Select"}
                            </Button>
                            {/*Order Selector */}
                            <PhotoOrderSelector
                                setSelectOrder={setSelectOrder}
                                selectOrder={selectOrder}
                            />
                        </Box>
                    </Box>
                    {loading ? (
                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            <CircularProgress/>
                            <Typography>Loading photos...</Typography>
                        </Box>
                    ) : error ? (
                        <Typography color="error">Error: {error}</Typography>
                    ) : (
                        <ImageList variant="masonry" cols={3} gap={12} sx={{margin:"0.5% 0 0 0 "}}>
                        {sortedPhotos.map((photo, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={photo.src}
                                    alt={photo.title}
                                    loading="lazy"
                                    style={{
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        boxShadow:"0px 4px 12px rgba(0,0,0,0.2)",
                                    }}
                                    onClick={() => handlePreview(photo)}
                                />
                                <Box
                                    sx={{
                                        position: "relative",
                                        cursor: isSelecting ? "pointer" : "default"
                                    }}
                                    onClick={() => {
                                        if (isSelecting) toggleSelect(photo.id);
                                    }}
                                >
                                    <ImageListItemBar
                                        //title={photo.title}
                                        sx={{borderRadius:"5px"}}
                                        subtitle={
                                            `Upload User: ${photo.uploader} 
                                            | Upload Time: ${photo.uploadTime}`}
                                        actionIcon={
                                            isSelecting && (
                                                <Checkbox
                                                    checked={selectedPhotoIds.has(photo.id)}
                                                    onClick={(e) => e.stopPropagation()} // stop bubble,click checkbox will not  toggleSelect
                                                    onChange={() => toggleSelect(photo.id)}
                                                    sx={{ color: 'white',cursor: 'pointer'}}
                                                />
                                            )
                                        }
                                    />
                                </Box>
                            </ImageListItem>
                        ))}
                    </ImageList>)
                    }
                </Box>
            </Dialog>
            {/*click Photo can bigger Photo to see */}
            <PhotoCarousel
                open={previewOpen}
                photo={previewPhoto}
                onClose={()=>setPreviewOpen(false)}
                onPrev={handlePrev}
                onNext={handleNext}
                isSelecting={isSelecting}
                selectedPhotoIds={selectedPhotoIds}
                toggleSelect={toggleSelect}
            />
        </>
    )
}

export default PhotoViewDialog;