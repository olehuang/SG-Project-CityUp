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
    IconButton,
    FormControlLabel,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import pageBackgroundStyles from "./pageBackgroundStyles";
import { useNavigate } from "react-router-dom";
import { useAuthHook } from "../components/AuthProvider";
import { photoReviewStyles } from "./PhotoReviewStyles";
import axios from "axios"
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme, Card, CardContent, CardMedia, CardActions } from "@mui/material";//

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
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [selectMode, setSelectMode] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    // Preview state
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewPhotoInfo, setPreviewPhotoInfo] = useState<PhotoItem | null>(null);

    const navigate = useNavigate();
    const { auth, user_id } = useAuthHook();
    const { t } = useTranslation();

    // Handle image preview open
    const handleImageClick = (photo: PhotoItem) => {
        setPreviewImage(photo.image_url);
        setPreviewPhotoInfo(photo);
        setPreviewOpen(true);
    };

    // Close preview dialog
    const handleClosePreview = () => {
        setPreviewOpen(false);
        setPreviewImage("");
        setPreviewPhotoInfo(null);
    };

    const theme = useTheme(); //
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));//

    // Fetch photos from backend
    const fetchPhotos = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`http://127.0.0.1:8000/photos/review/batch_fetch?reviewer_id=${user_id}`, { method: "GET" });
            if (!res.ok) {
                if (res.status === 404) {
                    setError(t('photoReview.noPhotosPendingReview'));
                    setPhotos([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: PhotoItem[] = await res.json();

            console.log("Fetched photo data:", data);

            // Add selection flag
            const photosWithSelected = data.map(photo => ({
                ...photo,
                selected: false
            }));
            setPhotos(photosWithSelected);
            setSuccess(t('photoReview.photosFetchedSuccess', { count: data.length }));
        } catch (err) {
            console.error("Failed to fetch photos", err);
            setError(t('photoReview.fetchPhotosFailed'));
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle single photo review
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

            // Remove reviewed photos from list
            setPhotos((prev) => prev.filter((photo) => photo.photo_id !== photo_id));
            setSuccess(result === "success" ? t('photoReview.photoReviewedSuccess') : t('photoReview.photoReviewedRejected'));
        } catch (err) {
            console.error("Single review failed", err);
            setError(t('photoReview.singleReviewFailed'));
        } finally {
            setLoading(false);
        }
    };

    // Handle batch review
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

            // Remove reviewed photos from list
            setPhotos((prev) => prev.filter((p) => !p.selected));
            setSuccess(result === "success"
                ? t('photoReview.batchReviewApprovedSuccess', { count: selectedIds.length })
                : t('photoReview.batchReviewRejectedSuccess', { count: selectedIds.length }));

            setSelectAll(false);
            setSelectMode(false);
        } catch (err) {
            console.error("Batch review failed", err);
            setError(t('photoReview.batchReviewFailed'));
        } finally {
            setLoading(false);
        }
    };

    // Release photos when page unloads
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

    // Toggle "Select All"
    const toggleSelectAll = () => {
        const newSelect = !selectAll;
        setSelectAll(newSelect);
        setPhotos((prev) => prev.map((p) => ({ ...p, selected: newSelect })));
    };

    // Toggle selection mode
    const toggleSelectMode = () => {
        setSelectMode((prev) => !prev);
        if (selectMode) {
            // Clear all selections when exiting selection mode
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

        //Check if all photos are selected
        const updatedPhotos = photos.map((p) =>
            p.photo_id === photo_id ? { ...p, selected: !p.selected } : p
        );
        const allSelected = updatedPhotos.every(p => p.selected);
        setSelectAll(allSelected);
    };

    // Clear error/success messages after 3s
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
        <Box sx={photoReviewStyles.mainContainer}>
            <Box sx={photoReviewStyles.contentWrapper}>
                <Box sx={photoReviewStyles.topActionContainer}>
                    <Box sx={photoReviewStyles.leftActionGroup}>
                        <Button
                            variant="contained"
                            onClick={fetchPhotos}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                            sx={photoReviewStyles.fetchButton}
                        >
                            {loading ? t("photoReview.fetching") : t("photoReview.fetch")}
                        </Button>

                        {(error || success) && (
                            <Alert
                                severity={error ? "error" : "success"}
                                sx={photoReviewStyles.alert(!!error)}
                            >
                                {error || success}
                            </Alert>
                        )}
                    </Box>

                    <Button
                        variant="outlined"
                        onClick={toggleSelectMode}
                        disabled={photos.length === 0}
                        sx={photoReviewStyles.selectButton}
                    >
                        {selectMode ? t("photoReview.cancelSelection") : t("photoReview.select")}
                    </Button>
                </Box>
                {isMobile ? (
                        // Card display: mobile
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Select All Button*/}
                            {selectMode && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            indeterminate={
                                                photos.some((p) => p.selected) && !photos.every((p) => p.selected)
                                            }
                                            size="small"
                                        />
                                    }
                                    label="Select All"
                                    sx={{ ml: 1 }}
                                />
                            )}
                            {photos.length === 0 ? (
                                <Typography sx={photoReviewStyles.noDataText}>
                                    No pending photos for review, click 'Fetch Photos' to get data
                                </Typography>
                            ) : (
                                photos.map((photo) => (
                                    <Card key={photo.photo_id} sx={{ position: 'relative' }}>
                                        {selectMode && (
                                            <Checkbox
                                                checked={!!photo.selected}
                                                onChange={() => togglePhotoSelection(photo.photo_id)}
                                                sx={{ position: 'absolute', top: 8, right: 8 }}
                                            />
                                        )}

                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={photo.image_url}
                                            alt="Building Photo"
                                            onClick={() => handleImageClick(photo)}
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        />

                                        <CardContent>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Address:</strong> {photo.building_addr}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Uploader:</strong> {photo.username || photo.user_id}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Uploaded At:</strong>{" "}
                                                {new Intl.DateTimeFormat("de-DE", {
                                                    timeZone: "Europe/Berlin",
                                                    dateStyle: "medium",
                                                    timeStyle: "medium",
                                                }).format(new Date(photo.upload_time + (photo.upload_time.includes('Z') || photo.upload_time.includes('+') ? '' : 'Z')))}
                                            </Typography>
                                        </CardContent>

                                        <CardActions sx={{ justifyContent: 'flex-end', gap: 1, px: 2, pb: 2 }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleSingleReview(photo.photo_id, "success")}
                                                disabled={loading}
                                                sx={photoReviewStyles.approveButton}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleSingleReview(photo.photo_id, "fail")}
                                                disabled={loading}
                                                sx={photoReviewStyles.rejectButton}
                                            >
                                                Reject
                                            </Button>
                                        </CardActions>
                                    </Card>
                                ))
                            )}
                        </Box>
                    ) :

                    (
                        <TableContainer
                    component={Paper}
                    sx={photoReviewStyles.tableContainer}
                >
                    <Table stickyHeader sx={photoReviewStyles.table}>
                        <TableHead>
                            <TableRow>
                                {selectMode && (
                                    <TableCell
                                        padding="checkbox"
                                        sx={photoReviewStyles.headerCheckboxCell}
                                    >
                                        <Checkbox
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            indeterminate={
                                                photos.some((p) => p.selected) &&
                                                !photos.every((p) => p.selected)
                                            }
                                            sx={photoReviewStyles.checkbox}
                                        />
                                    </TableCell>
                                )}
                                <TableCell sx={photoReviewStyles.headerCell(120)}>
                                    {t('photoReview.photo')}
                                </TableCell>
                                <TableCell sx={photoReviewStyles.headerCell(180)}>
                                    {t('photoReview.address')}
                                </TableCell>
                                <TableCell sx={photoReviewStyles.headerCell(150)}>
                                    {t('photoReview.user')}
                                </TableCell>
                                <TableCell sx={photoReviewStyles.headerCell(180)}>
                                    {t('photoReview.time')}
                                </TableCell>
                                <TableCell sx={photoReviewStyles.headerCell(150)}>
                                    {t('photoReview.result')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {photos.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        {...photoReviewStyles.noDataCell(selectMode)}
                                    >
                                        <Typography sx={photoReviewStyles.noDataText}>
                                            {t('photoReview.noData')}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                photos.map((photo, index) => (
                                    <TableRow
                                        key={photo.photo_id}
                                        sx={photoReviewStyles.tableRow(selectMode, !!photo.selected)}
                                    >
                                        {selectMode && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={!!photo.selected}
                                                    onChange={() => togglePhotoSelection(photo.photo_id)}
                                                    sx={photoReviewStyles.checkbox}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell sx={photoReviewStyles.imageCell}>
                                            <Box
                                                sx={photoReviewStyles.imageBox}
                                                onClick={() => handleImageClick(photo)}
                                            >
                                                <img
                                                    src={photo.image_url}
                                                    alt="Building Photo"
                                                    style={photoReviewStyles.imageInner}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={photoReviewStyles.addressText}
                                            >
                                                {photo.building_addr}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={photoReviewStyles.userText}
                                            >
                                                {photo.username || photo.user_id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={photoReviewStyles.timeText}
                                            >
                                                {new Intl.DateTimeFormat("de-DE", {
                                                    timeZone: "Europe/Berlin",
                                                    dateStyle: "medium",
                                                    timeStyle: "medium",
                                                }).format(new Date(photo.upload_time
                                                    + (photo.upload_time.includes('Z')
                                                    || photo.upload_time.includes('+') ? '' : 'Z')))}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={photoReviewStyles.actionButtonContainer}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() =>
                                                        handleSingleReview(photo.photo_id, "success")
                                                    }
                                                    disabled={loading}
                                                    sx={photoReviewStyles.approveButton}
                                                >
                                                    {t('photoReview.approve')}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() =>
                                                        handleSingleReview(photo.photo_id, "fail")
                                                    }
                                                    disabled={loading}
                                                    sx={photoReviewStyles.rejectButton}
                                                >
                                                    {t('photoReview.reject')}
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer> )}

                {/* Statistical information */}
                <Box sx={photoReviewStyles.statsContainer}>
                    <Typography
                        variant="body2"
                        sx={photoReviewStyles.statsText}
                    >
                        {photos.length > 0
                            ? t('photoReview.currentPhotos', { count: photos.length })
                            : t('photoReview.noPhotos')
                        }
                    </Typography>
                    <Box sx={photoReviewStyles.bottomActionGroup}>
                        {selectMode && photos.some((p) => p.selected) && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => handleBatchReview("success")}
                                    disabled={loading}
                                    size="small"
                                    sx={photoReviewStyles.batchApproveButton}
                                >
                                    {t('photoReview.batchApprove', { count: photos.filter((p) => p.selected).length })}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => handleBatchReview("fail")}
                                    disabled={loading}
                                    size="small"
                                    sx={photoReviewStyles.batchRejectButton}
                                >
                                    {t('photoReview.batchReject', { count: photos.filter((p) => p.selected).length })}
                                </Button>
                            </>
                        )}

                    </Box>
                </Box>
            </Box>

            {/* Large Image Preview Dialog Box */}
            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                maxWidth={false}
                sx={photoReviewStyles.previewDialog}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }
                }}
            >
                <DialogContent sx={photoReviewStyles.previewContent}>
                    <IconButton
                        onClick={handleClosePreview}
                        sx={photoReviewStyles.closeButton}
                        size="large"
                    >
                        <CloseIcon />
                    </IconButton>

                    {previewImage && (
                        <Box
                            component="img"
                            src={previewImage}
                            alt="Photo Preview"
                            sx={photoReviewStyles.previewImage}
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
