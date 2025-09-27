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
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery } from "@mui/material";
import pageBackgroundStyles from "./pageBackgroundStyles";


// Represents a single uploaded photo item with metadata
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
// Represents the structure of the API response for paginated photo data
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
    const [selectedItem, setSelectedItem] = useState<UploadItem | null>(null);// const navigate = useNavigate();
    const [originalUploads, setOriginalUploads] = useState<UploadItem[]>([]);
    const [searchResults, setSearchResults] = useState<UploadItem[]>([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const theme = useTheme();//
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));//
    const PAGE_SIZE = 10;
    // List of possible status values used for filtering or display
    const statusOptions = ["all", "pending", "reviewing", "approved", "rejected"];
    // Mapping of status values to corresponding color types for UI components
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
            // Automatically perform searches when search terms change
            if (searchTerm.trim()) {
                const searchLower = searchTerm.toLowerCase();
                const results = originalUploads.filter(item => {
                    const addressMatch = item.building_addr?.toLowerCase().includes(searchLower);
                    return addressMatch;
                });
                setSearchResults(results);
                setIsSearchActive(true);
            } else {
                // Restore original data when clearing search
                setIsSearchActive(false);
                setSearchResults([]);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm, originalUploads]);

    // Pull the current user's upload history from the backend /photos/history interface
    // Supports paging, filtering status, and server-side search
    const fetchUploads = async () => {
        // Exit early if user ID is not available
        if (!user_id) return;
        // Set loading state and clear previous errors
        setLoading(true);
        setError(null);

        try {
            // Construct query parameters for the API request
            const params = new URLSearchParams({
                user_id,
                page: page.toString(),
                limit: PAGE_SIZE.toString(),
            });

            // Add server-side search parameters only when not in search mode.
            if (!isSearchActive && debouncedSearchTerm.trim()) {
                params.append("search", debouncedSearchTerm.trim());
            }
            // Add status filter if it's not set to "all"
            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }

            console.log("Fetching with params:", params.toString()); // Debug log
            // Send GET request to the backend API
            const response = await fetch(
                `http://127.0.0.1:8000/photos/history?${params.toString()}`
            );
            // Throw error if response is not successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse JSON response into expected structure
            const result: ApiResponse = await response.json();
            console.log("API Response:", result); // Debug log
            // If response contains valid photo array, update state
            if (result.photos && Array.isArray(result.photos)) {
                setUploads(result.photos);
                setOriginalUploads(result.photos);
                setTotal(result.total_count|| 0);
            } else {
                const uploadsData = Array.isArray(result) ? result : [];
                setUploads(uploadsData);
                setOriginalUploads(uploadsData);
                setTotal(uploadsData.length);
            }

        } catch (err) {
            // Handle fetch or parsing errors
            console.error("Failed to fetch upload history:", err);
            setError(t('uploadHistory.failedLoadMessage'));
            setUploads([]);
            setOriginalUploads([]);
            setTotal(0);
        } finally {
            // Reset loading state
            setLoading(false);
            // If search is active, re-filter results based on search term
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

    // Website-Suchfunktion
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setIsSearchActive(false);
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const results = originalUploads.filter(item => {
            // Searching building address
            const addressMatch = item.building_addr?.toLowerCase().includes(searchLower);
            return addressMatch;
        });

        setSearchResults(results);
        setIsSearchActive(true);

        console.log(`Search for "${searchTerm}" found ${results.length} results`);
    };

    // Highlight search text
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

    //Handling changes to the search input box
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);

    };

    // Clear search input
    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
        setIsSearchActive(false);
    };

    //Handling changes in status filtering
    const handleStatusFilterChange = (e: any) => {
        setStatusFilter(e.target.value);
        setPage(1);
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

    };
    //Status Display Formatting
    const getStatusDisplayName = (status: string) => {
        return t(`uploadHistory.statusOptions.${status}`as any);
    };


    // Retrieve the currently displayed data - Determine which data to display based on whether the system is in search mode.
    const getCurrentDisplayData = () => {
        if (isSearchActive) {
            // If in search mode, search results must also be filtered based on status.
            if (statusFilter === "all") {
                return searchResults;
            } else {
                return searchResults.filter(item => item.status === statusFilter);
            }
        } else {
            return uploads;
        }
    };

    // Get the total count of currently displayed data
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
                ...pageBackgroundStyles.container,
                p: 4,
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent:"content",
            }}
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Search and Filter Area */}
            <Box display="flex" gap={2} mb={2} sx={{ flexShrink: 0,width:"100%", }}>
                {!isMobile && (
                    <TextField
                    label={t('uploadHistory.searchLabel')}
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
                    placeholder={t('uploadHistory.searchPlaceholder')}
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
                                                {t('uploadHistory.clear')}
                                            </Typography>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={handleSearch}
                                            edge="end"
                                        >
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                                {t('uploadHistory.search')}
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
                    <InputLabel>{t('uploadHistory.filterLabel')}</InputLabel>
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

            {/* Search Results Tips */}
            {isSearchActive && (
                <Box sx={{ mb: 2 }}>
                    <Alert severity="info" sx={{ py: 1 }}>
                        {t('uploadHistory.resultPrefix')} {currentDisplayData.length} {t('uploadHistory.resultSuffix')} "{searchTerm}"
                        {/* {statusFilter !== "all" && ` with status "${getStatusDisplayName(statusFilter)}"`}*/}
                        {statusFilter !== "all" && (
                            <> {t('uploadHistory.statusPrefix')} "<strong>{getStatusDisplayName(statusFilter)}</strong>"</>
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

                                        {/* Context */}
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
                                        <TableCell>{t('uploadHistory.image')}</TableCell>
                                        <TableCell>{t('uploadHistory.buildingAddress')}</TableCell>
                                        <TableCell>{t('uploadHistory.filterLabel')}</TableCell>
                                        <TableCell>{t('uploadHistory.uploadedAt')}</TableCell>
                                        <TableCell>{t('uploadHistory.action')}</TableCell>
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
                                                        {t('uploadHistory.noImage')}
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
                                                    {t('uploadHistory.viewDetails')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {currentDisplayData.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="body2" color="textSecondary">
                                                    {isSearchActive ?
                                                        t('uploadHistory.noRecordFoundWithTerm', { searchTerm })
                                                        : t('uploadHistory.noRecordFound')
                                                    }
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Pagination - Adjust pagination logic based on search status */}
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

                    {/* Simple pagination prompt in search mode */}
                    {isSearchActive && currentDisplayData.length > 0 && (
                        <Box mt={2} display="flex" justifyContent="center">
                            <Typography variant="body2" color="textSecondary">
                                {t('uploadHistory.detailDialog.showingSearchResults', { count: currentDisplayData.length })}
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {/* Details Popup */}
            <Dialog
                open={detailOpen}
                onClose={handleDetailClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        maxHeight: '90vh',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle>{t('uploadHistory.detailDialog.title')}</DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <Box>
                            <Box mb={2}>
                                <Typography variant={isMobile ? "body2" : "subtitle2"} gutterBottom sx={{ wordBreak: 'break-word' }}>
                                    <strong>{t('uploadHistory.detailDialog.photoId')}:</strong> {highlightText(selectedItem.photo_id, searchTerm)}
                                </Typography>

                                <Typography>
                                    <strong>{t('uploadHistory.buildingAddress')}:</strong> {selectedItem.building_addr || "N/A"}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>{t('uploadHistory.filterLabel')}:</strong> {" "}
                                    <Chip
                                        label={getStatusDisplayName(selectedItem.status)}
                                        color={statusColorMap[selectedItem.status] || "default"}
                                        size="small"
                                    />
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    <strong>{t('uploadHistory.uploadedAt')}:</strong> {formatDate(selectedItem.upload_time)}
                                </Typography>
                                {selectedItem.lat && selectedItem.lng && (
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>{t('uploadHistory.detailDialog.location')}:</strong> {selectedItem.lat.toFixed(6)}, {selectedItem.lng.toFixed(6)}
                                    </Typography>
                                )}
                                {selectedItem.feedback && (
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>{t('uploadHistory.detailDialog.feedback')}:</strong> {selectedItem.feedback}
                                    </Typography>
                                )}
                                {selectedItem.review_time && (
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>{t('uploadHistory.detailDialog.reviewTime')}:</strong> {formatDate(selectedItem.review_time)}
                                    </Typography>
                                )}
                            </Box>

                            {selectedItem.image_url && (
                                <Box mt={2}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>{t('uploadHistory.image')}:</strong>
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
                        {t('uploadHistory.detailDialog.closeButton')}
                    </Button>

                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UploadHistory;