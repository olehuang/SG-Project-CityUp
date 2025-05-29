import React, {useState, useRef} from 'react';
import { Box, TextField, Typography, Button, Card, CardContent ,IconButton,CircularProgress} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EXIF from 'exif-js';
/**
 * Upload 组件 Props
 * @param onUpload 完成上传后回调，传出用户所选照片列表以及其 EXIF 经纬度
 */

interface FileWithCoords {
    file: File;
    latitude: number | null;
    longitude: number | null;
    url: string;
}

// 把最新的文件列表（含坐标与 URL）回传给父组件。
//interface UploadProps {
//    onUpload: (files: FileWithCoords[]) => void;
//}

//{ onUpload }UploadProps
const Upload: React.FC = () => {
    const [address, setAddress] = useState<string>(''); // Optional building door number
    const [selectedFiles, setSelectedFiles] = useState<FileWithCoords[]>([]); // recorded files
    const [uploading, setUploading] = useState<boolean>(false); // Uploading logo in progress
    const [uploadMessage, setUploadMessage] = useState<string>(''); //Prompt after successful upload
    const cameraInputRef = useRef<HTMLInputElement | null>(null);
    const galleryInputRef = useRef<HTMLInputElement | null>(null);

    /** 请求摄像头和定位权限 Request camera and location permissions */
    const requestPermissions = async (): Promise<boolean> => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (err) {
            console.warn('Camera permissions not granted', err);
            return false;
        }
        return new Promise(resolve => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    () => resolve(true),
                    () => { console.warn('Positioning permission not granted'); resolve(true); }
                );
            } else resolve(true);
        });
    };

    /** DMS 转十进制度
     * DMS to decimal degrees for latitude/longitude reverse coding
     * with latitude/longitude to door numbering service */
    const dmsToDecimal = (dms: number[], ref: string) => {
        const [deg, min, sec] = dms;
        const dec = deg + min / 60 + sec / 3600;
        return ref === 'S' || ref === 'W' ? -dec : dec;
    };

    /** 解析单张照片的 EXIF 经纬度 Parsing single photo EXIF latitude and longitude */
    const parseExif = (file: File): Promise<{ latitude: number | null; longitude: number | null }> => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                if (result instanceof ArrayBuffer) {
                    const tags = EXIF.readFromBinaryFile(result) as any;
                    // 从标签里取出 GPSLatitude、GPSLongitude 及对应 Ref
                    // Remove GPSLatitude, GPSLongitude and the corresponding Ref from the label.
                    const lat = tags.GPSLatitude;
                    const lon = tags.GPSLongitude;
                    const latRef = tags.GPSLatitudeRef;
                    const lonRef = tags.GPSLongitudeRef;
                    if (lat && lon && latRef && lonRef) {
                        resolve({ latitude: dmsToDecimal(lat, latRef), longitude: dmsToDecimal(lon, lonRef) });
                    } else resolve({ latitude: null, longitude: null });
                } else resolve({ latitude: null, longitude: null });
            };
            reader.readAsArrayBuffer(file);
        });
    };

    /** 选择文件并处理 Selecting files and EXIF parsing */
    const handleFileChange = async (files: FileList | null) => {
        if (!files) return;
        const list = Array.from(files);
        const processed: FileWithCoords[] = await Promise.all(
            list.map(async file => {
                //并行解析每个文件的 EXIF，生成本地预览 url
                // Parallel parsing of each file's EXIF to generate local preview urls
                const { latitude, longitude } = await parseExif(file);
                const url = URL.createObjectURL(file);
                return { file, latitude, longitude, url };
            })
        );
        const next = [...selectedFiles, ...processed];

        setSelectedFiles(next);
       // onUpload(next);
    };

    /** 触发拍照选择 for shooting photo */
    const handleShootClick = async () => {
        //检查权限是否被打开
        if (await requestPermissions()) {
            cameraInputRef.current?.click();
        }
    };

    /** 触发相册选择 for Selecting Pictures from Albums */
    const handleSelectClick = () => {
        galleryInputRef.current?.click();
    };

    /** 删除某张已选文件 Delete Selected Photos*/
    const handleRemove = (idx: number) => {
        const next = selectedFiles.filter((_, i) => i !== idx);
        setSelectedFiles(next);
        //onUpload(next);
    };

    /** 将所选文件提交到后端 Submitting to the backend */
    const handleSubmit = async () => {
        if (selectedFiles.length === 0) return;
        setUploading(true);

        const formData = new FormData();
        // 如果用户输入了地址，则附加，否则跳过
        // If the user has entered an address, append it, otherwise skip it
        if (address.trim()) {
            formData.append('address', address.trim());
        }

        selectedFiles.forEach((item, idx) => {
            formData.append(`file${idx}`, item.file);
            formData.append(`latitude${idx}`, String(item.latitude));
            formData.append(`longitude${idx}`, String(item.longitude));
        });
        try {
            const resp = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            // 后端未接通时可以注释掉下面那行 if(!resp.ok)...以测试submit能否成功
            if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);

            // 上传成功后：清空选项，并显示提示
            // After successful upload: Clear Options & Show Tips
            setSelectedFiles([]);
            setUploadMessage('You have successfully uploaded the photos of this building and you will be awarded points after it has been reviewed!');

        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>Upload Building Mapping Photos</Typography>
            <Card sx={{ mb: 2 }}><CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Please enter the door number of the building you want to upload (optional)
                </Typography>
                <TextField
                    fullWidth
                    placeholder="e.g. Luisenplatz 1"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />
            </CardContent></Card>

            {/* 拍照上传的交互框 Interactive box for photo upload */}
            <Card sx={{ mb: 2 }}><CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Please only upload different pictures of the same building at a time! Please take unobstructed, unshadowed, parallel & perpendicular building photos.
                </Typography>
                <Button variant="contained" onClick={handleShootClick}>Shoot for Upload</Button>
                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={e => handleFileChange(e.target.files)}
                />
            </CardContent></Card>

            {/* 相册上传的交互框 Interactive box for album upload */}
            <Card sx={{ mb: 2 }}><CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Select photos from album to upload
                </Typography>
                <Button variant="contained" onClick={handleSelectClick}>Select for Upload</Button>
                <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={e => handleFileChange(e.target.files)}
                />
            </CardContent></Card>

            {/* 缩略图预览 + 删除按钮 Thumbnail Preview + Delete Button*/}
            {selectedFiles.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedFiles.map((item, idx) => (
                        <Box key={idx} sx={{ position: 'relative' }}>
                            <Box
                                component="img"
                                src={item.url}
                                alt={item.file.name}
                                sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                                onLoad={() => URL.revokeObjectURL(item.url)}
                            />
                            <IconButton
                                size="small"
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                onClick={() => {
                                    const next = selectedFiles.filter((_, i) => i !== idx);
                                    setSelectedFiles(next);
                                    //onUpload(next);
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )}

            <Box sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={20} /> : undefined}
                >
                    {uploading ? 'Uploading...' : 'Submit'}
                </Button>
            </Box>
            {/* 渲染成功后提示 Prompt after success */}
            {uploadMessage && (
                <Typography color="success.main" sx={{ mt: 2 }}>
                    {uploadMessage}
                </Typography>
            )}
        </Box>
    );
};

export default Upload;


