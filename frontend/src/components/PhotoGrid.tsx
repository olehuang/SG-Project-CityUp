import React, {useEffect, useState} from "react";
import { Box, Typography,Dialog, DialogTitle, DialogContent} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';

interface PhotoGridProps {
    address: string;
}

const PhotoGrid:React.FC<PhotoGridProps> = ({address}) => {
    const [photos, setPhotos] = useState<string[]>([]);//backend return photo list
    const [loading, setLoading] = useState(false); //loding photo
    const [error, setError] = useState<string | null>(null); // error
    const [open,setOpen]=useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);


    useEffect(() => {
        if(!address) return;

        const fetchPhoto= async (address:string)=>{
            setLoading(true);
            setError(null)
            try{

            }catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }

        }
    }, [address]);

    const handleOpen = (index: number) => {
        setSelectedPhotoIndex(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPhotoIndex(null);
    };

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
            {[...Array(10)].map((_, index) => (
                <Box
                    key={index}
                    sx={styles.photoBox}
                    onClick={() => handleOpen(index)}
                >
                    <Typography>Photo {index + 1}</Typography>
                </Box>
            ))}
        </Box>

            {/* Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Photo Detail</DialogTitle>
                <DialogContent>
                    {selectedPhotoIndex !== null && (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                            <Typography variant="h6">
                                This is photo {selectedPhotoIndex + 1}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
 }
 const styles={
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

export default PhotoGrid;