import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuthHook } from "../components/AuthProvider";



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
    const { user_id, auth } = useAuthHook();
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
            const addr = data.address || {};

            const locationString = [
                addr.city,
                addr.town,
                addr.village,
                addr.municipality,
                addr.state_district,
                addr.city_district,
                addr.county,
                addr.state,
                addr.suburb
            ]
                .filter(Boolean)
                .join(", ")
                .toLowerCase();

            const isInDarmstadt = locationString.includes("darmstadt");
            if (!isInDarmstadt) {
                setAddress("");
                setError("Current location is not in Darmstadt");
                return;
            }
            setError(null);
            const parts = [
                addr.house_number,
                addr.road,
                "Darmstadt",
                addr.postcode,
                "Hessen",
                "Deutschland"
            ].filter(Boolean);

            setAddress(parts.join(", "));

        } catch {
            setError("Address resolution failure");
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

        if (!auth || !user_id) {
            setError("You must be logged in to upload photos.");
            return;
        }
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
            formData.append("user_id", user_id);//用户id
            formData.append("lat", latlng[0].toString());//纬度 Latitude
            formData.append("lng", latlng[1].toString());//经度 Longitude
            formData.append("building_id", address); //门牌号作为 building_id
            photos.forEach((photo) => { //照片组
                formData.append("photos", photo.file, photo.file.name);
            });


            const res = await fetch("http://localhost:8000/photos/", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            const data = await res.json();
            setError("Upload successful! " + data.message);
            setPhotos([]);
        } catch (e:any) {
            setError("Upload failed: " + (e?.message || "Unknown error"));
        }
        setIsSubmitting(false);
    };


    return (
        <div
            style={{
                height: "100%",         // 让内容充满剩余空间
                width: "100%",
                overflowY: "auto",      // 出现竖向滚动条
                background: "#FFF8E1",
            }}
        >

            <div
                style={{
                    maxWidth: 680,
                    width: "95%",
                    margin: "0 auto",
                    padding: "3vw 0.5vw",
                    boxSizing: "border-box",
                }}
            >
                <h1
                    style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        margin: "18px 0"
                    }}
                >
                    Upload Building Photos
                </h1>
                {/* 地址输入和搜索 */}
                <div style={{ marginBottom: 14 }}>
                    <label htmlFor="address"
                        style={{
                            display: "block",
                            fontWeight: 500,
                            fontSize: "1.15rem",
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
                                fontSize: "1rem",
                                padding: "0.6em 0.8em",
                                border: "1px solid #aaa",
                                borderRadius: 5,
                                boxSizing: "border-box",
                                maxWidth: "420px",
                                minWidth: "0px"
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
                                padding: "0.5em 1.3em",
                                fontSize: "1rem",
                                cursor: "pointer",
                                flexShrink: 0,
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
                        height: "35vw",
                        maxHeight: 350,
                        minHeight: 220,
                        borderRadius: 16,
                        overflow: "hidden",
                        marginBottom: 14,
                        border: "1px solid #eee",
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
                <div style={{ marginBottom: 12,display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <button
                        onClick={handleTakePhoto}
                        style={{
                            fontSize: 16,
                            padding: "6px 12px",
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
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10,overflowX: "auto",}}>
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
                                    display: "block"
                                }}
                            />
                            <button
                                onClick={() => removePhoto(photo.id)}
                                style={{
                                    position: "absolute",
                                    top: 1,
                                    right: 1,
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "#ee9292",
                                    color: "#fff",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    lineHeight: "20px",
                                    zIndex: 2,
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
                        fontSize: "1rem",
                        background: "#fffde7",
                        borderRadius: 8,
                        padding: "10px 16px",
                        marginBottom: 20,
                        border: "1px solid #f5e79e",
                        boxSizing: "border-box"
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
                        fontSize: "1.1rem",
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