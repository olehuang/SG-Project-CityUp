import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Alert,
    CircularProgress
} from "@mui/material";
import pageBackgroundStyles from "./pageBackgroundStyles";
import { useNavigate } from "react-router-dom";
import { useAuthHook } from "../components/AuthProvider";
import axios from "axios"

interface PhotoItem {
    photo_id: string;
    user_id: string;
    building_addr: string;
    upload_time: string;
    image_url: string;
    status: string;
    feedback?: string;
    selected?: boolean;
    reviewer_id?: string;
    review_time?: string;
}

const PhotoReview = () => {
    // const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [photos, setPhotos] = useState<PhotoItem[]>([

    ]);
    const [selectMode, setSelectMode] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const navigate = useNavigate();
    const { auth, user_id } = useAuthHook();



    const fetchPhotos = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`http://127.0.0.1:8000/photos/review/batch_fetch?reviewer_id=${user_id}`, { method: "GET" });
            if (!res.ok) {
                if (res.status === 404) {
                    setError("No photos pending review");
                    setPhotos([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: PhotoItem[] = await res.json();

            console.log("Fetched photo data:", data);

            const photosWithSelected = data.map(photo => ({
                ...photo,
                selected: false
            }));
            setPhotos(photosWithSelected);
            setSuccess(`Successfully fetched ${data.length} Photos`);
        } catch (err) {
            console.error("Failed to fetch photos", err);
            setError("Failed to fetch photos. Please check your network connection or server status.");
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSingleReview = async (photo_id: string, result: "success" | "fail") => {
        try {
            setLoading(true);
            setError("");

            const status = result === "success" ? "Reviewed" : "Reviewed";
            const feedback = result === "success" ? "Approved" : "Rejected";

            const res = await fetch("http://127.0.0.1:8000/photos/review/single", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    photo_id: photo_id,
                    status_result: result,
                    feedback: feedback,
                    reviewer_id: user_id
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            // 从列表中移除已审核的照片
            setPhotos((prev) => prev.filter((photo) => photo.photo_id !== photo_id));
            setSuccess(`Photo review${result === "success" ? "approved" : "rejected"}, and removed from the list`);
        } catch (err) {
            console.error("Single review failed", err);
            setError("Review failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBatchReview = async (result: "success" | "fail") => {
        const selectedPhotos = photos.filter((p) => p.selected);

        if (selectedPhotos.length === 0) {
            setError("Please select photos to review first");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const selectedIds = selectedPhotos.map((p) => p.photo_id);

            const res = await fetch("http://127.0.0.1:8000/photos/review/batch_submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ids: selectedIds,
                    result: result,
                    feedback: result === "success" ? "Batch approved" : "Batch rejected",
                    reviewer_id: user_id
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            setPhotos((prev) => prev.filter((p) => !p.selected));
            setSuccess(`Batch review ${result === "success" ? "approved" : "rejected"} for ${selectedIds.length} photos`);

            setSelectAll(false);
            setSelectMode(false);
        } catch (err) {
            console.error("Batch review failed", err);
            setError("Batch review failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 页面卸载时释放照片
    useEffect(() => {
        return () => {
            if (user_id) {
                fetch("http://127.0.0.1:8000/photos/review/release_all", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reviewer_id: user_id
                    }),
                }).catch(err => console.error("Failed to release photos:", err));
            }
        };
    }, [user_id]);

    const toggleSelectAll = () => {
        const newSelect = !selectAll;
        setSelectAll(newSelect);
        setPhotos((prev) => prev.map((p) => ({ ...p, selected: newSelect })));
    };

    const toggleSelectMode = () => {
        setSelectMode((prev) => !prev);
        if (selectMode) {
            // 退出选择模式时清除所有选择
            setPhotos((prev) => prev.map((p) => ({ ...p, selected: false })));
            setSelectAll(false);
        }
    };

    const togglePhotoSelection = (photo_id: string) => {
        setPhotos((prev) =>
            prev.map((p) =>
                p.photo_id === photo_id
                    ? { ...p, selected: !p.selected }
                    : p
            )
        );

        // 检查是否所有照片都被选中
        const updatedPhotos = photos.map((p) =>
            p.photo_id === photo_id ? { ...p, selected: !p.selected } : p
        );
        const allSelected = updatedPhotos.every(p => p.selected);
        setSelectAll(allSelected);
    };

    // 清除消息
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError("");
                setSuccess("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <Box
            sx={{
                ...pageBackgroundStyles.container,
                padding: "1px 0px",
                height: "100vh",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                    px: 2,
                }}
            >
                
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button
                            variant="contained"
                            onClick={fetchPhotos}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? "Fetching..." : "Fetch Photos"}
                        </Button>

                        {(error || success) && (
                            <Alert
                                severity={error ? "error" : "success"}
                                sx={{
                                    minWidth: 0,
                                    flex: 1,
                                    maxWidth: "400px"
                                }}
                            >
                                {error || success}
                            </Alert>
                        )}
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={toggleSelectMode}
                        disabled={photos.length === 0}
                    >
                        {selectMode ? "Cancel Selection" : "Select"}
                    </Button>
                </Box>

                {/* 照片列表 */}
                <TableContainer
                    component={Paper}
                    sx={{
                        width: "100%",
                        maxWidth: "100%",
                        margin: 0,
                        mb: 2,
                        flex: 1,
                        overflow: "auto",
                        maxHeight: "calc(100vh - 220px)",
                    }}
                >
                    <Table stickyHeader sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                {selectMode && (
                                    <TableCell padding="checkbox" sx={{ width: 48 }}>
                                        <Checkbox
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            indeterminate={
                                                photos.some((p) => p.selected) &&
                                                !photos.every((p) => p.selected)
                                            }
                                        />
                                    </TableCell>
                                )}
                                <TableCell sx={{ width: 120 }}>Photo</TableCell>
                                <TableCell sx={{ width: 180 }}>Building Address</TableCell>
                                <TableCell sx={{ width: 150 }}>Upload User</TableCell>
                                <TableCell sx={{ width: 180 }}>Upload Time</TableCell>
                                <TableCell sx={{ width: 150 }}>Review Result</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {photos.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={selectMode ? 6 : 5}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
                                        <Typography color="text.secondary">
                                            No pending photos for review, click 'Fetch Photos' to get data
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                photos.map((photo) => (
                                    <TableRow key={photo.photo_id}>
                                        {selectMode && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={!!photo.selected}
                                                    onChange={() => togglePhotoSelection(photo.photo_id)}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <img
                                                src={photo.image_url}
                                                alt="Building Photo"
                                                style={{
                                                    width: "110px",
                                                    height: "82px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px",
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                                Building ID: {photo.building_addr}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{photo.user_id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(photo.upload_time).toLocaleString("zh-CN")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: "flex", gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() =>
                                                        handleSingleReview(photo.photo_id, "success")
                                                    }
                                                    disabled={loading}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleSingleReview(photo.photo_id, "fail")
                                                    }
                                                    disabled={loading}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* 统计信息 */}
                <Box
                    sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        px: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {photos.length > 0
                            ? `Currently showing ${photos.length} pending photos for review`
                            : "No photos loaded"
                        }
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center">
                        {selectMode && photos.some((p) => p.selected) && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleBatchReview("success")}
                                    disabled={loading}
                                    size="small"
                                >
                                    Batch Approve ({photos.filter((p) => p.selected).length})
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleBatchReview("fail")}
                                    disabled={loading}
                                    size="small"
                                >
                                    Batch Reject ({photos.filter((p) => p.selected).length})
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate("/dashboard")}
                            size="small"
                        >
                            Exit
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

};

export default PhotoReview;