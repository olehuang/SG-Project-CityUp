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
    CircularProgress,
    Dialog,
    DialogContent,
    IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import pageBackgroundStyles from "./pageBackgroundStyles";
import { useNavigate } from "react-router-dom";
import { useAuthHook } from "../components/AuthProvider";
import axios from "axios"

interface PhotoItem {
    photo_id: string;
    user_id: string;
    username?: string;
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
    // 添加大图预览相关状态
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewPhotoInfo, setPreviewPhotoInfo] = useState<PhotoItem | null>(null);

    const navigate = useNavigate();
    const { auth, user_id } = useAuthHook();


    const handleImageClick = (photo: PhotoItem) => {
        setPreviewImage(photo.image_url);
        setPreviewPhotoInfo(photo);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
        setPreviewImage("");
        setPreviewPhotoInfo(null);
    };

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

    const styles = {
        mainContainer: {
            ...pageBackgroundStyles.container,
            padding: "1px 0px",
            height: "100vh",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        } as const,
        contentWrapper: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "95%",
            maxWidth: "none",
            margin: "0 auto",
            px: 2,
        },
        topActionContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
        },
        leftActionGroup: {
            display: "flex",
            alignItems: "center",
            gap: 2,
        },
        fetchButton: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: 14,
            backgroundColor: "#5D4037",
            color: "#FFF8E1",
            px: 3,
            py: 1.5,
            "&:hover": {
                backgroundColor: "#4E342E",
            },
            "&:disabled": {
                backgroundColor: "#A1887F",
                color: "#D7CCC8",
            }
        },
        selectButton: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: 14,
            borderColor: "#5D4037",
            color: "#5D4037",
            px: 3,
            py: 1.5,
            "&:hover": {
                borderColor: "#4E342E",
                backgroundColor: "#FFF8E1",
            },
            "&:disabled": {
                borderColor: "#D7CCC8",
                color: "#A1887F",
            }
        },
        alert: (hasError: boolean) => ({
            minWidth: 0,
            flex: 1,
            maxWidth: "400px",
            borderRadius: 2,
            backgroundColor: hasError ? "#FFEBEE" : "#E8F5E8",
            color: hasError ? "#C62828" : "#2E7D32",
            "& .MuiAlert-icon": {
                color: hasError ? "#C62828" : "#2E7D32",
            }
        }),
        tableContainer: {
            width: "100%",
            maxWidth: "100%",
            margin: 0,
            mb: 2,
            flex: 1,
            overflow: "auto",
            maxHeight: "calc(100vh - 220px)",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(93, 64, 55, 0.1)",
            backgroundColor: "#FFFEF7",
        },
        table: {
            minWidth: 700,
        },

        headerCheckboxCell: {
            width: 48,
            backgroundColor: "#F5F5F5",
            borderBottom: "2px solid #D7CCC8"
        },
        headerCell: (width: number) => ({
            width: width,
            backgroundColor: "#F5F5F5",
            borderBottom: "2px solid #D7CCC8",
            fontWeight: "bold",
            color: "#3E2723"
        }),
        checkbox: {
            color: "#5D4037",
            "&.Mui-checked": {
                color: "#5D4037",
            },
            "&.MuiCheckbox-indeterminate": {
                color: "#5D4037",
            }
        },
        noDataCell: (selectMode: boolean) => ({
            colSpan: selectMode ? 6 : 5,
            align: "center" as const,
            py: 6,
            backgroundColor: "#FFFEF7"
        }),

        noDataText: {
            color: "#6D4C41",
            fontSize: 16,
            fontWeight: "500"
        },

        tableRow: (selectMode: boolean, selected: boolean) => ({
            backgroundColor: selectMode && selected ? "#F3E5F5" : "#FFFEF7",
            height: "120px",
            "&:hover": {
                backgroundColor: "#F3E5F5",
            }
        }),
        imageCell: {
            padding: "8px"
        },
        image: {
            width: "150px",
            height: "110px",
            objectFit: "cover" as const,
            borderRadius: "8px",
            border: "2px solid #D7CCC8",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }
        },
        addressText: {
            wordBreak: "break-word",
            color: "#3E2723",
            fontWeight: "500"
        },
        userText: {
            color: "#3E2723",
            fontWeight: "500"
        },
        timeText: {
            color: "#6D4C41"
        },
        actionButtonContainer: {
            display: "flex",
            gap: 1
        },
        approveButton: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: 12,
            backgroundColor: "#4CAF50",
            color: "#FFF",
            px: 2,
            py: 1,
            "&:hover": {
                backgroundColor: "#45A049",
            },
            "&:disabled": {
                backgroundColor: "#A1887F",
                color: "#D7CCC8",
            }
        },
        rejectButton: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: 12,
            backgroundColor: "#F44336",
            color: "#FFF",
            px: 2,
            py: 1,
            "&:hover": {
                backgroundColor: "#E53935",
            },
            "&:disabled": {
                backgroundColor: "#A1887F",
                color: "#D7CCC8",
            }
        },
        statsContainer: {
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            px: 1,
        },
        statsText: {
            color: "#6D4C41",
            fontWeight: "500"
        },
        bottomActionGroup: {
            display: "flex",
            gap: 2,
            alignItems: "center"
        },
        batchApproveButton: {
            borderRadius: 10,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: 13,
            backgroundColor: "#4CAF50",
            color: "#FFF",
            px: 3,
            py: 1.2,
            "&:hover": {
                backgroundColor: "#45A049",
            },
            "&:disabled": {
                backgroundColor: "#A1887F",
                color: "#D7CCC8",
            }
        },
        batchRejectButton: {
            borderRadius: 10,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: 13,
            backgroundColor: "#F44336",
            color: "#FFF",
            px: 3,
            py: 1.2,
            "&:hover": {
                backgroundColor: "#E53935",
            },
            "&:disabled": {
                backgroundColor: "#A1887F",
                color: "#D7CCC8",
            }
        },
        exitButton: {
            borderRadius: 10,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: 13,
            borderColor: "#5D4037",
            color: "#5D4037",
            px: 3,
            py: 1.2,
            "&:hover": {
                borderColor: "#4E342E",
                backgroundColor: "#FFF8E1",
            }
        },

        previewDialog: {
            "& .MuiDialog-paper": {
                maxWidth: "90vw",
                maxHeight: "90vh",
                backgroundColor: "transparent",
                boxShadow: "none",
                overflow: "hidden"
            }
        },
        previewContent: {
            position: "relative",
            padding: 0,
            backgroundColor: "transparent",
            overflow: "hidden",
            "&:first-child": {
                paddingTop: 0
            }
        },
        closeButton: {
            position: "absolute",
            right: -40,
            top: -40,
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            zIndex: 1,
            "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
            }
        },
        previewImage: {
            maxWidth: "80vw",
            maxHeight: "80vh",
            objectFit: "contain" as const,
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
        }
    };

    return (
        <Box sx={styles.mainContainer}>
            <Box sx={styles.contentWrapper}>
                <Box sx={styles.topActionContainer}>
                    <Box sx={styles.leftActionGroup}>
                        <Button
                            variant="contained"
                            onClick={fetchPhotos}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                            sx={styles.fetchButton}
                        >
                            {loading ? "Fetching..." : "Fetch Photos"}
                        </Button>

                        {(error || success) && (
                            <Alert
                                severity={error ? "error" : "success"}
                                sx={styles.alert(!!error)}
                            >
                                {error || success}
                            </Alert>
                        )}
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={toggleSelectMode}
                        disabled={photos.length === 0}
                        sx={styles.selectButton}
                    >
                        {selectMode ? "Cancel Selection" : "Select"}
                    </Button>
                </Box>

                {/* 照片列表 */}
                <TableContainer
                    component={Paper}
                    sx={styles.tableContainer}
                >
                    <Table stickyHeader sx={styles.table}>
                        <TableHead>
                            <TableRow>
                                {selectMode && (
                                    <TableCell
                                        padding="checkbox"
                                        sx={styles.headerCheckboxCell}
                                    >
                                        <Checkbox
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            indeterminate={
                                                photos.some((p) => p.selected) &&
                                                !photos.every((p) => p.selected)
                                            }
                                            sx={styles.checkbox}
                                        />
                                    </TableCell>
                                )}
                                <TableCell sx={styles.headerCell(120)}>
                                    Photo
                                </TableCell>
                                <TableCell sx={styles.headerCell(180)}>
                                    Building Address
                                </TableCell>
                                <TableCell sx={styles.headerCell(150)}>
                                    Upload User
                                </TableCell>
                                <TableCell sx={styles.headerCell(180)}>
                                    Upload Time
                                </TableCell>
                                <TableCell sx={styles.headerCell(150)}>
                                    Review Result
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {photos.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        {...styles.noDataCell(selectMode)}
                                    >
                                        <Typography sx={styles.noDataText}>
                                            No pending photos for review, click 'Fetch Photos' to get data
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                photos.map((photo, index) => (
                                    <TableRow
                                        key={photo.photo_id}
                                        sx={styles.tableRow(selectMode, !!photo.selected)}
                                    >
                                        {selectMode && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={!!photo.selected}
                                                    onChange={() => togglePhotoSelection(photo.photo_id)}
                                                    sx={styles.checkbox}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell sx={styles.imageCell}>
                                            <img
                                                src={photo.image_url}
                                                alt="Building Photo"
                                                style={styles.image}
                                                onClick={() => handleImageClick(photo)}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={styles.addressText}
                                            >
                                                Building ID: {photo.building_addr}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={styles.userText}
                                            >
                                                {photo.username || photo.user_id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={styles.timeText}
                                            >
                                                {new Date(photo.upload_time).toLocaleString("zh-CN")}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={styles.actionButtonContainer}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() =>
                                                        handleSingleReview(photo.photo_id, "success")
                                                    }
                                                    disabled={loading}
                                                    sx={styles.approveButton}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() =>
                                                        handleSingleReview(photo.photo_id, "fail")
                                                    }
                                                    disabled={loading}
                                                    sx={styles.rejectButton}
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
                <Box sx={styles.statsContainer}>
                    <Typography
                        variant="body2"
                        sx={styles.statsText}
                    >
                        {photos.length > 0
                            ? `Currently showing ${photos.length} pending photos for review`
                            : "No photos loaded"
                        }
                    </Typography>
                    <Box sx={styles.bottomActionGroup}>
                        {selectMode && photos.some((p) => p.selected) && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => handleBatchReview("success")}
                                    disabled={loading}
                                    size="small"
                                    sx={styles.batchApproveButton}
                                >
                                    Batch Approve ({photos.filter((p) => p.selected).length})
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => handleBatchReview("fail")}
                                    disabled={loading}
                                    size="small"
                                    sx={styles.batchRejectButton}
                                >
                                    Batch Reject ({photos.filter((p) => p.selected).length})
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/dashboard")}
                            size="small"
                            sx={styles.exitButton}
                        >
                            Exit
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* 大图预览对话框 */}
            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                maxWidth={false}
                sx={styles.previewDialog}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }
                }}
            >
                <DialogContent sx={styles.previewContent}>
                    <IconButton
                        onClick={handleClosePreview}
                        sx={styles.closeButton}
                        size="large"
                    >
                        <CloseIcon />
                    </IconButton>

                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Photo Preview"
                            style={styles.previewImage}
                            onError={(e) => {
                                console.error("Preview image failed to load");
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );

};

export default PhotoReview;