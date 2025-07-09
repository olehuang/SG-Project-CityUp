import React from "react";
import {
    Box,
    Dialog,
    Typography,
    IconButton,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";;

interface Photo {
    id: string;
    src: string;
    title: string;
    uploader: string;
    uploadTime: string;
}

interface PhotoPreviewDialogProps {
    open: boolean;
    photo: Photo | null;
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
                                                           onClose,
                                                           onPrev,
                                                           onNext,
                                                           isSelecting,
                                                           selectedPhotoIds,
                                                           toggleSelect}) => {

    if(!photo) return null;
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
                                width: "100%",
                                maxWidth: "700px",
                                maxHeight: "80vh",
                                objectFit: "contain",
                                borderRadius: 8,
                                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)"
                            }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{}}>
                            Upload User:  {photo?.uploader}
                        </Typography>
                        <Typography variant="body2" sx={{}}>
                            Uploadtime : {photo?.uploadTime}
                        </Typography>
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
        width:"5%",
        display:"flex",
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
        "@media (max-width: 768px)": {
            flexDirection: "column",
            padding: "16px",
            gap: "16px",
        }
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