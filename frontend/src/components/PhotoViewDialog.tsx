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
import qs from "qs"



interface Props {
    selectedAddress: string|null;
    open: boolean;
    handleDialogClose: () => void;
}

interface Photo {
    id: string;
    src: string;
    title: string;
    uploader: string;
    uploadTime: string;
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
                    src: item.image_url,
                    title: item.title,
                    uploader: item.user_id,
                    uploadTime: item.upload_time
                }));

                const userIds: string[] = Array.from(new Set(data.map((p: any) => p.user_id)));
                const userMap: Record<string, string> = {};

                for (const userId of userIds) {
                    try {
                        const res = await axios.get("http://127.0.0.1:8000/users/get_user_name", {
                            params: {user_id: userId},
                        });
                        userMap[userId] = res.data;
                    } catch (e) {
                        console.error(`Failed to fetch username for ${userId}`, e);
                        userMap[userId] = "Unknown";
                    }
                }
                const updatedPhotos = formattedPhotos.map(p => ({
                    ...p,
                    id: p.src,
                    uploader: userMap[p.uploader] ?? "Unknown"
                }));
                setPhotos(updatedPhotos);
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

        const orderPhoto = (order: string) => {
            return [...photos].sort((a, b) => {
                const timeA = new Date(a.uploadTime).getTime();
                const timeB = new Date(b.uploadTime).getTime();
                const nameA = a.uploader
                const nameB = b.uploader

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

    // download selceted photo
    const handleDownloadSelected = async () => {
        const selectedPhotos = sortedPhotos.filter(p => selectedPhotoIds.has(p.id));

        for (const photo of selectedPhotos) {
            const link = document.createElement("a");
            link.href = photo.src;
            link.download = photo.title || "photo.jpg"; //
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handlePreview =(photo:Photo)=>{
        setPreviewPhoto(photo);
        setPreviewOpen(true)
    }

    return(
        <>
            <Dialog open={open}
                    onClose={handleDialogClose}
                    maxWidth={'lg'}
                    fullWidth
            >
                <DialogTitle> Photos Under Adresse - {selectedAddress}</DialogTitle>
                <Box sx={{padding: 2}}>
                    <Box sx={{
                        display: "flex",
                        mb: 2, alignItems: "center"}}>
                        <Typography variant="h5">Photos Preview</Typography>
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

                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIsSelecting(!isSelecting);
                                    setSelectedPhotoIds(new Set());
                                }}
                                color={isSelecting ? "error" : "primary"}
                            >
                                {isSelecting ? "Cancel" : "Select"}
                            </Button>

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
                    ) : (<ImageList variant="masonry" cols={3} gap={12}>
                        {sortedPhotos.map((photo, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={photo.src}
                                    alt={photo.title}
                                    loading="lazy"
                                    style={{borderRadius: 8,cursor: 'pointer'}}
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
                                        title={photo.title}
                                        subtitle={`Uploader: ${photo.uploader} | Time: ${photo.uploadTime}`}
                                        actionIcon={
                                            isSelecting && (
                                                <Checkbox
                                                    checked={selectedPhotoIds.has(photo.id)}
                                                    onClick={(e) => e.stopPropagation()} // 阻止冒泡，避免点击 checkbox 时触发外层的 toggleSelect
                                                    onChange={() => toggleSelect(photo.id)}
                                                    sx={{ color: 'white' }}
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
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                <Box sx={{display: "flex", flexDirection:"row",alignItems: "center"}}>
                    {/*<DialogTitle>{previewPhoto?.title}</DialogTitle>*/}
                    <Box sx={{textAlign: "center", padding: 1}}>
                        <img
                            src={previewPhoto?.src}
                            alt={previewPhoto?.title}
                            style={{maxWidth: "100%", maxHeight: "80vh", borderRadius: 8}}
                        />
                    </Box>
                    <Box >
                        <Typography variant="body2" sx={{mt: 1}}>
                            Uploaded by {previewPhoto?.uploader}
                        </Typography>
                        <Typography variant="body2" sx={{mt: 1}}>
                            Uploaded on {previewPhoto?.uploadTime}
                        </Typography>
                        { isSelecting && previewPhoto && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedPhotoIds.has(previewPhoto.id)}
                                        onChange={() => {
                                            toggleSelect(previewPhoto.id);
                                        }}
                                    />
                                }
                                label="Select this photo"
                            />
                        )}
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}

export default PhotoViewDialog;