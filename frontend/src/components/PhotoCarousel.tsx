import React, {useState} from "react";
import {
    Box,
    Dialog,
    Typography,
    IconButton,
    FormControlLabel,
    Checkbox, Button,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import {useAuthHook} from "./AuthProvider";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/Favorite";



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

interface PhotoPreviewDialogProps {
    open: boolean;
    photo: Photo | null;
    setPhoto:(photo:any)=>any;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    isSelecting: boolean;
    selectedPhotoIds: Set<string>;
    toggleSelect: (photoId: string) => void;
}


const PhotoCarousel:React.FC<PhotoPreviewDialogProps>=({
                                                           open,
                                                           photo,
                                                           setPhoto,
                                                           onClose,
                                                           onPrev,
                                                           onNext,
                                                           isSelecting,
                                                           selectedPhotoIds,
                                                           toggleSelect}) => {

    const { user_id } = useAuthHook();
    const [error, setError] = useState<string | null>(null); // error
    if(!photo) return null;

    //click Favourite Icon toggle like and dislike
    const handleLikeToggle =async (photo:Photo)=>{
        if(!photo) return;
        const baseUrl = "http://localhost:8000/users";
        try{
            console.log("islike:",photo.is_like)
            const likeUrl = photo.is_like ?  baseUrl+"/dislike":baseUrl+"/like";
            await axios.post(likeUrl,{},{
                params:{photo_id:photo.id,user_id:user_id}
            })
            //update photo
            setPhoto((prevPhoto:any) =>
                prevPhoto.map((p:any) =>
                    p.id === photo.id ? { ...p, is_like: !photo.is_like } : p
                )
            );

        }catch (err: any) {
            setError(err.message || "Unknown error in PhotoCarousel");
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <Box sx={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FAF6E9",
            }}>
                {/*<DialogTitle>{previewPhoto?.title}</DialogTitle>*/}
                {/*link Arrow area*/}
                <Box sx={styles.linkArrowArea} onClick={onPrev}>
                    <IconButton
                        onClick={onPrev}
                        sx={{
                            position: "absolute",
                            left: 0, top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 10
                        }}
                    >
                        <ArrowBackIos/>
                    </IconButton>
                </Box>
                {/*image and imageInfo Area*/}
                <Box sx={styles.photoAndInfoArea}>
                    <Box sx={{
                        textAlign: "center", //justifyContent: "center",
                        paddingLeft: "2%", marginTop: "1%"
                    }}>
                        <img
                            src={photo?.src}
                            alt={photo?.title}
                            style={{
                                maxWidth: "90%",
                                maxHeight: "80vh",
                                borderRadius: 8,
                                boxShadow:"0px 4px 12px rgba(0,0,0,0.2)"
                            }}
                        />
                    </Box>
                    <Box sx={{textAlign:"left"}}>
                        <Typography variant="body2" sx={{}}>
                            Upload User:  {photo?.uploader}
                        </Typography>
                        <Typography variant="body2" sx={{}}>
                            Upload User id:  {photo?.uploader_id}
                        </Typography>
                        <Typography variant="body2" sx={{}}>
                            Uploadtime : {photo?.uploadTime}
                        </Typography>
                        {/*Favorite Button in top right corner*/}
                        <Button startIcon={<FavoriteBorder
                            sx={{color: photo.is_like ? "red": "gray"}} />}
                                onClick={()=>handleLikeToggle(photo)}
                                sx={{visibility: photo.canLike ?  "visible" : "hidden"}}
                        > {photo.is_like ?   "Dislike":"Favorite"}</Button>
                        {isSelecting && photo && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedPhotoIds.has(photo.id)}
                                        onChange={() => {
                                            toggleSelect(photo.id);
                                        }}
                                    />
                                }
                                label="Select to download"
                            />
                        )}
                    </Box>
                </Box>
                {/*right Arrow area*/}
                <Box sx={styles.rightArrowArea} onClick={onNext}>
                    <IconButton
                        onClick={onNext}
                        sx={{
                            position: "absolute",
                            right: 10, top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 10
                        }}
                    >
                        <ArrowForwardIos/>
                    </IconButton>
                </Box>
            </Box>
        </Dialog>)

}


const styles={
    linkArrowArea:{
        position:"absolute",
        left:0,top:0,bottom:0,
        width:"5%",display:"flex",
        alignItems:"center",
        //border:"1px solid black",
        justifyContent:"flex-start",
        cursor:"pointer",
        zIndex:10,
        "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" }
    },
    photoAndInfoArea:{
        flex: 1,
        overflow: "hidden",
        maxWidth: "100%",
        maxHeight:"100",
        display: "flex",
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "center",
        textAlign:"center",
        //border:"1px solid black",
    },
    rightArrowArea:{
        position:"absolute",
        right:0,top:0,bottom:0,
        width:"5%",display:"flex",
        justifyContent:"flex-end",
        cursor:"pointer",
        zIndex:10,
       // border:"1px solid black",
        "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" }
    }
}
export default  PhotoCarousel;