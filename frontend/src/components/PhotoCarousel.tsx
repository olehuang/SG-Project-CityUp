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
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <Box sx={{
                position: "relative",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#e3f2fd",
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
                                borderRadius: 8
                            }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{}}>
                            Upload User:  {photo?.uploader}
                        </Typography>
                        <Typography variant="body2" sx={{}}>
                            Uploadtime : {new Intl.DateTimeFormat("de-DE",{
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: "Europe/Berlin"}).format(new Date(photo?.uploadTime))}
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