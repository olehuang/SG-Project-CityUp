import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
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

/**
 * 建筑照片上传组件（Upload_Page）
 * 实现地址定位、地图选点、照片选择/预览及上传，辅助3D城市模型优化。
 *
 * Component for uploading building photos: supports map/location selection, photo preview and upload for 3D city modeling.
 */
const Upload: React.FC = () => {
    // 布局相关状态
    const [mapRect, setMapRect] = useState({ top: 0, height: 0 });
    const mapDivRef = useRef<HTMLDivElement | null>(null);
    const leftSectionRef = useRef<HTMLDivElement | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    //用户id，经纬度，地址，相片，处理错误，地址获取权限以及上传操作
    const { user_id, auth } = useAuthHook();
    const [latlng, setLatlng] = useState<[number, number] | null>(null);
    const [address, setAddress] = useState<string>("");
    const [photos, setPhotos] = useState<UploadPhoto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [locating, setLocating] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 门牌号相关组件
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [houseNumberMissing, setHouseNumberMissing] = useState<boolean>(false);
    const houseNumberRef = useRef<HTMLInputElement>(null);

    // 地图组件引用
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<any>(null);

    // 1. 原有窗口宽度监听，决定isSmallScreen
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // 判断是否为小屏幕
    const isSmallScreen = windowWidth < 1200;

    // 2. 新增 isMobile 状态
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 1. 地图页面加载，请求定位，自动定位设备
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
    const reverseGeocode = async (lat: number, lng: number, fromMapClick=false) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await res.json();
            const addr = data.address || {};
            // addr handle 处理地址
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
            // addr not in Darmstadt
            const isInDarmstadt = locationString.includes("darmstadt");
            if (!isInDarmstadt) {
                setAddress("");
                setHouseNumber("");
                setHouseNumberMissing(false);
                setError("Current location is not in Darmstadt");
                return;
            }
            setError(null);
            // house number
            const hn = addr.house_number ?? "";
            setHouseNumber(hn);

            if (fromMapClick && !hn) {
                setHouseNumberMissing(true);
                setTimeout(() => houseNumberRef.current?.focus(), 0);
            } else {
                setHouseNumberMissing(false);
            }
            const parts = [hn,addr.road,"Darmstadt",addr.postcode,"Hessen","Deutschland"]
                .filter(Boolean);
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
                reverseGeocode(e.latlng.lat, e.latlng.lng,true);
                setError(null);
            },
        });
        return null;
    }

    // mapRef get current map object mapRef获取当前map对象
    function SetMapRef() {
        const map = useMap();
        useEffect(() => {
            mapRef.current = map;
        }, [map]);
        return null;
    }

    // 3. 地址输入搜索地址和光标行动到指定地址 Address Input and Search
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

    // 4. marker光标拖拽处理
    const handleMarkerDragEnd = (e: any) => {
        const marker = e.target;
        const pos = marker.getLatLng();
        setLatlng([pos.lat, pos.lng]);
        reverseGeocode(pos.lat, pos.lng,true);
        setError(null);
    };

    // camera upload
    const handleTakePhoto = () => {
        if (fileInputRef.current) {
            fileInputRef.current.removeAttribute("capture");
            fileInputRef.current.setAttribute("capture", "environment");
            fileInputRef.current.click();
        }
    };

    // album upload
    const handleSelectFromGallery = () => {
        if (fileInputRef.current) {
            fileInputRef.current.removeAttribute("capture");
            fileInputRef.current.click();
        }
    };

    // 选择照片：限制上传照片的数量为五张 Select photos： Limit the number of photos uploaded to 5
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxPhotos = 5;
        if (!e.target.files || e.target.files.length === 0) {
            setError(
                "No photo detected. This may be due to camera permission being denied or the operation being canceled. " +
                "If this happens repeatedly, please check your phone settings to allow the browser to access the camera or gallery."
            );
            return;
        }
        const selectedFiles = Array.from(e.target.files).slice(0, maxPhotos - photos.length);
        if (selectedFiles.length + photos.length > maxPhotos) {
            setError("Up to 5 photos can be uploaded.");
            return;
        }
        setError(null);
        const newPhotos: UploadPhoto[] = selectedFiles.map((file) => ({
            id: Math.random().toString(36).substring(2, 5),
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setPhotos([...photos, ...newPhotos]);
    };

    // delete photos
    const removePhoto = (id: string) => {
        setPhotos(photos.filter((p) => p.id !== id));
    };

    // submit
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
        if (houseNumberMissing && !houseNumber.trim()) {
            setError("Please enter the house number before submitting.");
            if (houseNumberRef.current) houseNumberRef.current.focus();
            return;
        }
        if (photos.length === 0) {
            setError("Please upload at least one photo");
            return;
        }
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("user_id", user_id);
            formData.append("lat", latlng[0].toString());
            formData.append("lng", latlng[1].toString());
            formData.append("building_addr", address);
            photos.forEach((photo) => {
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

    // 监控地图高度Monitor map height
    useLayoutEffect(() => {
        const updateMapRect = () => {
            if (mapDivRef.current && leftSectionRef.current) {
                const rect = mapDivRef.current.getBoundingClientRect();
                const parentRect = leftSectionRef.current.getBoundingClientRect();
                setMapRect({
                    top: rect.top - parentRect.top,
                    height: rect.height
                });
            }
        };
        updateMapRect();
        window.addEventListener('resize', updateMapRect);
        return () => window.removeEventListener('resize', updateMapRect);
    }, [latlng]);

    return (
        <div
            style={{
                width: "100%",
                //minHeight:"100vh",
                height: isMobile ? "90dvh" : undefined,
                overflowY: isMobile ? "auto" : "hidden",//手机端滚动显示，pc不动
                background: "#FFF8E1",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "flex-start",
                justifyContent: "stretch",
                boxSizing: "border-box",
                position: "relative",
                padding: isSmallScreen ? "20px" : "0",
                paddingBottom: isMobile ? "20px" : "0"
            }}
        >
            {/* 左侧区域 - 地图和地址输入Left Area - Map and Address Input */}
            <div
                ref={leftSectionRef}
                style={{
                    flex: isSmallScreen ? "none" : 2,
                    width: isSmallScreen ? "100%" : "68%",
                    padding: isMobile ? "6px" : (isSmallScreen ? "20px" : "10px 38px 44px 6vw"),
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    position: "relative" // 用于定位分割线
                }}
            >
                <h1
                    style={{
                        fontSize: isMobile ? "1.3rem" : "2rem",
                        fontWeight: 700,
                        margin: "0 0 22px 0",
                        whiteSpace: "nowrap", // 不换行
                        textOverflow: "ellipsis"
                    }}
                >
                    Upload Building Photos
                </h1>

                {/* Address entry and search */}
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="address"
                           style={{
                               display: "block",
                               fontWeight: 400,
                               fontSize: "0.9rem",
                               marginBottom: 8,
                           }}>
                        Please enter the address of the building to be registered (Darmstadt only)
                    </label>
                    <div style={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: 8, alignItems: "center", width: "100%" }}>
                        {/* 门牌号输入框Door number input box */}
                        {houseNumberMissing && (
                            <input
                                ref={houseNumberRef}
                                type="text"
                                value={houseNumber}
                                onChange={(e) => {
                                    setHouseNumber(e.target.value);
                                    const parts = address.split(", ");
                                    parts[0] = e.target.value || "";
                                    setAddress(parts.filter(Boolean).join(", "));
                                }}
                                placeholder="Door Nr."
                                style={{
                                    width: isSmallScreen ? "100%" : 90,
                                    fontSize: "0.9rem",
                                    padding: "10px 12px",
                                    border: "2px solid #e53935",
                                    background: "#fff6f5",
                                    borderRadius: 8,
                                    boxSizing: "border-box",
                                    minWidth: 0,
                                    marginRight: isSmallScreen ? 0 : 8
                                }}
                                required
                            />
                        )}
                        {/* 地址输入框和搜索按钮 Address input box and search button*/}
                        <div style={{ display: "flex", flex: 1, width: "100%", gap: 8 }}>
                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Type the address or click on the map to select."
                                style={{
                                    flex: 1,
                                    fontSize: "0.9rem",
                                    padding: "10px 15px",
                                    border: "1px solid #aaa",
                                    borderRadius: 8,
                                    boxSizing: "border-box",
                                    minWidth: "150px"
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
                                    borderRadius: 8,
                                    padding: "10px 20px",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                {/* 缺失门牌号提示 Missing door number alert*/}
                {houseNumberMissing && (
                    <div style={{ color: "#e53935", fontSize: 14, marginTop: isMobile?0:8 }}>
                        The house number for this building is not available. Please enter it manually.
                    </div>
                )}
                {/* 地图Map */}
                <div
                    ref={mapDivRef}
                    style={{
                        width: "100%",
                        height: isMobile ? "30vh" : (isSmallScreen ? "60vh" : "60vh"),
                        maxHeight: 500,
                        minHeight: isMobile ? 150 : (isSmallScreen ? 300 : 350),
                        borderRadius: 16,
                        overflow: "hidden",
                        marginBottom: 8,
                        border: "0.6px solid #eee",
                        background: "#e0e0e0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
                {/* 地图操作提示Map operation */}
                <div style={{
                    textAlign: "center",
                    marginTop: "10px",
                    fontSize: isMobile?"0.5rem":"0.9rem",
                    color: "#666"
                }}>
                    Drag the marker to adjust the building location
                </div>
            </div>

            {/* 右侧区域 - 照片上传 Right Area - Photo Upload*/}
            <div
                style={{
                    flex: isSmallScreen ? "none" : 1,
                    width: isSmallScreen ? "100%" : "32%",
                    overflowY:isMobile? "visible":"auto",
                    padding: isMobile ? "6px"
                        : (isSmallScreen ? "20px" : `119px 6vw 44px 38px`), // ← 用isMobile微调padding
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    background: "transparent",
                    //paddingTop: isMobile ? 0 : (isSmallScreen ? "20px" : "119px"),
                    //height: isMobile ? "auto" : "100%",
                    //minHeight: isSmallScreen ? "40vh" : undefined,
                    //flexGrow: isMobile ? 0 : 1, // 关键：手机端不要flex-grow
                }}
            >
                {/* 拍照/相册按钮 Photo/Album button*/}
                <div style={{ marginBottom: isMobile? "opx" : 16, display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <button
                        onClick={handleTakePhoto}
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            fontSize: 16,
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #888",
                            background: "#fffde7",
                            color: "#60a6fd",
                            cursor: "pointer",
                            minWidth: "140px",
                            transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "#60a6fd";
                            e.currentTarget.style.color = "#fffde7";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "#fffde7";
                            e.currentTarget.style.color = "#60a6fd";
                        }}
                    >
                        <span role="img" aria-label="camera">📷</span> Camera
                    </button>
                    <button
                        onClick={handleSelectFromGallery}
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            fontSize: 16,
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #888",
                            background: "#fffde7",
                            color: "#4da151",
                            cursor: "pointer",
                            minWidth: "140px",
                            transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "#4da151";
                            e.currentTarget.style.color = "#fffde7";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "#fffde7";
                            e.currentTarget.style.color = "#4da151";
                        }}
                    >
                        <span role="img" aria-label="gallery">🖼️</span> Album
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

                {/* 照片缩略图区域 Photo thumbnail area*/}
                <div style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    minHeight: isMobile? 60 : 90,
                    //overflow: "auto",
                    paddingBottom:isMobile ? "5px" : undefined,
                }}>
                    {photos.map((photo) => (
                        <div key={photo.id} style={{ position: "relative" }}>
                            <img
                                src={photo.previewUrl}
                                alt="thumbnail image"
                                style={{
                                    width: 78,
                                    height: 78,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    border: "1px solid #ddd",
                                    display: "block",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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

                {/* 拍摄要求说明 Explanation of filming requirements */}
                <div
                    style={{
                        fontSize:  isMobile ? "0.7rem" : "0.98rem",
                        background: "#fffde7",
                        borderRadius: 12,
                        padding: isMobile ? "10px" : "16px",
                        marginBottom: "16px",
                        border: "1px solid #f5e79e",
                        boxSizing: "border-box",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        flexGrow: isMobile ? 0 : 1
                    }}
                >
                    <h3 style={{
                        margin: "0 0 12px 0",
                        fontSize: isMobile?"0.9rem":"1.1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: isMobile?"3px":"8px",
                    }}>
                        <span>📋</span> Photo shooting requirements：
                    </h3>
                    <ul style={{ paddingLeft: 22, margin: 0, lineHeight: 1.6 }}>
                        <li><strong>NO!</strong> Face and Licence Plate</li>
                        <li><strong>NO!</strong> Obstructions</li>
                        <li><strong>NO!</strong> Shadows on the building</li>
                        <li><strong>NO!</strong> Distortion, ensuring parallelism!</li>
                        <li>Make sure pictures are clear</li>
                        <li>Photographing the building as a whole</li>
                    </ul>
                </div>

                {/* 错误提示 error handle*/}
                {error && (
                    <div
                        style={{
                            background: error.includes("successful") ? "#e1f7d5" : "#ffd6d6",
                            color: error.includes("successful") ? "#237a00" : "#b71c1c",
                            padding: "12px 16px",
                            marginBottom: 10,
                            borderRadius: 8,
                            fontWeight: 500,
                            border: `1px solid ${error.includes("successful") ? "#a5d6a7" : "#ffcdd2"}`,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <span>{error.includes("successful") ? "✅" : "⚠️"}</span>
                        <div>{error}</div>
                    </div>
                )}

                {/* 提交按钮 Submit button*/}
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
                        padding: "14px 0",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "background 0.3s",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        marginTop:isMobile?"12px":"16px",
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <div style={{
                                width: 16,
                                height: 16,
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderTop: "2px solid white",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }}></div>
                            submitting...
                        </>
                    ) : "Submit"}
                </button>
            </div>

            {/* 添加动画样式 */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Upload;