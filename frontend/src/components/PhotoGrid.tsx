import React, {useEffect, useState} from "react";
import {Box, Typography, Dialog, DialogTitle, DialogContent, Button} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import axios from "axios";

interface PhotoGridProps {
    address: string;
}
interface Photo {
    id: string;
    src: string;
    title: string;
    uploader: string;
    uploadTime: string;
}

const PhotoGrid:React.FC<PhotoGridProps> = ({address}) => {
    const [photos, setPhotos] = useState<Photo[]>([]);//backend return photo list
    const [loading, setLoading] = useState(false); //loding photo
    const [error, setError] = useState<string | null>(null); // error
    const [open,setOpen]=useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    //get first 9 photo form DB follow Uploadtime
    useEffect(() => {
        if(!address) return;

        const fetchPhoto= async (address:string)=>{
            setLoading(true);
            setError(null);
            console.log("address:",address);

            const url="http://127.0.0.1:8000/photos/get_first_9_photo"
            try{
                const response = await axios.get(url, {params: {address: address}});
                const data=response.data;
                console.log(data);

                const formattedPhotos: Photo[] = data.map((item: any) => ({
                    id:item.photo_id,
                    src: item.image_url,
                    title: item.title,
                    uploader: item.user_id,
                    uploadTime: new Intl.DateTimeFormat("de-DE",{
                        dateStyle: "medium",
                        timeStyle: "medium",
                        timeZone: "Europe/Berlin"}).format(new Date(item.upload_time))
                }));
                setPhotos(formattedPhotos);
            }catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }

        }
        fetchPhoto(address)
    }, [address]);

    //open dialog to see Photo detail
    const handleOpen = (index: number) => {
        setSelectedPhotoIndex(index);
        setOpen(true);
    };
    //close Dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedPhotoIndex(null);
    };
    //download photo which one in Dialog see
    const handleOfDownload=async (photo:Photo)=>{
        try{
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
        }catch (e:any) {
            setError(e.message || "Unknown error");
        }
    }
    //show upload user name
    const getUsername=async (user_id:string)=>{
        try{
            const response= await axios.get(`http://127.0.0.1:8000/users/get_user_name`, {params: {user_id:user_id}});
            return response.data;
        }catch (e:any) {
            setError(e.message || "Unknown error");
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
                <Typography>Loading photos...</Typography>
            </Box>
        );
    }

    if(error)return(<Alert variant="filled" severity="error">Error by Fetch Photo, Detail: {error}</Alert>)

    if (!photos || !Array.isArray(photos)) {
        return <Typography color="error">Error loading photos.</Typography>;
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
                    sx={{}}
            >
                <DialogTitle sx={{backgroundColor: "#FAF6E9",}}>Photo Detail</DialogTitle>
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
                                    <Typography variant="body1">Upload
                                        Time: {photos[selectedPhotoIndex].uploadTime}</Typography>
                                    <Typography variant="body1">Upload
                                        User: {getUsername(photos[selectedPhotoIndex].uploader)}</Typography>
                                </Box>
                                    <Button variant="contained"
                                            sx={{alignSelf: "flex-start"}}
                                            onClick={() => handleOfDownload(photos[selectedPhotoIndex])}
                                    >
                                        Download
                                    </Button>
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
        gap: 4
    },
     dialogFirstBox:{
         display: "flex",
         flexDirection: "row",
         alignItems: "flex-start",
         gap: 2,
         minHeight: 500, //
         p: 2,
         paddingBottom:0,
     },
     dialogPhotoArea:{
         width: "90%",
         maxWidth: "800px",
         height: "auto",
         maxHeight: 500,
         objectFit: "contain",
         borderRadius: 2,
         border: "1px solid black",
     },
     dialogInfoArea:{
         width: "100%",
         display: "flex",
         flexDirection: "column",
         textAlign: "left",
         justifyContent: "space-between",
     },
    photoBox:{
        flex: "0 0 30%",                  // width 1/3 - space（gap*2）
        aspectRatio: "3 / 4",               // （width:height = 3:4）
        backgroundColor: "#fff",
        borderRadius: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover()":{
            backgroundColor: "#e0f7fa",
            borderColor: "#128d9e",
        },
        "&:active": {
            transform: "scale(0.98)",
            backgroundColor: "#b2ebf2",
        },
    },

 }

export default PhotoGrid;