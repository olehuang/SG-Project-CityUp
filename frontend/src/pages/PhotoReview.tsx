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


interface PhotoItem {
    photo_id: string;
    user_id: string;
    building_id: string;
    upload_time: string;
    image_url: string;
    status: string;
    feedback?: string;
    selected?: boolean;
}

const PhotoReview = () => {
    // const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [photos, setPhotos] = useState<PhotoItem[]>([
        {
            photo_id: "test1",
            user_id: "user001",
            building_id: "building001",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
        {
            photo_id: "test2",
            user_id: "user002",
            building_id: "building002",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
        {
            photo_id: "test3",
            user_id: "user003",
            building_id: "building003",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
        {
            photo_id: "test4",
            user_id: "user004",
            building_id: "building002",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
        {
            photo_id: "test5",
            user_id: "user005",
            building_id: "building002",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
        {
            photo_id: "test6",
            user_id: "user006",
            building_id: "building002",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
        {
            photo_id: "test7",
            user_id: "user002",
            building_id: "building007",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
        {
            photo_id: "test8",
            user_id: "user008",
            building_id: "building008",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
        {
            photo_id: "test9",
            user_id: "user009",
            building_id: "building008",
            upload_time: new Date().toISOString(),
            image_url: "https://via.placeholder.com/150",
            status: "Pending",
            selected: false,
        },
    ]);
    const [selectMode, setSelectMode] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const navigate = useNavigate();

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            setError("");

            // 调用后端的批量获取待审核照片接口
            const res = await fetch("/photos/review/batch_fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // 可以指定批量大小，默认30
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                if (res.status === 404) {
                    setError("暂无待审核照片");
                    setPhotos([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: PhotoItem[] = await res.json();
            console.log("获取到的照片数据:", data);

            // 为每个照片添加selected属性
            const photosWithSelected = data.map(photo => ({
                ...photo,
                selected: false
            }));

            setPhotos(photosWithSelected);
            setSuccess(`成功获取 ${data.length} 张待审核照片`);
        } catch (err) {
            console.error("获取照片失败", err);
            setError("获取照片失败，请检查网络连接或服务器状态");
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSingleReview = async (photo_id: string, result: "success" | "fail") => {
        try {
            setLoading(true);
            setError("");

            // 根据result确定状态
            const status = result === "success" ? "Reviewed" : "Reviewed";
            const feedback = result === "success" ? "审核通过" : "审核未通过";

            const res = await fetch("/photos/review/single", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    photo_id: photo_id,
                    status: status,
                    feedback: feedback
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            // 从列表中移除已审核的照片
            setPhotos((prev) => prev.filter((photo) => photo.photo_id !== photo_id));
            setSuccess(`照片审核${result === "success" ? "通过" : "失败"}，已从列表中移除`);
        } catch (err) {
            console.error("单个审核失败", err);
            setError("审核失败，请重试");
        } finally {
            setLoading(false);
        }
    };

    const handleBatchReview = async (result: "success" | "fail") => {
        const selectedPhotos = photos.filter((p) => p.selected);

        if (selectedPhotos.length === 0) {
            setError("请先选择要审核的照片");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const selectedIds = selectedPhotos.map((p) => p.photo_id);

            const res = await fetch("/photos/review/batch_submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ids: selectedIds,
                    result: result,
                    feedback: result === "success" ? "批量审核通过" : "批量审核未通过"
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            // 从列表中移除已审核的照片
            setPhotos((prev) => prev.filter((p) => !p.selected));
            setSuccess(`批量审核${result === "success" ? "通过" : "失败"} ${selectedIds.length} 张照片`);

            // 重置选择状态
            setSelectAll(false);
            setSelectMode(false);
        } catch (err) {
            console.error("批量审核失败", err);
            setError("批量审核失败，请重试");
        } finally {
            setLoading(false);
        }
    };

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
                {/* 消息提示 */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button
                            variant="contained"
                            onClick={fetchPhotos}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? "拉取中..." : "Fetch Photos"}
                        </Button>

                        {/* 错误和成功消息显示在按钮右侧 */}
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
                                                Building ID: {photo.building_id}
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
                {/* 底部区域 - 始终显示 */}
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
                    {/* 左侧：统计信息 */}
                    <Typography variant="body2" color="text.secondary">
                        {photos.length > 0
                            ? `Currently showing ${photos.length} pending photos for review`
                            : "No photos loaded"
                        }
                    </Typography>

                    {/* 右侧：操作按钮 - 在同一行 */}
                    <Box display="flex" gap={1} alignItems="center">
                        {/* 批量操作按钮 - 条件显示 */}
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

                        {/* Exit 按钮 - 始终显示 */}
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