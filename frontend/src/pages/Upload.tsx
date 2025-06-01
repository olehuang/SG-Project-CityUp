import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//TODO 3：想实现这个页面随着页面比例扩大缩小

// 默认达姆施塔特市中心 Default Darmstadt city centre
const DEFAULT_CENTER: [number, number] = [49.8728, 8.6512];
const VIEWBOX = [8.570, 49.810, 8.720, 49.930];

interface UploadPhoto {
    id: string;
    file: File;
    previewUrl: string;
}

// 光标样式
const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const Upload: React.FC = () => {
    const [latlng, setLatlng] = useState<[number, number] | null>(null);
    const [address, setAddress] = useState<string>("");
    const [photos, setPhotos] = useState<UploadPhoto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [locating, setLocating] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<any>(null);

    // 1. 页面加载，自动定位
    //TODO 1：需要先请求地址权限再自动定位当前位置
    useEffect(() => {
        setLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLatlng([pos.coords.latitude, pos.coords.longitude]);
                    setLocating(false);
                },
                () => {
                    setLatlng(DEFAULT_CENTER);
                    setLocating(false);
                }
            );
        } else {
            setLatlng(DEFAULT_CENTER);
            setLocating(false);
        }
    }, []);

    // 2. 反向地理编码：marker移动后刷新地址Reverse geocoding (coordinates to address)
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await res.json();
            // 暂时：只要地址字符串里包含 darmstadt 即认为有效
            //TODO 4：搜索范围待改进：需要让这个搜索仅仅对于Darmstadt城市范围。已发现问题：如果输入范围不准确会去到其他城市含有Darmstadt的地址，
            const addrStr = JSON.stringify(data.address).toLowerCase();
            if (addrStr.includes("darmstadt")) {
                setAddress(data.display_name || "");
                setError(null);
            } else {
                setAddress("");
                setError("当前位置不在达姆施塔特范围");
            }
        } catch {
            setError("地址解析失败");
        }
    };



    // 地图点击事件 + 光标marker拖拽 Process user map clicks, update markers and addresses.
    function LocationPicker() {
        useMapEvents({
            click(e) {
                setLatlng([e.latlng.lat, e.latlng.lng]);
                reverseGeocode(e.latlng.lat, e.latlng.lng);
                setError(null);
            },
        });
        return null;
    }

    // 让 mapRef 获取当前map对象，用于搜索定位
    function SetMapRef() {
        const map = useMap();
        useEffect(() => {
            mapRef.current = map;
        }, [map]);
        return null;
    }

    // 3. 地址输入并且搜索和光标行动 Address Input and Search
    const handleAddressSearch = async () => {
        if (!address) {
            setError("Please enter the address.");
            return;
        }
        setError(null);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    address
                )}&viewbox=${VIEWBOX.join(",")}&bounded=1`
            );
            const data = await res.json();
            if (data && data.length > 0) {
                const newPos: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                setLatlng(newPos);
                if (mapRef.current && mapRef.current.setView) {
                    mapRef.current.setView(newPos, 18);
                }
                setError(null);
            } else {
                setError("The address was not found");
            }
        } catch {
            setError("The address search failed. Please try again later");
        }
    };

    // 4. marker拖拽行动
    /* 用户拖动 marker 后，自动反查新位置地址并校验范围。
     After the user drags the marker, the new location address is automatically
     back-checked and the range is verified.
     */
    const handleMarkerDragEnd = (e: any) => {
        const marker = e.target;
        const pos = marker.getLatLng();
        setLatlng([pos.lat, pos.lng]);
        reverseGeocode(pos.lat, pos.lng);
        setError(null);
    };

    // 拍照上传 Take a photo and upload it
    const handleTakePhoto = () => {
        if (fileInputRef.current) {
            // 先移除原有的capture，防止多次兼容多种浏览器
            fileInputRef.current.removeAttribute("capture");
            fileInputRef.current.setAttribute("capture", "environment");
            fileInputRef.current.click();
        }
    };
    // 相册上传 Album Upload
    const handleSelectFromGallery = () => {
        if (fileInputRef.current) {
            fileInputRef.current.removeAttribute("capture");
            fileInputRef.current.click();
        }
    };
    // 选择照片：限制上传照片的数量为五张 Select photos： Limit the number of photos uploaded to 5
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 选择照片：限制上传照片的数量为五张，权限/取消有友好提示
                  const maxPhotos = 5;
            // 1. 没选照片（权限拒绝/操作取消/系统异常），直接报错
            if (!e.target.files || e.target.files.length === 0) {
                setError(
                    "No photo detected. This may be due to camera permission being denied or the operation being canceled. " +
                    "If this happens repeatedly, please check your phone settings to allow the browser to access the camera or gallery."
                );
                return;
            }
            // 2. Limit the number of photos uploaded to 5
            const selectedFiles = Array.from(e.target.files).slice(0, maxPhotos - photos.length);
            if (selectedFiles.length + photos.length > maxPhotos) {
                setError("Up to 5 photos can be uploaded.");
                return;
            }
            // 3. 正常处理，清除之前的错误
            setError(null);
            const newPhotos: UploadPhoto[] = selectedFiles.map((file) => ({
                id: Math.random().toString(36).substring(2, 5),
                file,
                previewUrl: URL.createObjectURL(file),
            }));
            setPhotos([...photos, ...newPhotos]);

    };

    // 删除略缩图中选取了的照片
    const removePhoto = (id: string) => {
        setPhotos(photos.filter((p) => p.id !== id));
    };

    // 提交照片本身以及其信息到后端
    const handleSubmit = async () => {
        setError(null);
        if (!latlng) {
            setError("Please select the location of the building on the map");
            return;
        }
        if (!address) {
            setError("Please enter the building address");
            return;
        }
        if (photos.length === 0) {
            setError("Please upload at least one photo");
            return;
        }
        setIsSubmitting(true);

        try {
            // FormData里有建筑的经纬度门牌号和照片
            const formData = new FormData();
            formData.append("lat", latlng[0].toString());//纬度 Latitude
            formData.append("lng", latlng[1].toString());//经度 Longitude
            formData.append("address", address); //门牌号
            photos.forEach((photo) => { //照片组
                formData.append("photos", photo.file, photo.file.name);
            });

            //TODO 2：实际上传请求（得先连接后端）
            /*
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Upload failed");

            // 你可以根据需要在这里获取后端返回的内容
            // const result = await res.json();
            */

            // 没有后端时，模拟一个延时和成功提示
            setTimeout(() => {
                setError(
                    "Upload successful! Your photos have been submitted for review. " +
                    "Thank you for contributing to this project. " +
                    "Approved submissions will be rewarded with corresponding points. :)"
                );
                setPhotos([]);
                setIsSubmitting(false);
            }, 1500);

        } catch (e: any) {
            setError("Upload failed: " + (e?.message || "Unknown error"));
            setIsSubmitting(false);
        }
    };


    return (
        <div style={{ background: "#FFF8E1", minHeight: "100vh", padding: 0 }}>
            <div style={{ maxWidth: 680, margin: "0 auto", padding: 20 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, margin: "18px 0" }}>Upload Building Photos</h1>
                {/* 地址输入和搜索 */}
                <div style={{ marginBottom: 14 }}>
                    <label
                        htmlFor="address"
                        style={{
                            display: "block",
                            fontWeight: 500,
                            fontSize: 18,
                            marginBottom: 4,
                        }}
                    >
                        Please enter the address of the building to be registered (Darmstadt only)
                    </label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Type the address or click on the map to select."
                            style={{
                                width: "100%",
                                fontSize: 18,
                                padding: 8,
                                border: "1px solid #aaa",
                                borderRadius: 5,
                                maxWidth: 420,
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddressSearch();
                            }}
                        />
                        <button
                            onClick={handleAddressSearch}
                            style={{
                                background: "#60a6fd",
                                color: "#fff",
                                border: "none",
                                borderRadius: 5,
                                padding: "8px 16px",
                                fontSize: 16,
                                cursor: "pointer",
                            }}
                        >
                             Search
                        </button>
                    </div>
                </div>
                {/* map */}
                <div
                    style={{
                        width: "100%",
                        height: 320,
                        borderRadius: 16,
                        overflow: "hidden",
                        marginBottom: 14,
                        border: "1px solid #eee",
                        minHeight: 220,
                        background: "#e0e0e0",
                    }}
                >
                    {latlng ? (
                        <MapContainer
                            center={latlng}
                            zoom={18}
                            style={{ width: "100%", height: "100%" }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker
                                position={latlng}
                                icon={markerIcon}
                                draggable={true}
                                eventHandlers={{
                                    dragend: handleMarkerDragEnd,
                                }}
                            ></Marker>
                            <SetMapRef />
                            <LocationPicker />
                        </MapContainer>
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#888",
                                fontSize: 20,
                            }}
                        >
                            {locating ? "Locating..." : "Map loading failed."}
                        </div>
                    )}
                </div>
                {/* Upload area 上传区 */}
                <div style={{ marginBottom: 12 }}>
                    <button
                        onClick={handleTakePhoto}
                        style={{
                            fontSize: 16,
                            padding: "6px 12px",
                            marginRight: 12,
                            borderRadius: 7,
                            border: "1px solid #888",
                            background: "#fffde7",
                            cursor: "pointer",
                        }}
                    >
                        <span role="img" aria-label="camera">📷</span> Shooting and upload
                    </button>
                    <button
                        onClick={handleSelectFromGallery}
                        style={{
                            fontSize: 16,
                            padding: "6px 12px",
                            marginRight: 12,
                            borderRadius: 7,
                            border: "1px solid #888",
                            background: "#fffde7",
                            cursor: "pointer",
                        }}
                    >
                        <span role="img" aria-label="gallery">🖼️</span> Album upload
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </div>
                {/* 照片缩略图 */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                    {photos.map((photo) => (
                        <div key={photo.id} style={{ position: "relative" }}>
                            <img
                                src={photo.previewUrl}
                                alt="thumbnail image"
                                style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                }}
                            />
                            <button
                                onClick={() => removePhoto(photo.id)}
                                style={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "#ee9292",
                                    color: "#fff",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    lineHeight: "20px",
                                }}
                                title="delete photo"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                {/* 照片要求说明 */}
                <div
                    style={{
                        fontSize: 15,
                        background: "#fffde7",
                        borderRadius: 8,
                        padding: "10px 16px",
                        marginBottom: 20,
                        border: "1px solid #f5e79e",
                    }}
                >
                    <b>Photo shooting requirements：</b>
                    <ul style={{ paddingLeft: 22, margin: 0 }}>
                        <li>Exclude personally identifiable information (PII) including human subjects and vehicle identifiers</li>
                        <li>Maintain clear visibility of the entire structure without vegetation/object obstruction</li>
                        <li>Utilize optimal daylight conditions to mitigate shadow interference</li>
                        <li>Align camera sensors parallel to architectural planes to prevent perspective distortion</li>
                        <li>Document all building facades through comprehensive multi-angle coverage</li>
                    </ul>
                </div>
                {/* 错误和提示 */}
                {error && (
                    <div
                        style={{
                            background: error.includes("successful") ? "#e1f7d5" : "#ffd6d6",
                            color: error.includes("successful") ? "#237a00" : "#b71c1c",
                            padding: "8px 16px",
                            marginBottom: 10,
                            borderRadius: 6,
                            fontWeight: 500,
                        }}
                    >
                        {error}
                    </div>
                )}
                {/* 提交 */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{
                        width: "100%",
                        background: isSubmitting ? "#aaa" : "#4da151",
                        color: "#fff",
                        fontSize: 18,
                        fontWeight: 700,
                        border: "none",
                        borderRadius: 8,
                        padding: "13px 0",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                >
                    {isSubmitting ? "submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default Upload;




// import React, {useState, useRef} from 'react';
// import { Box, TextField, Typography, Button, Card, CardContent ,IconButton,CircularProgress} from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EXIF from 'exif-js';
// /**
//  * Upload 组件 Props
//  * @param onUpload 完成上传后回调，传出用户所选照片列表以及其 EXIF 经纬度
//  */
//
// interface FileWithCoords {
//     file: File;
//     latitude: number | null;
//     longitude: number | null;
//     url: string;
// }
//
// // 把最新的文件列表（含坐标与 URL）回传给父组件。
// //interface UploadProps {
// //    onUpload: (files: FileWithCoords[]) => void;
// //}
//
// //{ onUpload }UploadProps
// const Upload: React.FC = () => {
//     const [address, setAddress] = useState<string>(''); // Optional building door number
//     const [selectedFiles, setSelectedFiles] = useState<FileWithCoords[]>([]); // recorded files
//     const [uploading, setUploading] = useState<boolean>(false); // Uploading logo in progress
//     const [uploadMessage, setUploadMessage] = useState<string>(''); //Prompt after successful upload
//     const cameraInputRef = useRef<HTMLInputElement | null>(null);
//     const galleryInputRef = useRef<HTMLInputElement | null>(null);
//
//     /** 请求摄像头和定位权限 Request camera and location permissions */
//     const requestPermissions = async (): Promise<boolean> => {
//         try {
//             await navigator.mediaDevices.getUserMedia({ video: true });
//         } catch (err) {
//             console.warn('Camera permissions not granted', err);
//             return false;
//         }
//         return new Promise(resolve => {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     () => resolve(true),
//                     () => { console.warn('Positioning permission not granted'); resolve(true); }
//                 );
//             } else resolve(true);
//         });
//     };
//
//     /** DMS 转十进制度
//      * DMS to decimal degrees for latitude/longitude reverse coding
//      * with latitude/longitude to door numbering service */
//     const dmsToDecimal = (dms: number[], ref: string) => {
//         const [deg, min, sec] = dms;
//         const dec = deg + min / 60 + sec / 3600;
//         return ref === 'S' || ref === 'W' ? -dec : dec;
//     };
//
//     /** 解析单张照片的 EXIF 经纬度 Parsing single photo EXIF latitude and longitude */
//     const parseExif = (file: File): Promise<{ latitude: number | null; longitude: number | null }> => {
//         return new Promise(resolve => {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const result = reader.result;
//                 if (result instanceof ArrayBuffer) {
//                     const tags = EXIF.readFromBinaryFile(result) as any;
//                     // 从标签里取出 GPSLatitude、GPSLongitude 及对应 Ref
//                     // Remove GPSLatitude, GPSLongitude and the corresponding Ref from the label.
//                     const lat = tags.GPSLatitude;
//                     const lon = tags.GPSLongitude;
//                     const latRef = tags.GPSLatitudeRef;
//                     const lonRef = tags.GPSLongitudeRef;
//                     if (lat && lon && latRef && lonRef) {
//                         resolve({ latitude: dmsToDecimal(lat, latRef), longitude: dmsToDecimal(lon, lonRef) });
//                     } else resolve({ latitude: null, longitude: null });
//                 } else resolve({ latitude: null, longitude: null });
//             };
//             reader.readAsArrayBuffer(file);
//         });
//     };
//
//     /** 选择文件并处理 Selecting files and EXIF parsing */
//     const handleFileChange = async (files: FileList | null) => {
//         if (!files) return;
//         const list = Array.from(files);
//         const processed: FileWithCoords[] = await Promise.all(
//             list.map(async file => {
//                 //并行解析每个文件的 EXIF，生成本地预览 url
//                 // Parallel parsing of each file's EXIF to generate local preview urls
//                 const { latitude, longitude } = await parseExif(file);
//                 const url = URL.createObjectURL(file);
//                 return { file, latitude, longitude, url };
//             })
//         );
//         const next = [...selectedFiles, ...processed];
//
//         setSelectedFiles(next);
//        // onUpload(next);
//     };
//
//     /** 触发拍照选择 for shooting photo */
//     const handleShootClick = async () => {
//         //检查权限是否被打开
//         if (await requestPermissions()) {
//             cameraInputRef.current?.click();
//         }
//     };
//
//     /** 触发相册选择 for Selecting Pictures from Albums */
//     const handleSelectClick = () => {
//         galleryInputRef.current?.click();
//     };
//
//     /** 删除某张已选文件 Delete Selected Photos*/
//     const handleRemove = (idx: number) => {
//         const next = selectedFiles.filter((_, i) => i !== idx);
//         setSelectedFiles(next);
//         //onUpload(next);
//     };
//
//     /** 将所选文件提交到后端 Submitting to the backend */
//     const handleSubmit = async () => {
//         if (selectedFiles.length === 0) return;
//         setUploading(true);
//
//         const formData = new FormData();
//         // 如果用户输入了地址，则附加，否则跳过
//         // If the user has entered an address, append it, otherwise skip it
//         if (address.trim()) {
//             formData.append('address', address.trim());
//         }
//
//         selectedFiles.forEach((item, idx) => {
//             formData.append(`file${idx}`, item.file);
//             formData.append(`latitude${idx}`, String(item.latitude));
//             formData.append(`longitude${idx}`, String(item.longitude));
//         });
//         try {
//             const resp = await fetch('/api/upload', {
//                 method: 'POST',
//                 body: formData,
//             });
//             // 后端未接通时可以注释掉下面那行 if(!resp.ok)...以测试submit能否成功
//             if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);
//
//             // 上传成功后：清空选项，并显示提示
//             // After successful upload: Clear Options & Show Tips
//             setSelectedFiles([]);
//             setUploadMessage('You have successfully uploaded the photos of this building and you will be awarded points after it has been reviewed!');
//
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setUploading(false);
//         }
//     };
//
//     return (
//         <Box sx={{ p: 2 }}>
//             <Typography variant="h4" gutterBottom>Upload Building Mapping Photos</Typography>
//             <Card sx={{ mb: 2 }}><CardContent>
//                 <Typography variant="subtitle1" gutterBottom>
//                     Please enter the door number of the building you want to upload (optional)
//                 </Typography>
//                 <TextField
//                     fullWidth
//                     placeholder="e.g. Luisenplatz 1"
//                     value={address}
//                     onChange={e => setAddress(e.target.value)}
//                 />
//             </CardContent></Card>
//
//             {/* 拍照上传的交互框 Interactive box for photo upload */}
//             <Card sx={{ mb: 2 }}><CardContent>
//                 <Typography variant="subtitle1" gutterBottom>
//                     Please only upload different pictures of the same building at a time! Please take unobstructed, unshadowed, parallel & perpendicular building photos.
//                 </Typography>
//                 <Button variant="contained" onClick={handleShootClick}>Shoot for Upload</Button>
//                 <input
//                     ref={cameraInputRef}
//                     type="file"
//                     accept="image/*"
//                     capture="environment"
//                     hidden
//                     onChange={e => handleFileChange(e.target.files)}
//                 />
//             </CardContent></Card>
//
//             {/* 相册上传的交互框 Interactive box for album upload */}
//             <Card sx={{ mb: 2 }}><CardContent>
//                 <Typography variant="subtitle1" gutterBottom>
//                     Select photos from album to upload
//                 </Typography>
//                 <Button variant="contained" onClick={handleSelectClick}>Select for Upload</Button>
//                 <input
//                     ref={galleryInputRef}
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     hidden
//                     onChange={e => handleFileChange(e.target.files)}
//                 />
//             </CardContent></Card>
//
//             {/* 缩略图预览 + 删除按钮 Thumbnail Preview + Delete Button*/}
//             {selectedFiles.length > 0 && (
//                 <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                     {selectedFiles.map((item, idx) => (
//                         <Box key={idx} sx={{ position: 'relative' }}>
//                             <Box
//                                 component="img"
//                                 src={item.url}
//                                 alt={item.file.name}
//                                 sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
//                                 onLoad={() => URL.revokeObjectURL(item.url)}
//                             />
//                             <IconButton
//                                 size="small"
//                                 sx={{ position: 'absolute', top: 0, right: 0 }}
//                                 onClick={() => {
//                                     const next = selectedFiles.filter((_, i) => i !== idx);
//                                     setSelectedFiles(next);
//                                     //onUpload(next);
//                                 }}
//                             >
//                                 <DeleteIcon fontSize="small" />
//                             </IconButton>
//                         </Box>
//                     ))}
//                 </Box>
//             )}
//
//             <Box sx={{ mt: 2 }}>
//                 <Button
//                     variant="contained"
//                     onClick={handleSubmit}
//                     disabled={uploading}
//                     startIcon={uploading ? <CircularProgress size={20} /> : undefined}
//                 >
//                     {uploading ? 'Uploading...' : 'Submit'}
//                 </Button>
//             </Box>
//             {/* 渲染成功后提示 Prompt after success */}
//             {uploadMessage && (
//                 <Typography color="success.main" sx={{ mt: 2 }}>
//                     {uploadMessage}
//                 </Typography>
//             )}
//         </Box>
//     );
// };
//
// export default Upload;


