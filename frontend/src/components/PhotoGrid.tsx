import React, {useEffect, useState} from "react";
import {Box, Typography, Dialog, DialogTitle, DialogContent, Button, IconButton} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import {useAuthHook} from "./AuthProvider";
import KeycloakClient from "./keycloak";
import FavoriteBorder from '@mui/icons-material/Favorite';
import CloseIcon from "@mui/icons-material/Close";
import {useTranslation} from "react-i18next";

interface PhotoGridProps {
    address: string;
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

const PhotoGrid:React.FC<PhotoGridProps> = ({address}) => {
    const [photos, setPhotos] = useState<Photo[]>([]);//backend return photo list
    const [loading, setLoading] = useState(false); //loding photo
    const [error, setError] = useState<string | null>(null); // error
    const [open,setOpen]=useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);


    const { token,user_id } = useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);


    const { t } = useTranslation();//double language

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

    //get first 9 photo form DB follow Uploadtime
    useEffect(() => {
        if(!address) return;
        fetchPhoto(address)
    }, [address]);

    // from backend take photos
    const fetchPhoto= async (address:string)=>{
        setLoading(true);
        setError(null);


        const url="http://127.0.0.1:8000/photos/get_first_9_photo"
        try{
            const response = await axios.get(url, {params: {address: address,user_id:user_id}});
            const data=response.data;


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
                }
            ));

            setPhotos(formattedPhotos);
        }catch (err: any) {
            setError(err.message || "Unknown error in fetchPhoto");
        } finally {
            setLoading(false);
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
                setError(error+"in PhotoGrid formatTime")
                formattedTime = "Invalid Date";
            }finally {
                return formattedTime;
            }
        }

    }

    //open dialog to see Photo detail
    const handleOpen = (index: number) => {
        setSelectedPhotoIndex(index);
        setOpen(true);
    };
    //close Dialog
    const handleClose = () => {
        setOpen(false);
    };

    //close Dialog
    const handleDialogClose = () => {
        setOpen(false);

    };
    const downloadURL = "http://localhost:8000/photos/download_photo/"
    //download photo which one in Dialog see
    const handleOfDownload=async (photo:Photo)=>{
        if(roles.includes("admin")){
            try {
                const response = await (await axios.get(
                    `http://localhost:8000/photos/download_photo/${photo.id}`,
                    {
                        responseType: 'blob',
                    }));
                const url = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${photo.title || 'download'}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (e: any) {
                setError(e.message || "Unknown error in Download");
            }
        }
    }

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',            //  Flexbox
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress size="3rem"/>
                <Typography>{t("photoGallery.loading")}</Typography>
            </Box>
        );
    }

    if(error)return(<Alert variant="filled" severity="error">{t("photoGallery.alertFetchPhoto")} {error}</Alert>)

    if (!photos || !Array.isArray(photos)) {
        return <Typography color="error">{t("photoGallery.errorFetchPhoto")}</Typography>;
    }

    const handleLikeToggle =async (photo:Photo)=>{
        if(!photo) return;
        const baseUrl = "http://localhost:8000/users";
        try{

            const likeUrl = photo.is_like ?  baseUrl+"/dislike":baseUrl+"/like";
            await axios.post(likeUrl,{},{
                params:{photo_id:photo.id,user_id:user_id}
            })
            //update photo
            setPhotos((prevPhotos) =>
                prevPhotos.map((p) =>
                    p.id === photo.id ? { ...p, is_like: !photo.is_like } : p
                )
            );

        }catch (err: any) {
            setError(err.message || "Unknown error in like Toggle");
        }
    }

    const delete_photo= async (photo:Photo)=>{
        const baseUrl = "http://localhost:8000/photos/delete_photo";
        const confirmText = prompt("Please type \"delete\" to confirm deletion of the photo:");
        if (confirmText !== "delete") {
            alert("Delete operation canceled。");
            return;
        }
        try{
            await axios.post(baseUrl,{},{params:{photo_id:photo.id,user_id:user_id}})
            setOpen(false);
            setSelectedPhotoIndex(null);

            window.location.reload();
        }catch (err: any) {
            console.log(err)
        }
    }

    return (
        <>
            <Box
                sx={styles.photoGridroot}
            >
                {photos.map((photo, index) => (
                    <Box
                        key={index}
                        sx={styles.photoBox}
                        onClick={() => handleOpen(index)}
                    >
                        <Box
                            component="img"
                            src={photo.src}
                            alt={photo.title}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 1
                            }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Dialog */}
            <Dialog open={open}
                    onClose={handleClose}
                    maxWidth={'lg'}

            >
                <DialogTitle
                    sx={{
                    backgroundColor: "#FAF6E9",
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    }}
                >{t("photoGallery.photoDetailTitle")}
                    <IconButton sx={{marginLeft:"auto"}}
                                onClick={handleDialogClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Box>
                    {selectedPhotoIndex !== null && (
                        <DialogContent sx={styles.dialogContainer}>
                            <Box
                                sx={styles.dialogFirstBox}
                            > {/* 9 Photos  Area */}
                                <Box
                                    component="img"
                                    src={photos[selectedPhotoIndex].src}
                                    alt={photos[selectedPhotoIndex].title}
                                    sx={styles.dialogPhotoArea}
                                />

                                {/* Photo infomation Area */}
                                <Box sx={styles.dialogInfoArea}><Box sx={{mb: 2, textAlign: "left"}}>
                                    <Typography variant="h6">{photos[selectedPhotoIndex].title}</Typography>
                                    <Typography variant="body1">
                                        {t("photoGallery.photoDetails.uploadTime")}: {photos[selectedPhotoIndex].uploadTime}</Typography>
                                    <Typography variant="body1">
                                        {t("photoGallery.photoDetails.uploadUser")}: {photos[selectedPhotoIndex].uploader}</Typography>
                                    <Typography variant="body1">
                                        {t("photoGallery.photoDetails.favoriteNr")}: {photos[selectedPhotoIndex].likeCount}</Typography>

                                </Box>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection:"row",
                                        justifyContent: "space-between",
                                        alignItems:"center"
                                    }}>
                                        {photos[selectedPhotoIndex].canLike && <Button startIcon={<FavoriteBorder
                                            sx={{color: photos[selectedPhotoIndex].is_like ? "red" : "gray"}}/>}
                                                 onClick={() => handleLikeToggle(photos[selectedPhotoIndex])}
                                                 sx={{visibility: photos[selectedPhotoIndex].canLike ? "visible" : "hidden"}}
                                        > {photos[selectedPhotoIndex].is_like ? t("photoGallery.dislikeButton")
                                            : t("photoGallery.favoriteButton")}</Button>}
                                        <Button
                                            variant="outlined"
                                            color={"error"}
                                            sx={{
                                                justifyContent: "end", alignItems: "center",
                                                visibility: photos[selectedPhotoIndex].uploader_id === user_id ? "visible" : "hidden",
                                            }}
                                            onClick={()=> {
                                                delete_photo(photos[selectedPhotoIndex])
                                            }}
                                            startIcon={<DeleteIcon />}>
                                            Delete
                                        </Button>
                                        <a href={downloadURL+`${photos[selectedPhotoIndex].id}`}
                                           download
                                           style={{textDecoration: "none"}}
                                        >
                                            <Button variant="contained"
                                                    sx={{
                                                        alignSelf: "flex-start",
                                                        visibility: roles.includes("admin") ? "visible" : "hidden",
                                                    }}
                                                //onClick={() => handleOfDownload(photos[selectedPhotoIndex])}
                                            >
                                                {t("photoGallery.downloadButton")}
                                            </Button></a>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                    )}
                </Box>
            </Dialog>
        </>
    )
 }
 const styles={
    photoGridroot:{
        display: "flex",
        flexWrap: "wrap",   // automatic change row
        gap: 2,             // space between photo
        minWidth:"95%",
        minHeight:"100%",
        margin:"0 0 0 2%",

    },
    dialogContainer:{
        backgroundColor: "#FAF6E9",
        padding:"0 0 1% 0 ",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 4,

        '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'center'
        }
    },
     dialogFirstBox:{
         display: "flex",
         flexDirection: "row",
         alignItems: "flex-start",
         gap: 2,
         minHeight: 500, //
         p: 2,
         paddingBottom:0,

         '@media (max-width: 768px)': {
             flexDirection: 'column',
             minHeight: 'auto',
             width: '100%',
             alignItems: 'center'
         }
     },
     dialogPhotoArea:{
         width: "90%",
         maxWidth: "800px",
         height: "auto",
         maxHeight: 500,
         objectFit: "contain",
         borderRadius: 2,
         //border: "1px solid black",
         boxShadow:"0px 4px 12px rgba(0,0,0,0.1)",

         '@media (max-width: 768px)': {
             width: '100%',
             maxWidth: '100%',
             height: 'auto',
             maxHeight: '400px'
         }

     },
     dialogInfoArea:{
         width: "100%",
         display: "flex",
         flexDirection: "column",
         textAlign: "left",
         justifyContent: "space-between",

         '@media (max-width: 768px)': {
             alignItems: 'center',
             textAlign: 'center',
             mt: 2
         }
     },
    photoBox:{
        flex: '0 0 30%',
        //maxWidth: 'calc(33.333% - 16px)',
        aspectRatio: '3 / 4',
        backgroundColor: '#fff',
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: '#e0f7fa',
            borderColor: '#128d9e'
        },
        '&:active': {
            transform: 'scale(0.98)',
            backgroundColor: '#b2ebf2'
        },
        '@media (max-width: 768px)': {
            flex: '0 0 calc(50% - 12px)',
            maxWidth: 'calc(50% - 12px)'
        },
        '@media (max-width: 480px)': {
            flex: '0 0 100%',
            maxWidth: '100%'
        }
    },

 }

export default PhotoGrid;