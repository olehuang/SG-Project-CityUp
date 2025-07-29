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
import {useAuthHook} from "./AuthProvider";
import KeycloakClient from "./keycloak";
import useMediaQuery from "@mui/material/useMediaQuery";

import Photo  from "./PhotoGrid"
import FavoriteBorder from "@mui/icons-material/Favorite";
import Favorite from "@mui/icons-material/Favorite";
import CloseIcon from '@mui/icons-material/Close';


interface Props {
    viewAddress: string|null;
    open: boolean;
    handleDialogClose: () => void;

}

export interface Photo {
    id: string;
    src: string;
    title: string;
    uploader_id:string;
    uploader: string;
    uploadTime: string;
    canLike:boolean;
    is_like:boolean;
    likeCount:string;
}
const PhotoViewDialog:React.FC<Props>=({viewAddress,open,handleDialogClose})=>{


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

    const { token,user_id } = useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);
    const isMobile = useMediaQuery("(max-width:768px)");

    // Take user from KeycloakClient and if token exist take into roles
    useEffect(() => {
        const fetchRoles = async () => {
            const userInfo = await KeycloakClient.extractUserInfo(token);
            setRoles(userInfo?.roles || []);
        };
        if (token !== null && token !== undefined) {
            fetchRoles();
        }
    }, [token]);


    // photo from DB laden and username as uploder change
    useEffect(() => {

        if (!viewAddress) return;
        fetchPhoto(viewAddress)

    }, [viewAddress]);

    useEffect(() => {
        if (!open || !viewAddress){
            setIsSelecting(false)
            setSelectedPhotoIds(new Set())
        }
    }, [open,viewAddress]);


    const fetchPhoto = async (address: string) => {
        setLoading(true);
        setError(null);


        const url = "http://127.0.0.1:8000/photos/get_photo_list"
        try {
            const response = await axios.get(url, {params: {address: address,user_id:user_id}});
            const data = response.data;

            const formattedPhotos: Photo[] = data.map((item: any) => ({
                id:item.photo_id,
                src: item.image_url,
                title: item.title,
                uploader_id:item.user_id,
                uploader: item.username,
                uploadTime: formatTime(item.upload_time),
                canLike:item.canLike,
                is_like:item.is_like,
                likeCount:item.likeCount,
            }));

            setPhotos(formattedPhotos);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

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
                case "Like Asc" :
                    order = 'lkasc';
                    break;
                case "Like Desc":
                    order = 'lkdesc';
                    break;
            }
            return order;
        }


        //follow time/upload Name Desc(Z-A)/Asc(A-Z) Order Photos
        const orderPhoto = (order: string) => {
            return [...photos].sort((a, b) => {
                const timeA =  new Date(a.uploadTime.replace(',', ''));
                const timeB = new Date(b.uploadTime.replace(',', ''));
                const nameA = a.uploader.toLowerCase();
                const nameB = b.uploader.toLowerCase();
                const likeA = +a.likeCount;
                const likeB = +b.likeCount;

                switch (order) {
                    case 'tasc':
                        return timeA.getTime() - timeB.getTime();
                    case 'tdesc':
                        return timeB.getTime() - timeA.getTime();
                    case 'nasc' :
                        return nameA.localeCompare(nameB);
                    case 'ndesc':
                        return nameB.localeCompare(nameA);
                    case 'lkasc':
                        return likeB - likeA;//most Favorite first
                    case 'lkdesc':
                        return likeA - likeB;//least Favorite first
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
    const downloadPhotos = ()=>{
        const selectedPhotosIds = Array.from(selectedPhotoIds);
        if (selectedPhotosIds.length===0){setError("muss choose minimal one Photos");}

        let url = "";
        try{
            if (selectedPhotosIds.length === 1) {
                url = `http://localhost:8000/photos/download_photo/${selectedPhotosIds[0]}`
            } else if (selectedPhotosIds.length > 1) {
                const query = new URLSearchParams();
                selectedPhotosIds.forEach(id => query.append("photo_ids", id))
                url = `http://localhost:8000/photos/download_zip?${query.toString()}`;
            }
            const a = document.createElement("a");
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }catch (error: any) {
            setError("Failed to download photo.");
        }
    }

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

    //click Favourite Icon toggle like and dislike
    const handleLikeToggle =async (photo:Photo)=>{
        if(!photo) return;
        const baseUrl = "http://localhost:8000/users";
        try{

            const likeUrl = photo.is_like ?  baseUrl+"/dislike":baseUrl+"/like";
            await axios.post(likeUrl,{},{
                params:{photo_id:photo.id,user_id:user_id}
            })
            //update photo
            setSortedPhotos((prevPhotos) =>
                prevPhotos.map((p) =>
                    p.id === photo.id ? { ...p, is_like: !photo.is_like } : p
                )
            );

        }catch (err: any) {
            setError(err.message || "Unknown error in like Toggle");
        }
    }

    return(
        <>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                maxWidth={isMobile ? "xs" : "lg"} //
                fullScreen={isMobile} //
                fullWidth
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#FAF6E9",
                        padding: "1% 1% 0 1%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    Photos Under Adresse - {viewAddress}
                    <IconButton sx={{ marginLeft: "auto" }} onClick={handleDialogClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Box
                    sx={{
                        padding: { xs: 1, sm: 2, md: "1% 1% 0 1%" },
                        backgroundColor: "#FAF6E9",
                        fontSize: { xs: 14, sm: 16, md: 18 },
                    }}
                >
                    <Box sx={{ display: "flex", mb: 1, alignItems: "center", margin: 0 }}>
                        <Typography variant="h5">Photos Preview</Typography>
                        {/*Download button*/}
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, //
                             gap: 2, alignItems: "center",margin: 0, width: "100%", flexWrap: "wrap",}}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center",marginLeft: "auto"}}>

                            {isSelecting && selectedPhotoIds.size > 0 && (
                                <Button
                                    onClick={downloadPhotos}
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
                    </Box>
                    {loading ? (
                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            <CircularProgress/>
                            <Typography>Loading photos...</Typography>
                        </Box>
                    ) : error ? (
                        <Typography color="error">Error: {error}</Typography>
                    ) : (
                        <ImageList variant="masonry" cols={isMobile ? 1 : 3} gap={12} sx={{margin:"0.5% 0 0 0 "}}>
                        {sortedPhotos.map((photo, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={photo.src}
                                    alt={photo.title}
                                    loading="lazy"
                                    style={{
                                        width: "100%", // new
                                        maxWidth: isMobile ? "100%" : "100%",   //new
                                        height: "auto", //new
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        boxShadow:"0px 4px 12px rgba(0,0,0,0.2)",
                                        objectFit: "contain",
                                    }}
                                    onClick={() => handlePreview(photo)}
                                />
                                {/*Favorite Button in top right corner*/}
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeToggle(photo)
                                    }}
                                    sx={{
                                        position: "absolute",
                                        top: "1%", right: "1%",
                                        backgroundColor: "rgba(255,255,255,0.8)",
                                        '&:hover': {
                                            backgroundColor: "rgba(255,255,255,0.9)",
                                        },
                                        zIndex: 2,
                                        visibility: photo.canLike ? "visible" : "hidden"
                                    }}
                                >{photo.is_like ? <Favorite sx={{color: "red"}} /> : <FavoriteBorder />}
                                </IconButton>
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
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontSize: { xs: 10, sm: 12, md: 13 },//
                                                    lineHeight: 1.3, //
                                                    wordBreak: "break-word"
                                                }}
                                            >
                                                Upload User: {photo.uploader} | Upload Time:{" "}
                                                {photo.uploadTime}
                                            </Typography>
                                        }

                                        actionIcon={
                                            <Box>
                                                <Checkbox
                                                    checked={selectedPhotoIds.has(photo.id)}
                                                    onClick={(e) => e.stopPropagation()} // stop bubble,click checkbox will not  toggleSelect
                                                    onChange={() => toggleSelect(photo.id)}
                                                    sx={{
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        visibility: isSelecting ? "visible" : "hidden",
                                                    }}
                                                />
                                        </Box>
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
                setPhoto={setPreviewPhoto}
            />
        </>
    )
}

export default PhotoViewDialog;