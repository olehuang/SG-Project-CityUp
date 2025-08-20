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
    DialogActions,
    Alert,
    InputAdornment,
    IconButton,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useAuthHook } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery } from "@mui/material";

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
    // const navigate = useNavigate();
    // 新增 搜索结果状态和原始数据缓存
    const [originalUploads, setOriginalUploads] = useState<UploadItem[]>([]);
    const [searchResults, setSearchResults] = useState<UploadItem[]>([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const theme = useTheme();//
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));//

    const PAGE_SIZE = 10;
    const statusOptions = ["all", "pending", "reviewing", "approved", "rejected"];
    const statusColorMap: Record<string, "default" | "success" | "error" | "warning"> = {
        pending: "default", //default color
        reviewing: "warning", // warning color yellow
        approved: "success", // success color green
        rejected: "error", // error color red
    };

    const { t } = useTranslation();
    // Debounce search term - 【修改】增加自动搜索触发
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            // 【新增】当搜索词变化时自动执行搜索
            if (searchTerm.trim()) {
                // 直接在这里执行搜索逻辑，而不是调用handleSearch
                const searchLower = searchTerm.toLowerCase();
                const results = originalUploads.filter(item => {
                    const addressMatch = item.building_addr?.toLowerCase().includes(searchLower);
                    return addressMatch;
                });
                setSearchResults(results);
                setIsSearchActive(true);
            } else {
                // 【新增】清空搜索时恢复原始数据
                setIsSearchActive(false);
                setSearchResults([]);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm, originalUploads]);

    // Pull the current user's upload history from the backend /photos/history interface
    // Supports paging, filtering status, and server-side search
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

            // 【修改】仅在非搜索状态下才添加服务端搜索参数
            if (!isSearchActive && debouncedSearchTerm.trim()) {
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
                // 【新增】缓存原始数据用于客户端搜索
                setOriginalUploads(result.photos);
                setTotal(result.total_count|| 0);
            } else {
                // 兼容旧的API响应格式
                const uploadsData = Array.isArray(result) ? result : [];
                setUploads(uploadsData);
                setOriginalUploads(uploadsData);
                setTotal(uploadsData.length);
            }

        } catch (err) {
            console.error("Failed to fetch upload history:", err);
            setError("Failed to load upload history. Please try again.");
            setUploads([]);
            setOriginalUploads([]);
            setTotal(0);
        } finally {
            setLoading(false);
            // 如果当前处于搜索状态，重新执行搜索
            if (isSearchActive && searchTerm.trim()) {
                setTimeout(() => {
                    const searchLower = searchTerm.toLowerCase();
                    const results = originalUploads.filter(item => {
                        const addressMatch = item.building_addr?.toLowerCase().includes(searchLower);
                        return addressMatch;
                    });
                    setSearchResults(results);
                }, 100);
            }
        }
    };

    useEffect(() => {
        fetchUploads();
    }, [user_id, page, statusFilter]); // Triggers a data reload when the user ID, current page, or status filter changes;

    // 【新增】Website-Suchfunktion
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setIsSearchActive(false);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const results = originalUploads.filter(item => {
            // 搜索建筑地址
            const addressMatch = item.building_addr?.toLowerCase().includes(searchLower);
            // 搜索状态
            //const statusMatch = item.status.toLowerCase().includes(searchLower);
            // 搜索photo_id
            //const photoIdMatch = item.photo_id.toLowerCase().includes(searchLower);
            // 搜索反馈内容
            //const feedbackMatch = item.feedback?.toLowerCase().includes(searchLower);

            //return addressMatch || statusMatch || photoIdMatch || feedbackMatch;
            return addressMatch;
        });

        setSearchResults(results);
        setIsSearchActive(true);

        console.log(`Search for "${searchTerm}" found ${results.length} results`);
    };

    // 【新增】高亮显示搜索文本
    const highlightText = (text: string, searchTerm: string) => {
        if (!searchTerm.trim() || !isSearchActive) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = text.split(regex);

        return (
            <>
                {parts.map((part, index) =>
                    regex.test(part) ? (
                        <span
                            key={index}
                            style={{
                                backgroundColor: '#ffeb3b',
                                padding: '0 2px',
                                borderRadius: '2px',
                                fontWeight: 'bold'
                            }}
                        >
                        {part}
                    </span>
                    ) : (
                        <span key={index}>{part}</span>
                    )
                )}
            </>
        );
    };

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

    //Handling changes to the search input box - 【修改】移除自动重置页面逻辑
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // 【修改】移除自动重置页面，改为在搜索时处理
    };

    // 【新增】清除搜索功能
    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
        setIsSearchActive(false);
    };

    //Handling changes in status filtering
    const handleStatusFilterChange = (e: any) => {
        setStatusFilter(e.target.value);
        setPage(1); // 重置到第一页
        // 【新增】状态筛选时，如果有搜索则重新搜索
        if (isSearchActive && searchTerm.trim()) {
            setTimeout(() => handleSearch(), 100);
        }
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const formatDate = (dateString: string) => {
        try {
            const timeStr =
                dateString.includes("Z") || dateString.includes("+")
                    ? dateString
                    : dateString + "Z";

            return new Intl.DateTimeFormat("de-DE", {
                timeZone: "Europe/Berlin",
                dateStyle: "medium",
                timeStyle: "short",
                hour12: false,
            }).format(new Date(timeStr));
        } catch {
            return "Invalid date";
        }

        //try {
          //  return new Date(dateString).toLocaleString();
        //} catch {
          //  return "Invalid date";
        //}
    };
    //Status Display Formatting
    const getStatusDisplayName = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    // 【新增】获取当前显示的数据 - 根据是否在搜索状态决定显示哪些数据
    const getCurrentDisplayData = () => {
        if (isSearchActive) {
            // 如果在搜索状态，还需要根据状态筛选搜索结果
            if (statusFilter === "all") {
                return searchResults;
            } else {
                return searchResults.filter(item => item.status === statusFilter);
            }
        } else {
            return uploads;
        }
    };

    // 【新增】获取当前显示数据的总数
    const getCurrentTotal = () => {
        if (isSearchActive) {
            return getCurrentDisplayData().length;
        } else {
            return total;
        }
    };

    const currentDisplayData = getCurrentDisplayData();
    const currentTotal = getCurrentTotal();

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
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* 【修改】搜索和筛选区域 - 改进搜索框UI和功能 */}
            <Box display="flex" gap={2} mb={2} sx={{ flexShrink: 0 }}>
                {!isMobile && (
                    <TextField
                    label="Search by building address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    placeholder="Enter search term..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {searchTerm && (
                                    <>
                                        <IconButton
                                            size="small"
                                            onClick={handleClearSearch}
                                            edge="end"
                                            sx={{ mr: 0.5 }}
                                        >
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                                Clear
                                            </Typography>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={handleSearch}
                                            edge="end"
                                        >
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                                Search
                                            </Typography>
                                        </IconButton>
                                    </>
                                )}
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                        }
                    }}
                    />
                )}

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

            {/* 【新增】搜索结果提示 */}
            {isSearchActive && (
                <Box sx={{ mb: 2 }}>
                    <Alert severity="info" sx={{ py: 1 }}>
                        Found {currentDisplayData.length} result{currentDisplayData.length !== 1 ? 's' : ''} for "{searchTerm}"
                        {/* {statusFilter !== "all" && ` with status "${getStatusDisplayName(statusFilter)}"`}*/}
                        {statusFilter !== "all" && (
                            <> with status "<strong>{getStatusDisplayName(statusFilter)}</strong>"</>
                        )}

                    </Alert>
                </Box>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {isMobile ? (
                        <Box display="flex" flexDirection="column" gap={2}>
                            {currentDisplayData.map(item => (
                                <Paper key={item.photo_id} elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                    <Box onClick={() => handleDetailOpen(item)} sx={{ cursor: 'pointer' }}>
                                        {/* 图片展示 */}
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt="upload"
                                                style={{
                                                    width: "100%",
                                                    height: 180,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                    border: "1px solid #ddd"
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.src = "/api/placeholder/150/100";
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    height: 180,
                                                    backgroundColor: "#f5f5f5",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: 2
                                                }}
                                            >
                                                No Image
                                            </Box>
                                        )}

                                        {/* 信息区域 */}
                                        <Box mt={2}>
                                            <Typography variant="body2" fontWeight="bold">
                                                {item.building_addr
                                                    ? highlightText(item.building_addr, searchTerm)
                                                    : "N/A"}
                                            </Typography>
                                            <Chip
                                                label={getStatusDisplayName(item.status)}
                                                color={statusColorMap[item.status] || "default"}
                                                size="small"
                                                sx={{ mt: 1,pointerEvents: 'none' }}
                                            />
                                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                                                {formatDate(item.upload_time)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    ) : (
                        /* 原始 PC 表格保留 */
                        <TableContainer
                            component={Paper}
                            sx={{
                                flex: 1,
                                overflow: "auto",
                                maxHeight: "calc(100vh - 300px)"
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
                                    {currentDisplayData.map((item) => (
                                        <TableRow key={item.photo_id}>
                                            <TableCell>
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt="upload"
                                                        style={{
                                                            width: 150,
                                                            height: 100,
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
                                                            width: 150,
                                                            height: 100,
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
                                                {item.building_addr ? highlightText(item.building_addr, searchTerm) : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusDisplayName(item.status)}
                                                    color={statusColorMap[item.status] || "default"}
                                                    size="small"
                                                    sx={{ pointerEvents: 'none' }}
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(item.upload_time)}</TableCell>
                                            <TableCell>
                                                <Button size="small" variant="outlined" onClick={() => handleDetailOpen(item)}>
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {currentDisplayData.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="body2" color="textSecondary">
                                                    {isSearchActive
                                                        ? `No records found matching "${searchTerm}".`
                                                        : "No records found."}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* 【修改】分页 - 根据搜索状态调整分页逻辑 */}
                    {!isSearchActive && currentTotal > PAGE_SIZE && (
                        <Box mt={2} display="flex" justifyContent="center">
                            <Pagination
                                count={Math.ceil(currentTotal / PAGE_SIZE)}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                                size="small"
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    )}

                    {/* 【新增】搜索模式下的简单分页提示 */}
                    {isSearchActive && currentDisplayData.length > 0 && (
                        <Box mt={2} display="flex" justifyContent="center">
                            <Typography variant="body2" color="textSecondary">
                                Showing all {currentDisplayData.length} search results
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {/* 详情弹窗 - 【修改】增加搜索高亮 */}
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
                                <Typography variant={isMobile ? "body2" : "subtitle2"} gutterBottom sx={{ wordBreak: 'break-word' }}>
                                    <strong>Photo ID:</strong> ...
                                </Typography>

                                <Typography>
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
                                            maxHeight: 500,
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