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


    useEffect(() => {
        if(!address) return;

        const fetchPhoto= async (address:string)=>{
            setLoading(true);
            setError(null);
            console.log("address:",address);

            const url="http://127.0.0.1:8000/photos/get_photo_list"
            try{
                const response = await axios.get(url, {params: {address: address}});
                const data=response.data;
                console.log(data);

                const formattedPhotos: Photo[] = data.map((item: any) => ({
                    src: item.image_url,
                    title: item.title,
                    uploader: item.user_id,
                    uploadTime: item.upload_time
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


    const handleOpen = (index: number) => {
        setSelectedPhotoIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPhotoIndex(null);
    };

    const handleOfDownload=(photo:Photo)=>{
        const link = document.createElement('a');
        link.href=photo.src;
        link.download=`${photo.title||"download"}.jpg`;
        link.click();
    }

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
            <Box >
                <CircularProgress size="3rem"/>
                <Typography>Loading photos...</Typography>
            </Box>
        );
    }

    if(error)return(<Alert variant="filled" severity="error">Error by Fetch Photo, Detail: {error}</Alert>)


    return (
        <>
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",   // 自动换行
                gap: 2,             // 块之间的间距，单位是 theme.spacing(2)
            }}
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
                <DialogTitle>Photo Detail</DialogTitle>
                <Box >
                    {selectedPhotoIndex !== null && (
                        <DialogContent sx={styles.dialogContainer}>
                            <Box
                                sx={styles.dialogFirstBox}
                            > {/* 图片区域 */}
                                <Box
                                    component="img"
                                    src={photos[selectedPhotoIndex].src}
                                    alt={photos[selectedPhotoIndex].title}
                                    sx={styles.dialogPhotoArea}
                                />

                                {/* 信息区域 */}
                                <Box sx={styles.dialogInfoArea}><Box sx={{mb: 2, textAlign: "left"}}>
                                    <Typography variant="h6">{photos[selectedPhotoIndex].title}</Typography>
                                    <Typography variant="body1">Upload
                                        Time: {photos[selectedPhotoIndex].uploadTime}</Typography>
                                    <Typography variant="body1">Upload
                                        User: {getUsername(photos[selectedPhotoIndex].uploader)}</Typography>
                                </Box>
                                    <Button variant="contained"
                                            sx={{alignSelf: "flex-start" }}
                                            onClick={()=>handleOfDownload(photos[selectedPhotoIndex])}
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
    dialogContainer:{
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
         minHeight: 500, // 增加对话框整体高度
         p: 2,
     },
     dialogPhotoArea:{
         width: "100%",
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
     photoModal:{
         position: 'absolute',
         top: '50%',
         left: '50%',
         transform: 'translate(-50%, -50%)',
         width: 400,
         bgcolor: 'background.paper',
         border: '2px solid #000',
         boxShadow: 24,
         p: 4,
     },

 }

const images = [
    {
        src: "/luisenplatz.jpg",
        title: "Luisenplatz",
        uploader: "John Doe",
        uploadTime: "2024-05-31 12:00",
    },
    {
        src: "/luisenplatz.jpg", // 可重复使用同一张图片测试
        title: "Luisenplatz 2",
        uploader: "Jane Smith",
        uploadTime: "2024-05-30 10:45",
    }
];

export default PhotoGrid;