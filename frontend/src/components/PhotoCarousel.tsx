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
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery, useTheme } from "@mui/material";

import styles from "./PhotoCarouselStyles";

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

    //Mobil-End
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md:  <900px

    const { user_id } = useAuthHook();
    const [error, setError] = useState<string | null>(null); // error
    if(!photo) return null;



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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth={!isMobile}
            PaperProps={{
                sx: isMobile ? styles.dialogMobilPopers : {}
            }}

        >
            <Box sx={styles.mainBox}>
                {!isMobile && (
                    <>
                        {/*link Arrow area*/}
                        <Box sx={styles.linkArrowArea} onClick={onPrev}>
                            <IconButton
                                onClick={onPrev}
                                sx={styles.linkArrorIcon}
                            >
                                <ArrowBackIos/>
                            </IconButton>
                        </Box>
                    </>)}

                {/*image and imageInfo Area*/}
                <Box sx={styles.photoAndInfoArea}>
                    <Box
                        sx={styles.photoArea}>
                        <img
                            src={photo?.src}
                            alt={photo?.title}
                            style={styles.image}
                        />
                    </Box>

                    {/* info Area：only in Desktop  */}
                    {!isMobile && (
                        <Box sx={{ textAlign: "left" }}>
                            <Typography variant="body2">Upload User: {photo?.uploader}</Typography>
                            <Typography variant="body2">Upload Time: {photo?.uploadTime}</Typography>
                            <Typography variant="body2">Favorite Number: {photo.likeCount}</Typography>
                            <Button
                                startIcon={<FavoriteBorder sx={{ color: photo.is_like ? "red" : "gray" }} />}
                                onClick={() => handleLikeToggle(photo)}
                                sx={{ visibility: photo.canLike ? "visible" : "hidden" }}
                            >
                                {photo.is_like ? "Dislike" : "Favorite"}
                            </Button>
                            {isSelecting && photo && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPhotoIds.has(photo.id)}
                                            onChange={() => toggleSelect(photo.id)}
                                        />
                                    }
                                    label="Select to download"
                                />
                            )}
                        </Box>
                    )}

                    {/* Close Icon*/}
                    <IconButton
                        sx={styles.closeIcon}
                        onClick={onClose}

                        autoFocus
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                {/*right Arrow area*/}
                {!isMobile && (<Box sx={styles.rightArrowArea} onClick={onNext}>
                    <IconButton
                        onClick={onNext}
                        sx={styles.rightArrow}
                        autoFocus
                        tabIndex={-1}
                    >
                        <ArrowForwardIos/>
                    </IconButton>
                </Box>)}
            </Box>
        </Dialog>)

}

export default  PhotoCarousel;