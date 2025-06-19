import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    Divider,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useAuthHook } from "../components/AuthProvider";
import KeycloakClient from "../components/keycloak";

const Tutorial = () => {
    const drawerWidth = 240;
    const { token } = useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedSection, setSelectedSection] = useState("Tutorial");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);

    // Take user from KeycloakClient and if token exist take into roles
    useEffect(() => {
        const fetchRoles = async () => {
            const userInfo = await KeycloakClient.extractUserInfo(token);
            setRoles(userInfo?.roles || []);
            console.log(userInfo?.roles);
        };
        if (token !== null && token !== undefined) {
            fetchRoles();
        }
    }, [token]);

    const sections = [
        "Tutorial",
        "Photograph",
        "Photo Upload",
        "Upload History",
        "Building Information",
        "FAQ",
        ...(roles.includes("admin") ? ["Photo Review", "User Management"] : [])
    ];

    // Search Keywords Daten
    const searchableContent = {
        "Photograph": [
            "photograph", "building", "visible", "well-lit", "blurry", "images", "take", "proper",
            "shadows", "lighting", "even", "natural", "distortion", "obstructions", "objects",
            "trees", "cars", "people", "blocking", "straight", "aligned", "perspective", "parallel", "accuracy"
        ],
        "Photo Upload": [
            "upload", "edit", "photos", "address", "relative", "enter"
        ],
        "Upload History": [
            "history", "view", "approved", "confirm", "upload"
        ],
        "Building Information": [
            "building", "information", "addresses", "relevant", "find"
        ],
        "Photo Review": [
            "review", "photo", "admin"
        ],
        "User Management": [
            "user", "management", "admin"
        ],
        "FAQ": [
            "faq", "frequently", "asked", "questions", "help", "common", "issues", "problems", "troubleshooting"
        ],
        "Tutorial": [
            "tutorial", "welcome", "cityup", "topic", "started", "select", "faq", "questions", "help"
        ]
    };

    // Based on the search content it looks for matches in the sections and searchableContent and updates the search results.
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        //Case insensitive search
        const results: string[] = [];
        const searchLower = searchTerm.toLowerCase();


        sections.forEach(section => {
            if (section.toLowerCase().includes(searchLower)) {
                results.push(section);
            }
        });

        // Deposit the matching name for page display
        Object.entries(searchableContent).forEach(([sectionName, keywords]) => {
            if (sections.includes(sectionName) && !results.includes(sectionName)) {
                const hasMatch = keywords.some(keyword =>
                    keyword.toLowerCase().includes(searchLower)
                );
                if (hasMatch) {
                    results.push(sectionName);
                }
            }
        });

        setSearchResults(results);

        // If there are any results, jump to the first result
        if (results.length > 0) {
            setSelectedSection(results[0]);
        }
    };

    //如若搜索更加智能，比如支持模糊匹配或者更宽泛的关键词搜索，Levenshtein Distance算法，提高模糊匹配能力 添加 debounce()，避免搜索频繁触发，优化性能 让搜索支持多个关键词，如 "photo blurry" 同时匹配多个结果

    // Highlighting text
    const highlightText = (text: string, searchTerm: string) => {
        if (!searchTerm.trim()) return text;

        //Global Match & Case Ignored
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            if (regex.test(part)) {
                return (
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
                );
            }
            return part;
        });
    };

    const renderContent = () => {
        switch (selectedSection) {
            case "Photograph":
                return (
                    <Box sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Photograph", searchTerm)}
                        </Typography>
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to take proper building photographs. Please follow these essential requirements:",
                                searchTerm
                            )}
                        </Typography>
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#4caf50', mr: 1, fontWeight: 'bold' }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>No shadows</strong> – {highlightText("Ensure the lighting is even and natural to avoid distortion.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#4caf50', mr: 1, fontWeight: 'bold' }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>No obstructions</strong> – {highlightText("The building should be fully visible, with no objects (trees, cars, people) blocking it.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#4caf50', mr: 1, fontWeight: 'bold' }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Straight and aligned perspective</strong> – {highlightText("Photos should be taken parallel to the building to maintain accuracy.", searchTerm)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );
            case "Photo Upload":
                return (
                    <Box sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Photo Upload", searchTerm)}
                        </Typography>
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to upload and edit the photos you take, as well as enter the address the photos correspond to. Follow these steps to ensure a smooth upload process:",
                                searchTerm
                            )}
                        </Typography>
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📍
                                </Typography>
                                <Typography variant="body1">
                                    <strong>1. Set your location</strong> – {highlightText("Enable map access or manually enter an address to position your location.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📷
                                </Typography>
                                <Typography variant="body1">
                                    <strong>2. Upload photos</strong> – {highlightText("Click 'Shooting and Upload' to upload one image. If you have multiple photos, click 'Album Upload' (up to 5 photos at a time).", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>3. Finalize upload</strong> – {highlightText("Once your photos are selected, click 'Submit' to complete the process.", searchTerm)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );
            case "Upload History":
                return (
                    <Box sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Upload History", searchTerm)}
                        </Typography>
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you'll learn how to search, filter, and navigate your photo upload history.",
                                searchTerm
                            )}
                        </Typography>
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    🔍
                                </Typography>
                                <Typography variant="body1">
                                    <strong>1. Search and filter photos</strong> – {highlightText("Use the address search to find uploaded photos, or apply the status filter to view photos based on their current state.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📷
                                </Typography>
                                <Typography variant="body1">
                                    <strong>2. View details</strong> – {highlightText("Click 'View Details' to access full information about a photo, including upload status.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📁
                                </Typography>
                                <Typography variant="body1">
                                    <strong>3. Navigate pagination</strong> – {highlightText("This page supports pagination. Photos are sorted from newest to oldest, with the most recently uploaded photos displayed at the top.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    🔙
                                </Typography>
                                <Typography variant="body1">
                                    <strong>4. Exit and return</strong> – {highlightText("To leave this section, use the sidebar menu on the left or click 'Return to Main Menu'.", searchTerm)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );

            case "Building Information":
                return (
                    <Box sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Building Information", searchTerm)}
                        </Typography>
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to search for building-related photo uploads and download images easily.",
                                searchTerm
                            )}
                        </Typography>
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    🔍
                                </Typography>
                                <Typography variant="body1">
                                    <strong>1. Search by address</strong> – {highlightText("Enter an address in the search bar to view the latest upload times and the number of photos related to that location.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📷
                                </Typography>
                                <Typography variant="body1">
                                    <strong>2. Download photos</strong> – {highlightText("Click on a photo from the right panel and then select the 'Download' button to save it.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📁
                                </Typography>
                                <Typography variant="body1">
                                    <strong>3. Manage multiple downloads</strong> – {highlightText("Multiple photos will be downloaded as a ZIP file, while single images will be saved in their original format.", searchTerm)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );
            case "Photo Review":
                return roles.includes("admin") ? (
                    <Box sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Photo Review", searchTerm)}
                        </Typography>
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this admin section, you can review and approve photos submitted by users.",
                                searchTerm
                            )}
                        </Typography>
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📥
                                </Typography>
                                <Typography variant="body1">
                                    <strong>1. Fetch user-uploaded photos</strong> – {highlightText("Click 'Fetch Photos' to load the images submitted by users for review.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>2. Approve or reject photos</strong> – {highlightText("Use the selection buttons to approve a single photo or multiple photos at once.", searchTerm)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    🔄
                                </Typography>
                                <Typography variant="body1">
                                    <strong>3. Understand status labels</strong> – {highlightText("Pending means the photo is awaiting review. Accept means the photo meets requirements and has the correct address information. If the photo does not meet upload guidelines or does not match the address details, click 'Reject'.", searchTerm)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ) : null;

            case "User Management":
                return roles.includes("admin") ? (
                    <Box sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("User Management", searchTerm)}
                        </Typography>
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this admin section, you can manage user accounts and permissions.",
                                searchTerm
                            )}
                        </Typography>
                    </Box>
                ) : null;

            case "FAQ":
                return (
                    <Box sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Frequently Asked Questions", searchTerm)}
                        </Typography>
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 使用两列布局来节省空间 */}
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                maxHeight: 'calc(100vh - 200px)',
                                overflowY: 'auto',
                                pr: 1
                            }}>
                                {/* 左列 */}
                                <Box>
                                    {/* Photo Quality Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText("Photo Quality Issues", searchTerm)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Why are my photos being rejected?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Photos may be rejected due to shadows, obstructions, poor lighting, or incorrect perspective.", searchTerm)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: What about unavoidable obstructions?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Try different angles or note the obstruction in your submission.", searchTerm)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Upload Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText("Upload Issues", searchTerm)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Upload is failing. What to do?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Check internet connection and ensure file size is under 10MB. Supported: JPG, PNG, HEIC.", searchTerm)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: How long for approval?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("1-3 business days. Check status in Upload History.", searchTerm)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* 右列 */}
                                <Box>
                                    {/* Address Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText("Address Issues", searchTerm)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Can't find correct address?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Use Building Information section to search. Submit request to add missing addresses.", searchTerm)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Multiple buildings at once?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Yes, but each photo needs its specific building address.", searchTerm)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Technical Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText("Technical Issues", searchTerm)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: App running slowly?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Clear browser cache, check internet connection, use latest Chrome or Safari.", searchTerm)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Login troubles?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Check credentials or contact administrator for password reset.", searchTerm)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );
            case "Tutorial":
            default:
                return (
                    <Box>
                        <Typography variant="h2" sx={styles.title}>
                            {highlightText("CityUp Tutorial", searchTerm)}
                        </Typography>
                        <Divider sx={styles.divider} />
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "Welcome to the CityUp tutorial. Select a topic on the left to get started.",
                                searchTerm
                            )}
                        </Typography>

                        {/* 常见问题快速链接 */}
                        <Box sx={{ ...styles.body, mt: 4 }}>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                                {highlightText("Quick Help - Common Questions", searchTerm)}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {highlightText("Click on any question below to jump directly to the answer:", searchTerm)}
                            </Typography>

                            <Box sx={{ ml: 2 }}>
                                <Box
                                    sx={{
                                        mb: 1,
                                        cursor: 'pointer',
                                        '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                                    }}
                                    onClick={() => setSelectedSection("FAQ")}
                                >
                                    <Typography variant="body1">
                                        • {highlightText("Why are my photos being rejected?", searchTerm)}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mb: 1,
                                        cursor: 'pointer',
                                        '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                                    }}
                                    onClick={() => setSelectedSection("FAQ")}
                                >
                                    <Typography variant="body1">
                                        • {highlightText("My photo upload is failing. What should I do?", searchTerm)}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mb: 1,
                                        cursor: 'pointer',
                                        '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                                    }}
                                    onClick={() => setSelectedSection("FAQ")}
                                >
                                    <Typography variant="body1">
                                        • {highlightText("How long does it take for photos to be approved?", searchTerm)}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mb: 1,
                                        cursor: 'pointer',
                                        '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                                    }}
                                    onClick={() => setSelectedSection("FAQ")}
                                >
                                    <Typography variant="body1">
                                        • {highlightText("I can't find the correct address for my building", searchTerm)}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mb: 1,
                                        cursor: 'pointer',
                                        '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                                    }}
                                    onClick={() => setSelectedSection("FAQ")}
                                >
                                    <Typography variant="body1">
                                        • {highlightText("The application is running slowly", searchTerm)}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mb: 2,
                                        cursor: 'pointer',
                                        '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                                    }}
                                    onClick={() => setSelectedSection("FAQ")}
                                >
                                    <Typography variant="body1">
                                        • {highlightText("I'm having trouble logging in", searchTerm)}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mt: 2,
                                        cursor: 'pointer',
                                        '&:hover': { color: '#1976d2', textDecoration: 'underline' }
                                    }}
                                    onClick={() => setSelectedSection("FAQ")}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                        {highlightText("→ View All FAQ", searchTerm)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );
        }
    };

    return (
        <Box sx={pageBackgroundStyles.container} style={{ justifyContent: "flex-start", alignItems: "stretch", overflow: "auto" }}>
            {/* 左侧菜单栏 */}
            <Box
                sx={{
                    position: "fixed",
                    top: `${64}px`,
                    left: 0,
                    width: `${drawerWidth}px`,
                    height: `calc(100% - ${64}px)`,
                    borderRight: "1px solid #ddd",
                    backgroundColor: "#fdfdfb",
                    overflowY: "auto",
                    zIndex: 1000,
                    padding: 0,
                }}
            >
                <Box sx={{ overflow: "auto", p: 2 }}>
                    {/* 搜索框 */}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={handleSearch}
                                            edge="end"
                                        >
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                                Search
                                            </Typography>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                }
                            }}
                        />
                    </Box>

                    {/* 搜索结果提示 */}
                    {searchTerm && searchResults.length > 0 && (
                        <Box sx={{ mb: 1, px: 1 }}>
                            <Typography variant="caption" color="primary">
                                Found {searchResults.length} result{searchResults.length > 1 ? 's' : ''}
                            </Typography>
                        </Box>
                    )}

                    {/* 菜单列表 */}
                    <List>
                        {sections.map((text, index) => {
                            const isHighlighted = searchResults.includes(text);
                            return (
                                <ListItem
                                    key={index}
                                    disablePadding
                                    onClick={() => setSelectedSection(text)}
                                    sx={{
                                        backgroundColor: isHighlighted ? '#e3f2fd' : 'transparent',
                                        borderRadius: '4px',
                                        mb: 0.5
                                    }}
                                >
                                    <ListItemButton
                                        sx={{
                                            backgroundColor: selectedSection === text ? '#1976d2' : 'transparent',
                                            color: selectedSection === text ? 'white' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: selectedSection === text ? '#1565c0' : '#f5f5f5',
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <span>
                                                    {isHighlighted && searchTerm ? (
                                                        <span style={{ fontWeight: 'bold' }}>
                                                            {highlightText(text, searchTerm)}
                                                        </span>
                                                    ) : (
                                                        text
                                                    )}
                                                </span>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>

                    {/* 无搜索结果提示 */}
                    {searchTerm && searchResults.length === 0 && (
                        <Box sx={{ px: 1, py: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                No results found for "{searchTerm}"
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* 右侧内容区域 */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: `${drawerWidth}px`,
                    height: `100vh`,
                    padding: 3,
                    backgroundColor: "#fdfdfb",
                }}
            >
                {renderContent()}
            </Box>
        </Box>
    );
};

const styles = {
    divider: { my: 2 },
    tutorialModelBox: {
        paddingTop: "16px",
    },
    title: {
        paddingLeft: "16px",
    },
    body: {
        paddingLeft: "16px",
        marginTop: "8px",
        fontSize: "1.1rem",
        lineHeight: 1.6,
    },
};

export default Tutorial;