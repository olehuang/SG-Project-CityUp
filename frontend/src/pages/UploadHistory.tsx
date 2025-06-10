import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Chip,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
} from "@mui/material";
import { useAuthHook } from "../components/AuthProvider";

const PAGE_SIZE = 10;

const statusOptions = ["all", "pending", "reviewing", "approved", "rejected"];

const statusColorMap: Record<string, "default" | "success" | "error" | "warning"> = {
    pending: "default", //default color
    reviewing: "warning", // warning color yellow
    approved: "success", // success color green
    rejected: "error", // error color red
};

interface UploadItem {
    photo_id: string;
    user_id: string;
    building_addr?: string;
    lat?: number;
    lng?: number;
    upload_time: string;
    image_url?: string;
    status: string;
    feedback?: string;
    reviewer_id?: string;
    review_time?: string;
}

interface ApiResponse {
    photos: UploadItem[];
    total_count: number;
    page: number;
    limit: number;
    total_pages: number;
}

const UploadHistory: React.FC = () => {
    const { user_id } = useAuthHook();
    const [loading, setLoading] = useState(false); // Data loading state
    const [uploads, setUploads] = useState<UploadItem[]>([]); // Store upload records
    const [total, setTotal] = useState(0); // Total number of records (for paging)
    const [searchTerm, setSearchTerm] = useState(""); // Content of the search box
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Debounced search term
    const [statusFilter, setStatusFilter] = useState("all"); // Filter status (defaults to "all")
    const [page, setPage] = useState(1); // current page number (default page 1 of 1)
    const [error, setError] = useState<string | null>(null); // error message

    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<UploadItem | null>(null);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchUploads = async () => {
        if (!user_id) return;

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                user_id,
                page: page.toString(),
                limit: PAGE_SIZE.toString(),
            });

            if (debouncedSearchTerm.trim()) {
                params.append("search", debouncedSearchTerm.trim());
            }

            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }

            console.log("Fetching with params:", params.toString()); // Debug log

            const response = await fetch(
                `http://127.0.0.1:8000/photos/history?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ApiResponse = await response.json();
            console.log("API Response:", result); // Debug log

            // 适配新的API响应格式
            if (result.photos && Array.isArray(result.photos)) {
                setUploads(result.photos);
                setTotal(result.total_count|| 0);
            } else {
                // 兼容旧的API响应格式
                setUploads(Array.isArray(result) ? result : []);
                setTotal(Array.isArray(result) ? result.length : 0);
            }

        } catch (err) {
            console.error("Failed to fetch upload history:", err);
            setError("Failed to load upload history. Please try again.");
            setUploads([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploads();
    }, [user_id, page, debouncedSearchTerm, statusFilter]);


    //When the user clicks the View button, a Dialog pops up showing the upload details.
    //SelectedItem Stores the currently selected upload record.
    const handleDetailOpen = (item: UploadItem) => {
        setSelectedItem(item);
        setDetailOpen(true);
    };

    const handleDetailClose = () => {
        setDetailOpen(false);
        setSelectedItem(null);
    };

    //Handling changes to the search input box
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // 重置到第一页
    };
    //Handling changes in status filtering
    const handleStatusFilterChange = (e: any) => {
        setStatusFilter(e.target.value);
        setPage(1); // 重置到第一页
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return "Invalid date";
        }
    };
    //Status Display Formatting
    const getStatusDisplayName = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <Box
            sx={{
                p: 4,
                height: '100vh',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography variant="h5" gutterBottom>
                Upload History
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {/* Let users search for uploaded records by building address. */}
            <Box display="flex" gap={2} mb={2} sx={{ flexShrink: 0 }}>
                <TextField
                    label="Search by building address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Enter building address to search..."
                />
                {/* Status filter drop-down menu */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={handleStatusFilterChange}
                    >
                        {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                                {getStatusDisplayName(status)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* 表格数据 */}
                    <TableContainer
                        component={Paper}
                        sx={{
                            flex: 1,
                            overflow: 'auto',
                            maxHeight: 'calc(100vh - 300px)' // 为搜索框、标题和分页留出空间
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Building Address</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Uploaded At</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {uploads.map((item) => (
                                    <TableRow key={item.photo_id}>
                                        <TableCell>
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt="upload"
                                                    style={{
                                                        width: 100,
                                                        height: 60,
                                                        objectFit: "cover",
                                                        borderRadius: 4,
                                                        border: "1px solid #ddd"
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/api/placeholder/100/60";
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        width: 100,
                                                        height: 60,
                                                        backgroundColor: "#f5f5f5",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: 1,
                                                        border: "1px solid #ddd"
                                                    }}
                                                >
                                                    No Image
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {item.building_addr || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={getStatusDisplayName(item.status)}
                                                color={statusColorMap[item.status] || "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(item.upload_time)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleDetailOpen(item)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {uploads.length === 0 && !loading && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body2" color="textSecondary">
                                                No records found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {total > PAGE_SIZE && (
                        <Box mt={2} display="flex" justifyContent="center">
                            <Pagination
                                count={Math.ceil(total / PAGE_SIZE)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </>
            )}

            {/* 详情弹窗 */}
            <Dialog
                open={detailOpen}
                onClose={handleDetailClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        maxHeight: '90vh', // 限制弹窗最大高度
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle>Upload Details</DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <Box>
                            <Box mb={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>Photo ID:</strong> {selectedItem.photo_id}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>Building Address:</strong> {selectedItem.building_addr || "N/A"}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>Status:</strong> {" "}
                                    <Chip
                                        label={getStatusDisplayName(selectedItem.status)}
                                        color={statusColorMap[selectedItem.status] || "default"}
                                        size="small"
                                    />
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>Uploaded At:</strong> {formatDate(selectedItem.upload_time)}
                                </Typography>
                                {selectedItem.lat && selectedItem.lng && (
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Location:</strong> {selectedItem.lat.toFixed(6)}, {selectedItem.lng.toFixed(6)}
                                    </Typography>
                                )}
                                {selectedItem.feedback && (
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Feedback:</strong> {selectedItem.feedback}
                                    </Typography>
                                )}
                                {selectedItem.review_time && (
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Review Time:</strong> {formatDate(selectedItem.review_time)}
                                    </Typography>
                                )}
                            </Box>

                            {selectedItem.image_url && (
                                <Box mt={2}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Image:</strong>
                                    </Typography>
                                    <img
                                        src={selectedItem.image_url}
                                        alt="detail"
                                        style={{
                                            width: "100%",
                                            maxHeight: 400,
                                            objectFit: "contain",
                                            borderRadius: 8,
                                            border: "1px solid #ddd"
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailClose} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UploadHistory;