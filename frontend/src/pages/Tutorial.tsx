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
        "Building Photo Gallery",
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
        "Building Photo Gallery": [
            "building", "photo", "addresses", "relevant", "find"
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
                    <Box sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Photograph", searchTerm)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to take proper building photographs. Please follow these essential requirements:",
                                searchTerm
                            )}
                        </Typography>

                        {/* ✅ Good examples */}
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#4caf50", mr: 1, fontWeight: "bold" }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>No shadows</strong> –{" "}
                                    {highlightText("Ensure the lighting is even and natural to avoid distortion.", searchTerm)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#4caf50", mr: 1, fontWeight: "bold" }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>No obstructions</strong> –{" "}
                                    {highlightText("The building should be fully visible, with no objects (trees, cars, people) blocking it.", searchTerm)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#4caf50", mr: 1, fontWeight: "bold" }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Straight and aligned perspective</strong> –{" "}
                                    {highlightText("Photos should be taken parallel to the building to maintain accuracy.", searchTerm)}
                                </Typography>
                            </Box>

                            {/* 示例图 1、2 */}
                            <Box sx={{ mt: 2 }}>
                                <img
                                    src="/assets/withoutShadow.png"
                                    alt="Example without shadow and obstruction"
                                    style={{ width: "100%", maxWidth: 600, borderRadius: 8, marginBottom: 16 }}
                                />
                                <br />
                                <img
                                    src="/assets/site.png"
                                    alt="Example with aligned perspective"
                                    style={{ width: "100%", maxWidth: 600, borderRadius: 8 }}
                                />
                            </Box>
                        </Box>

                        {/* ❌ Bad examples */}
                        <Box sx={{ ...styles.body, mt: 4 }}>
                            <Typography variant="h6" sx={{ mt: 4 }}>
                                {highlightText("Below are some incorrect examples:", searchTerm)}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "flex-start", mt: 2, mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#f44336", mr: 1, fontWeight: "bold" }}>
                                    ❌
                                </Typography>
                                <Typography variant="body1">
                                    {highlightText("Too many obstructions", searchTerm)}
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 1, mb: 2 }}>
                                <img
                                    src="/assets/withpeople.png"
                                    alt="Example with obstructions"
                                    style={{ width: "100%", maxWidth: 600, borderRadius: 8 }}
                                />
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#f44336", mr: 1, fontWeight: "bold" }}>
                                    ❌
                                </Typography>
                                <Typography variant="body1">
                                    {highlightText("Building with shadow", searchTerm)}
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 1 }}>
                                <img
                                    src="/assets/withshadow.png"
                                    alt="Example with heavy shadows"
                                    style={{ width: "100%", maxWidth: 600, borderRadius: 8 }}
                                />
                            </Box>
                        </Box>
                    </Box>
                );

            case "Photo Upload":
                return (
                    <Box sx={{...styles.tutorialModelBox,paddingBottom: '80px'}}>
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
                            {/* 1. Set your location */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📍
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>1. Set your location</strong>
                                    </Typography>

                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Get%20geolocation.png"
                                            alt="Get location example"
                                            style={{
                                                width: '100%',      // ← 改动
                                                maxWidth: 800,      // ← 最大不超过 800px
                                                borderRadius: 8
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                                        {highlightText(
                                            "You have two location options: 1. allow the website to automatically detect your current location or 2. manually enter an address to position your location.",
                                            searchTerm
                                        )}
                                        <br />
                                        <strong>When enabling location access, your browser will offer three options:</strong>
                                        <br />
                                        <strong>“Allow while visiting the site”</strong> –{" "}
                                        {highlightText(
                                            "lets the site access your location automatically each time you visit.",
                                            searchTerm
                                        )}
                                        <br />
                                        <strong>“Allow this time”</strong> –{" "}
                                        {highlightText(
                                            "grants location access just once; you’ll be prompted again next time.",
                                            searchTerm
                                        )}
                                        <br />
                                        <strong>“Never allow”</strong> –{" "}
                                        {highlightText(
                                            "blocks location access completely. In this case, you’ll need to manually enter the location and click 'Search'.",
                                            searchTerm
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* 2. Upload photos */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📷
                                </Typography>
                                <Typography variant="body1">
                                    <strong>2. Upload photos</strong>
                                    <br />
                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Choose%20photos.png"
                                            alt="Choose photo example"
                                            style={{ width: '800px', borderRadius: 8 }}
                                        />
                                    </Box>
                                    {highlightText("Click ", searchTerm)}
                                    <strong>{highlightText("'Shooting and Upload'", searchTerm)}</strong>
                                    {highlightText(
                                        ", navigate to the folder containing the uploaded image, select the image, and click Open. Please note that only PNG and JPG file formats are supported.",
                                        searchTerm
                                    )}
                                    <br />
                                    {highlightText("Click ", searchTerm)}
                                    <strong>{highlightText("'Album Upload'", searchTerm)}</strong>
                                    {highlightText(
                                        ", if you are uploading multiple photos, the system supports up to 5 images at a time.",
                                        searchTerm
                                    )}
                                </Typography>
                            </Box>

                            {/* 3. Finalize upload */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>3. Finalize upload</strong>
                                    <br />
                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Submit.png"
                                            alt="Choose photo example"
                                            style={{ width: '600px', borderRadius: 8 }}
                                        />
                                    </Box>
                                    {highlightText("Click ", searchTerm)}
                                    <strong>{highlightText("'Submit'", searchTerm)}</strong>
                                    {highlightText(
                                        ", once your photos are selected and the process is complete.",
                                        searchTerm
                                    )}
                                    <br />
                                    {highlightText("Click ", searchTerm)}
                                    <strong>{highlightText("'red X icon'", searchTerm)}</strong>
                                    {highlightText(
                                        ", in the top-right corner of the image to remove it if you're not satisfied with the photo.",
                                        searchTerm
                                    )}
                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Uploadsucess.png"
                                            alt="Choose photo example"
                                            style={{ width: '600px', borderRadius: 8 }}
                                        />
                                    </Box>
                                    <br />
                                    {highlightText("You will be prompted when the photo is uploaded successfully. ", searchTerm)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );


            case "Upload History":
                return (
                    <Box
                        sx={{
                            ...styles.tutorialModelBox,
                            paddingBottom: "80px",      // ← 确保底部留白
                        }}
                    >
                        {/* 标题 */}
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Upload History", searchTerm)}
                        </Typography>

                        {/* 段落说明 */}
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you'll learn how to search, filter, and navigate your photo upload history.",
                                searchTerm
                            )}
                        </Typography>

                        {/* 各步骤列表 */}
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1 */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    🔍
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>1. Search and filter photos</strong> –{" "}
                                        {highlightText(
                                            "Use the address search to find uploaded photos, or apply the status filter to view photos based on their current state.",
                                            searchTerm
                                        )}
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        Enter keywords and click <strong>'Search'</strong>; the results will appear below the search box.
                                        <br />
                                        Click <strong>'Clear'</strong> to clear the search content.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Search.png"
                                            alt="Search photo example"
                                            style={{
                                                width: '100%',
                                                maxWidth: 800,         // 不超过 800px
                                                borderRadius: 8,
                                                display: 'block'       // 避免图片靠边留空
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        <strong>Status filter includes four options:</strong>
                                        <br />
                                        <strong>"Pending"</strong>: The photo is waiting for review.
                                        <br />
                                        <strong>"Reviewing"</strong>: The administrator is currently checking the photo.
                                        <br />
                                        <strong>"Approved"</strong>: The photo has passed the review.
                                        <br />
                                        <strong>"Rejected"</strong>: The photo did not pass the review. This may be due to not meeting photo requirements. Please refer to the <strong>"Photograph"</strong> section and re-upload the image after making corrections.
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Filter.png"
                                            alt="Filter status example"
                                            style={{
                                                width: '100%',
                                                maxWidth: 800,         // 不超过 800px
                                                borderRadius: 8,
                                                display: 'block'       // 避免图片靠边留空
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 2. View details */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    📷
                                </Typography>

                                {/* 文字内容包一层 */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>2. View details</strong> {" "}
                                        <br />
                                        {highlightText("Click ", searchTerm)}
                                        <strong>{highlightText("'View Details'", searchTerm)}</strong>
                                        {highlightText(" to access full information about a photo.", searchTerm)}
                                        <br />
                                        Click <strong>'CLOSE'</strong> back to previous step.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Details.png"
                                            alt="Photo details example"
                                            style={{ width: '600px', borderRadius: 8 }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 3 */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    📁
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>3. Navigate pagination</strong> –{" "}
                                        {highlightText(
                                            "This page supports pagination. Photos are sorted from newest to oldest, with the most recently uploaded photos displayed at the top.",
                                            searchTerm
                                        )}
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {highlightText(
                                            "<, > is for previous/next page, |<, >| is for first/last page.",
                                            searchTerm
                                        )}
                                    </Typography>
                                </Box>
                            </Box>


                            <Box sx={{ mt: 2 }}>
                                <img
                                    src="/assets/Pagination.png"
                                    alt="Pagination example"
                                    style={{
                                        width: "100%",
                                        maxWidth: 800,
                                        borderRadius: 8,
                                        display: "block"
                                    }}
                                />
                            </Box>


                            {/* 4. Exit and return */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    🔙
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>4. Exit and return</strong> –{" "}
                                        {highlightText(
                                            "To leave this section, use the sidebar menu on the left or click 'Return to Main Menu'.",
                                            searchTerm
                                        )}
                                    </Typography>

                                    {/* ✅ 图片放在正文下方 */}
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Exit.png"
                                            alt="Exit example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block"
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );


            case "Building Photo Gallery":
                return (
                    <Box sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Building Photo Gallery", searchTerm)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to search for building-related photo uploads and download images easily.",
                                searchTerm
                            )}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1. Search by address */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    🔍
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>1. Search by address</strong> –{" "}
                                        {highlightText(
                                            "Enter an address in the search bar to view the latest upload times and the number of photos related to that location.",
                                            searchTerm
                                        )}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Input.png"
                                            alt="Search by address example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 2. View Photos */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    📷
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>2. View Photos</strong> –{" "}
                                        {highlightText(
                                            "Click on a photo with address from the right panel or click ",
                                            searchTerm
                                        )}
                                        <strong>{highlightText("'view all'", searchTerm)}</strong>{" "}
                                        {highlightText("to use filter options to sort the photo gallery.", searchTerm)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Selectone.png"
                                            alt="Photo Selectone"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                                marginBottom: 12,
                                            }}
                                        />
                                        <img
                                            src="/assets/Selecttwo.png"
                                            alt="Photo Selecttwo"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                                marginBottom: 12,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 3. Download Photos */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    📁
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>3. Download photos</strong> –{" "}
                                        {highlightText("Click on a photo from the right panel and then ", searchTerm)}
                                        {highlightText("click ", searchTerm)}
                                        <strong>{highlightText("'Download'", searchTerm)}</strong>{" "}
                                        {highlightText("to save it.", searchTerm)}
                                        <br />
                                        {highlightText(
                                            "Multiple photos will be downloaded as a ZIP file, while single images will be saved in their original format.",
                                            searchTerm
                                        )}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Viewphotoone.png"
                                            alt="Viewphoto example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                            }}
                                        />
                                        <img
                                            src="/assets/Download.png"
                                            alt="Download example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );

            case "Photo Review":
                return roles.includes("admin") ? (
                    <Box sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        {/* Title */}
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Photo Review", searchTerm)}
                        </Typography>

                        {/* Description */}
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this admin section, you can review and approve photos submitted by users.",
                                searchTerm
                            )}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1. Fetch user-uploaded photos */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    📥
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>1. Fetch user-uploaded photos</strong> –{" "}
                                        {highlightText("Click ", searchTerm)}
                                        <strong>{highlightText("'Fetch Photos'", searchTerm)}</strong>{" "}
                                        {highlightText(
                                            "to load the images submitted by users for review. You will see photos marked with status ",
                                            searchTerm
                                        )}
                                        <strong>{highlightText("'approved'", searchTerm)}</strong>{" "}
                                        {highlightText("and", searchTerm)}{" "}
                                        <strong>{highlightText("'rejected'", searchTerm)}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/fetch.png"
                                            alt="Fetch user photos example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 2. Approve or reject photos */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    ✅
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>2. Approve or reject photos</strong> –{" "}
                                        {highlightText(
                                            "Use the selection buttons to approve a single photo or multiple photos at once.",
                                            searchTerm
                                        )}
                                        <br />
                                        <strong>{highlightText("Accept", searchTerm)}</strong>{" "}
                                        {highlightText(
                                            "means the photo meets requirements and has the correct address information. If the photo does not meet upload guidelines or does not match the address details, click ",
                                            searchTerm
                                        )}
                                        <strong>{highlightText("'Reject'", searchTerm)}</strong>.
                                        <br />
                                        {highlightText(
                                            "If you want to withdraw the operation, you can click ",
                                            searchTerm
                                        )}
                                        <strong>{highlightText("‘Cancel’", searchTerm)}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/review1.png"
                                            alt="Approve photo example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                                marginBottom: 12,
                                            }}
                                        />
                                        <img
                                            src="/assets/review2.png"
                                            alt="Batch approval example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 3. Final review check */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    🔄
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>3. Final check</strong> –{" "}
                                        {highlightText(
                                            "Review how many photos are still pending. The review date should not exceed three working days.",
                                            searchTerm
                                        )}
                                        <br />
                                        {highlightText("Click ", searchTerm)}
                                        <strong>{highlightText("Photo Review", searchTerm)}</strong>{" "}
                                        {highlightText("or", searchTerm)}{" "}
                                        <strong>{highlightText("Exit", searchTerm)}</strong>{" "}
                                        {highlightText("to return to the main menu.", searchTerm)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Back.png"
                                            alt="Review progress example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ) : null;


            case "User Management":
                return roles.includes("admin") ? (
                    <Box sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("User Management", searchTerm)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText("In this admin section, you can manage user accounts and permissions.", searchTerm)}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1. Access Admin Panel */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    🛠️
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>1. Access User Management Panel</strong> –{" "}
                                        {highlightText(
                                            "From the homepage, click the left menu and select Admin Panel to access the Keycloak interface.",
                                            searchTerm
                                        )}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/userlink.png"
                                            alt="Admin panel example"
                                            style={{ width: "100%", maxWidth: 800, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 2. Find Users */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    🔍
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>2. Find Users</strong> –{" "}
                                        {highlightText(
                                            "Click ", searchTerm
                                        )}
                                        <strong>{highlightText("Refresh", searchTerm)}</strong>{" "}
                                        {highlightText("first to retrieve the latest user list. You can then search users by name or email.", searchTerm)}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/managment.png"
                                            alt="User search example"
                                            style={{ width: "100%", maxWidth: 800, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 3. Add & Delete Users */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    ➕
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>3. Add and Delete Users</strong> {" "}
                                        <br />
                                        {highlightText(
                                            "To delete a user, click the three dots at the end of the row and select ",
                                            searchTerm
                                        )}
                                        <strong>{highlightText("Delete", searchTerm)}</strong>.
                                        <br />
                                        {highlightText("To add a new user, click ", searchTerm)}
                                        <strong>{highlightText("Add", searchTerm)}</strong>{" "}
                                        {highlightText("on the top-left corner to go to the create user page.", searchTerm)}
                                        <br />
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addDelete.png"
                                            alt="Create user example"
                                            style={{ width: "100%", maxWidth: 800, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                    <Typography variant="body1">
                                        {highlightText("Box 1: ", searchTerm)}
                                        <strong>{highlightText("'Required user actions'", searchTerm)}</strong>{" "}
                                        {highlightText("is a dropdown to configure mandatory actions for first login. Choose ", searchTerm)}
                                        <strong>{highlightText("'Verify Email'", searchTerm)}</strong>{" "}
                                        {highlightText("and make sure the button below is set to ", searchTerm)}
                                        <strong>{highlightText("On", searchTerm)}</strong>.
                                        <br />
                                        {highlightText("Box 2: In the ", searchTerm)}
                                        <strong>{highlightText("General", searchTerm)}</strong>{" "}
                                        {highlightText("tab, enter a valid email, full name, and select ", searchTerm)}
                                        <strong>{highlightText("Join Groups", searchTerm)}</strong>{" "}
                                        {highlightText("as needed.", searchTerm)}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/createuser.png"
                                            alt="Create user example"
                                            style={{ width: "100%", maxWidth: 800, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 4. Confirm Submission */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    ✅
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>4. Confirm and Create</strong> –{" "}
                                        {highlightText("Once everything is filled in correctly, click ", searchTerm)}
                                        <strong>{highlightText("Create", searchTerm)}</strong>{" "}
                                        {highlightText("to add the user successfully.", searchTerm)}
                                    </Typography>

                                </Box>
                            </Box>
                        </Box>
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
                                                A: {highlightText("Check internet connection and ensure file size is under 10MB. Supported: JPG, PNG.", searchTerm)}
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
                                                A: {highlightText("Use the auto location function of the upload page. Submit request to add missing addresses.", searchTerm)}
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
        <Box sx={pageBackgroundStyles.container} style={{ justifyContent: "flex-start", height: "100vh", alignItems: "stretch", overflow: "hidden" }}>
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
                    height: "100vh",
                    padding: 3,
                    backgroundColor: "#fdfdfb",
                    overflowY: "auto",
                    paddingBottom: '80px'
                }}
            >
                <Box sx={{ paddingBottom: '80px' }}>
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

const styles = {
    divider: { my: 2 },
    tutorialModelBox: {
        paddingTop: "16px",
        minHeight: "100%",
        paddingBottom: '80px',// 保证内容区域能撑开
    },
    title: {
        paddingLeft: "16px",
    },
    body: {
        paddingLeft: "16px",
        marginTop: "8px",
        fontSize: "1.1rem",
        lineHeight: 1.6,
        overflowWrap: "break-word",
    },
};

export default Tutorial;