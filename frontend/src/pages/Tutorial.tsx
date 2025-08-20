import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import React, { useEffect, useState,useRef } from "react";
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
import { useTheme, useMediaQuery, Drawer, AppBar, Toolbar, Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Tutorial = () => {
    const drawerWidth = 240;
    const { token } = useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedSection, setSelectedSection] = useState("Tutorial");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
    // 用于挂载每个模块的 DOM 引用，读取 innerText
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const isSearchActive = searchTerm.trim().length > 0;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm: 600px
    const [mobileOpen, setMobileOpen] = useState(false); // 控制 Drawer 打开关闭

    // Take user from KeycloakClient and if token exist take into roles
    useEffect(() => {
        const fetchRoles = async () => {
            const userInfo = await KeycloakClient.extractUserInfo(token);
            setRoles(userInfo?.roles || []);

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
        "Rankings",
        "User Information",
        "FAQ",
        ...(roles.includes("admin") ? ["Photo Review", "Photo Download","User Management"] : [])
    ];


    // Based on the search content it looks for matches in the sections and searchableContent and updates the search results.
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const results: string[] = [];
        const searchLower = searchTerm.toLowerCase();

        sections.forEach((sectionName) => {
            const titleMatch = sectionName.toLowerCase().includes(searchLower);
            const contentText = sectionRefs.current[sectionName]?.innerText?.toLowerCase() || "";
            const contentMatch = contentText.includes(searchLower);

            if (titleMatch || contentMatch) {
                results.push(sectionName);
            }
        });

        setSearchResults(results);

        // 使用 setTimeout 确保状态更新后再跳转
        setTimeout(() => {
            if (results.length > 0) {
                const firstMatch = results[0];
                setSelectedSection(firstMatch);
                const ref = sectionRefs.current[firstMatch];
                if (ref) {
                    ref.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        }, 0);
    };

    // 修复后的 highlightText 函数
    const highlightText = (text: string, searchTerm: string, isSearchActive: boolean = true) => {
        // 修复bug1：当搜索词为空或不处于搜索状态时，返回原始文本
        if (!searchTerm.trim() || !isSearchActive) return text;

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
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["Photograph"] = el;}} // 新增
                        sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Photograph", searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to take proper building photographs. Please follow these essential requirements:",
                                searchTerm, isSearchActive
                            )}
                        </Typography>

                        {/* ✅ 正面示例 */}
                        <Typography variant="h6" sx={{ mt: 4 }}>
                            {highlightText("Correct photo examples:", searchTerm, isSearchActive)}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                mt: 2,
                                justifyContent: "center",
                            }}
                        >
                            {/* Example 1 */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <Typography component="span" sx={{ color: "#4caf50", fontWeight: "bold", mr: 1 }}>
                                        ✅
                                    </Typography>
                                    <strong>{highlightText("No shadows", searchTerm, isSearchActive)}</strong> –{"  "}
                                    {highlightText("Ensure the lighting is even and natural to avoid distortion.", searchTerm)}
                                </Typography>
                                <Box
                                    component="img"
                                    src="/assets/withoutShadow.png"
                                    alt="Example without shadow"
                                    sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxWidth: "100%" }}
                                />
                            </Box>

                            {/* Example 2 */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <Typography component="span" sx={{ color: "#4caf50", fontWeight: "bold", mr: 1 }}>
                                        ✅
                                    </Typography>
                                    <strong>{highlightText("Straight perspective", searchTerm, isSearchActive)}</strong> –{"  "}
                                    {highlightText("Photos should be taken parallel to the building to maintain accuracy.", searchTerm, isSearchActive)}
                                </Typography>
                                <Box
                                    component="img"
                                    src="/assets/site.png"
                                    alt="Example aligned photo"
                                    sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxWidth: "100%" }}
                                />
                            </Box>
                        </Box>

                        {/* ❌ 负面示例 */}
                        <Typography variant="h6" sx={{ mt: 6 }}>
                            {highlightText("Incorrect photo examples:", searchTerm, isSearchActive)}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                mt: 2,
                                justifyContent: "center",
                            }}
                        >
                            {/* Bad Example 1 */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <Typography component="span" sx={{ color: "#f44336", fontWeight: "bold", mr: 1 }}>
                                        ❌
                                    </Typography>
                                    <strong>{highlightText("Obstructions", searchTerm, isSearchActive)}</strong>  –{"  "}
                                    {highlightText("The building should be fully visible without objects blocking it.", searchTerm)}
                                </Typography>
                                <Box
                                    component="img"
                                    src="/assets/withpeople.png"
                                    alt="Obstructed building"
                                    sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxWidth: "100%" }}
                                />
                            </Box>

                            {/* Bad Example 2 */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <Typography component="span" sx={{ color: "#f44336", fontWeight: "bold", mr: 1 }}>
                                        ❌
                                    </Typography>
                                    <strong>{highlightText("Building with shadow", searchTerm, isSearchActive)}</strong> –{"  "}
                                    {highlightText("Heavy shadows distort texture and should be avoided.", searchTerm, isSearchActive)}
                                </Typography>
                                <Box
                                    component="img"
                                    src="/assets/withshadow.png"
                                    alt="Shadowed building"
                                    sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxWidth: "100%" }}
                                />
                            </Box>
                        </Box>
                    </Box>
                );

            case "Photo Upload":
                return (
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["Photo Upload"] = el;}} // 新增
                        sx={{...styles.tutorialModelBox,paddingBottom: '80px'}}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Photo Upload", searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to upload and edit the photos you take, as well as enter the address the photos correspond to. Follow these steps to ensure a smooth upload process:",
                                searchTerm, isSearchActive
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
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        <strong>When enabling location access, your browser will offer three options:</strong>
                                        <br />
                                        <strong>“Allow while visiting the site”</strong> –{" "}
                                        {highlightText(
                                            "lets the site access your location automatically each time you visit.",
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        <strong>“Allow this time”</strong> –{" "}
                                        {highlightText(
                                            "grants location access just once; you’ll be prompted again next time.",
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        <strong>“Never allow”</strong> –{" "}
                                        {highlightText(
                                            "blocks location access completely. In this case, you’ll need to manually enter the location and click 'Search'.",
                                            searchTerm, isSearchActive
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* 2. Upload photos */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📷
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>2. Upload photos</strong>
                                    </Typography>

                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Choose%20photos.png"
                                            alt="Choose photo example"
                                            style={{
                                                width: '100%',          // 自动适配容器
                                                maxWidth: 800,          // 控制最大宽度
                                                borderRadius: 8
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                                        {highlightText("Click ", searchTerm)}
                                        <strong>{highlightText("'Shooting and Upload'", searchTerm, isSearchActive)}</strong>
                                        {highlightText(
                                            ", navigate to the folder containing the uploaded image, select the image, and click Open. Please note that only PNG and JPG file formats are supported.",
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        {highlightText("Click ", searchTerm)}
                                        <strong>{highlightText("'Album Upload'", searchTerm, isSearchActive)}</strong>
                                        {highlightText(
                                            ", if you are uploading multiple photos, the system supports up to 5 images at a time.",
                                            searchTerm, isSearchActive
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                            {/* 3. Finalize upload */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    ✅
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>3. Finalize upload</strong>
                                    </Typography>

                                    {/* 图1：提交按钮示例图 */}
                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Submit.png"
                                            alt="Choose photo example"
                                            style={{
                                                width: '100%',       //  改为自适应容器宽度
                                                maxWidth: 800,       //  限制最大宽度
                                                borderRadius: 8,
                                                objectFit: 'cover'   //  防止图像变形
                                            }}
                                        />
                                    </Box>

                                    {/* 描述文字 */}
                                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                                        {highlightText("Click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("'Submit'", searchTerm, isSearchActive)}</strong>
                                        {highlightText(", once your photos are selected and the process is complete.", searchTerm, isSearchActive)}
                                        <br />
                                        {highlightText("Click ", searchTerm)}
                                        <strong>{highlightText("'red X icon'", searchTerm, isSearchActive)}</strong>
                                        {highlightText(", in the top-right corner of the image to remove it if you're not satisfied with the photo.", searchTerm)}
                                    </Typography>

                                    {/* 图2：上传成功的界面图 */}
                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Uploadsucess.png"
                                            alt="Upload success example"
                                            style={{
                                                width: '100%',       // ✅ 与图1保持一致
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                                        {highlightText("You will be prompted when the photo is uploaded successfully.", searchTerm, isSearchActive)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );


            case "Upload History":
                return (
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["Upload History"] = el;}} // 新增
                        sx={{
                            ...styles.tutorialModelBox,
                            paddingBottom: "80px",      // ← 确保底部留白
                        }}
                    >
                        {/* 标题 */}
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Upload History", searchTerm, isSearchActive)}
                        </Typography>

                        {/* 段落说明 */}
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you'll learn how to search, filter, and navigate your photo upload history.",
                                searchTerm, isSearchActive
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
                                            searchTerm, isSearchActive
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
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: 'block'
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

                                {/* 内容区包一层 Box：保证结构统一 */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>2. View details</strong>
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                                        {highlightText("Click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("'View Details'", searchTerm, isSearchActive)}</strong>
                                        {highlightText(" to access full information about a photo.", searchTerm, isSearchActive)}
                                        <br />
                                        Click <strong>'CLOSE'</strong> back to previous step.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Details.png"
                                            alt="Photo details example"
                                            style={{
                                                width: '100%',          //宽度适应容器
                                                maxWidth: 800,          //限制最大宽度
                                                borderRadius: 8,
                                                objectFit: 'cover'      //防止压缩变形
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            {/* 3. Navigate pagination */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📁
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>3. Navigate pagination</strong> –{' '}
                                        {highlightText(
                                            'This page supports pagination. Photos are sorted from newest to oldest, with the most recently uploaded photos displayed at the top.',
                                            searchTerm, isSearchActive
                                        )}
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                                        {highlightText(
                                            '<, > is for previous/next page, |<, >| is for first/last page.',
                                            searchTerm, isSearchActive
                                        )}
                                    </Typography>

                                    {/* ✅ 图片放进内容块内部 */}
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Pagination.png"
                                            alt="Pagination example"
                                            style={{
                                                width: '100%',
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            {/* 4. Exit and return */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    🔙
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>4. Exit and return</strong> –{' '}
                                        {highlightText(
                                            "To leave this section, use the sidebar menu on the left or click 'Return to Main Menu'.",
                                            searchTerm, isSearchActive
                                        )}
                                    </Typography>

                                    {/* ✅ 内嵌图像块统一格式 */}
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Exit.png"
                                            alt="Exit example"
                                            style={{
                                                width: '100%',
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                objectFit: 'cover'
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
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["Building Photo Gallery"] = el;}} // 新增
                        sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Building Photo Gallery", searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to search for building-related photo uploads and view images easily.",
                                searchTerm, isSearchActive
                            )}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* ✅ Step 1. Search by address */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    🔍
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>1. Search by address</strong> –{" "}
                                        {highlightText(
                                            "Enter an address in the search bar to view the latest upload times and the number of photos related to that location.",
                                            searchTerm, isSearchActive
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
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Step 2. View photos */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    📷
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>2. View Photos</strong> –{" "}
                                        {highlightText(
                                            "Click on a photo with address from the right panel and click ",
                                            searchTerm
                                        )}
                                        <strong>{highlightText("'view all'", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("to use filter options to sort the photo gallery.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box
                                        sx={{
                                            mt: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <img
                                                src="/assets/Selectone.png"
                                                alt="Select Photo"
                                                style={{
                                                    width: "100%",
                                                    maxWidth: 800,
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                    display: "block",
                                                    marginBottom: 16
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <img
                                                src="/assets/bpg3.png"
                                                alt="View Photo"
                                                style={{
                                                    width: "100%",
                                                    maxWidth: 800,
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            {/* Step 3. Like photos */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    ❤️
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>3. Like Photos</strong> –{" "}
                                        {highlightText(
                                            "You can give a like to other user’s photo by clicking the heart icon. Each like gives that user 1 point.",
                                            searchTerm,
                                            isSearchActive
                                        )}
                                        <br /> {/* 新增换行标记 */}
                                        {highlightText(
                                            "Note: Each user can only like the same photo once. Giving a like to your own photo won’t earn any points.",
                                            searchTerm,
                                            isSearchActive
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );

            case "Rankings":
                return (
                    <Box
                        ref={(el: HTMLDivElement | null) => {
                            sectionRefs.current["Rankings"] = el; // 用于自动跳转定位
                        }}
                        sx={{ ...styles.tutorialModelBox, paddingBottom: '80px' }}
                    >
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Rankings", searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText("📈 How to earn points:", searchTerm, isSearchActive)}
                        </Typography>

                        <Box sx={styles.body}>
                            <Typography variant="body1">
                                <strong>1. Daily check-in via photo upload</strong> –{" "}
                                {highlightText(
                                    "You get 1 point for uploading a photo each day. If you upload photos for 7 consecutive days or more, you can earn up to 7 extra points.",
                                    searchTerm, isSearchActive
                                )}
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2 }}>
                                <strong>2. Approved photos</strong> –{" "}
                                {highlightText(
                                    "Each approved photo earns you 5 points. If 5 consecutive uploaded photos are approved, you receive an extra 5 bonus points.",
                                    searchTerm, isSearchActive
                                )}
                                <br />
                                {highlightText(
                                    "Example: Based on the upload sequence of photos 1 to 6, if the 3rd photo is not approved while the others are, you don’t get the extra 5 bonus points. In this case, bonus eligibility resets from photo 4 onwards. If photos 7 and 8 are approved, you can earn 5 extra bonus points starting from photo 4.",
                                    searchTerm, isSearchActive
                                )}
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2 }}>
                                <strong>3. Likes from other users</strong> –{" "}
                                {highlightText(
                                    "Each like from other users gives you 1 point. If the like is withdrawn, the point is invalid. Likes given to your own photo won’t count, and you can only like each photo once.",
                                    searchTerm, isSearchActive
                                )}
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                <img
                                    src="/assets/rankings1.png"
                                    alt="Ranking point system example"
                                    style={{ width: '100%', maxWidth: 800, borderRadius: 8 }}
                                />
                            </Box>
                        </Box>

                        <Typography variant="body1" sx={{ ...styles.body, mt: 4 }}>
                            {highlightText("📊 About the leaderboard:", searchTerm, isSearchActive)}
                        </Typography>

                        <Box sx={styles.body}>
                            <Typography variant="body1">
                                <strong>1. Display scope</strong> –{" "}
                                {highlightText(
                                    "Only the top 50 users by total points will be shown. If a user has 0 points, they won’t appear on the leaderboard.",
                                    searchTerm, isSearchActive
                                )}
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2 }}>
                                <strong>2. Pagination</strong> –{" "}
                                {highlightText(
                                    "If your ranking is not on the first page, use the page navigation to jump to your position, or return to the first page via the button.",
                                    searchTerm, isSearchActive
                                )}
                            </Typography>
                        </Box>
                    </Box>
                );

            case "User Information":
                return (
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["User Information"] = el;}} // 新增
                        sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("User Information", searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText("In this section, you will learn how to manage your own registration information.", searchTerm, isSearchActive)}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1️⃣ Navigate to User Information page */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    📂
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>1. Open the User Information page</strong> –{" "}
                                        {highlightText("From the side menu, click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Profile", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("in the dropdown, then select ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("User Information", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("to enter the user information management interface.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/userinfo1.png"
                                            alt="User Information navigation"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,            //与其他步骤统一
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 2 Modify personal details */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    ✏️
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>2. Edit your personal details</strong> –{" "}
                                        {highlightText("On this page, you can update your personal information, such as a valid email address, last name, and first name.", searchTerm)}{" "}
                                        {highlightText("Click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Save", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("to save changes, or ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Cancel", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("to discard them.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/userinfo2.png"
                                            alt="Edit user information"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,            // 原来是1000 → 改为800以统一
                                                borderRadius: 8,
                                                objectFit: "cover",
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
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["Photo Review"] = el;}} // 新增
                        sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        {/* Title */}
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Photo Review", searchTerm, isSearchActive)}
                        </Typography>

                        {/* Description */}
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this admin section, you can review and approve photos submitted by users.",
                                searchTerm, isSearchActive
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
                                        {highlightText("Click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("'Fetch Photos'", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(
                                            "to load the images submitted by users for review. You will see photos marked with status ",
                                            searchTerm, isSearchActive
                                        )}
                                        <strong>{highlightText("'approved'", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("and", searchTerm, isSearchActive)}{" "}
                                        <strong>{highlightText("'rejected'", searchTerm, isSearchActive)}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/fetch.png"
                                            alt="Fetch user photos example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
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
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        <strong>{highlightText("Accept", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(
                                            "means the photo meets requirements and has the correct address information. If the photo does not meet upload guidelines or does not match the address details, click ",
                                            searchTerm, isSearchActive
                                        )}
                                        <strong>{highlightText("'Reject'", searchTerm, isSearchActive)}</strong>.
                                        <br />
                                        {highlightText(
                                            "If you want to withdraw the operation, you can click ",
                                            searchTerm, isSearchActive
                                        )}
                                        <strong>{highlightText("‘Cancel’", searchTerm, isSearchActive)}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/review1.png"
                                            alt="Approve photo example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
                                            }}
                                        />
                                        <img
                                            src="/assets/review2.png"
                                            alt="Batch approval example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
                                            }}
                                        />
                                        <img
                                            src="/assets/batch.png"
                                            alt="select batch photo example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
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
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        {highlightText("Click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Photo Review", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("or", searchTerm, isSearchActive)}{" "}
                                        <strong>{highlightText("Exit", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("to return to the main menu.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Back.png"
                                            alt="Review progress example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
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
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["User Management"] = el;}} // 新增
                        sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("User Management", searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText("In this admin section, you can manage user accounts and permissions.", searchTerm, isSearchActive)}
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
                                        {highlightText("From the homepage, click the left menu and select Admin Panel to access the Keycloak interface.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/userlink.png"
                                            alt="Admin panel example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,          // 与其他图像统一
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                display: "block"
                                            }}
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
                                        {highlightText("Click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Refresh", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("first to retrieve the latest user list. You can then search users by name or email.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/managment.png"
                                            alt="User search example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,          // ✅ 原来是1000 → 修改为统一800
                                                borderRadius: 8,
                                                objectFit: "cover",
                                                display: "block"
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Step 3: Delete Users */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    ➖
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>3. Delete Users</strong> –{" "}
                                        {highlightText("To delete a user, click the three dots at the end of the row and select ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Delete", searchTerm, isSearchActive)}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/delete.png"
                                            alt="Delete user example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,              // ✅ 统一宽度
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Step 4: Add User as Admin */}
                            {/* Step 4: Add User as Admin */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    ➕
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>4. Add User as Admin</strong> –{" "}
                                        {highlightText("Select the user's email, click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Group", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("and choose ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Join Group", searchTerm, isSearchActive)}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin1.png"
                                            alt="Step 1 - Select user and click Group"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin2.png"
                                            alt="Step 2 - Choose Join Group"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {highlightText("Make sure not to remove the user from the User group.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin3.png"
                                            alt="Reminder - Keep user in User group"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {highlightText("Next, click ", searchTerm, isSearchActive)} <strong>{highlightText(">", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("to open groups, select the ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("admin", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("group and click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Join", searchTerm, isSearchActive)}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin4.png"
                                            alt="Step 4 - Navigate to groups"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin5.png"
                                            alt="Step 5 - Join admin group"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {highlightText("After joining, you can remove users from the admin group if needed by clicking ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("Leave", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("then confirm. A success message will appear once the removal is complete.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin6.png"
                                            alt="Remove user from admin - step 1"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin7.png"
                                            alt="Confirm admin leave"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin8.png"
                                            alt="Success message shown"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>



                        </Box>
                    </Box>
                ) : null;

            case "Photo Download":
                return (
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["Photo Download"] = el;}} // 新增
                        sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Building Photo Gallery", searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "In this section, you will learn how to search for building-related photo uploads and download images easily.",
                                searchTerm, isSearchActive
                            )}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1. Search by address */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    🔍
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>1. Search by address</strong> –{" "}
                                        {highlightText(
                                            "Enter an address in the search bar to view the latest upload times and the number of photos related to that location.",
                                            searchTerm, isSearchActive
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
                                                objectFit: "cover",
                                                marginBottom: 12           // 与多张图片保持底部间距一致
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
                                            searchTerm, isSearchActive
                                        )}
                                        <strong>{highlightText("'view all'", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("to use filter options to sort the photo gallery.", searchTerm, isSearchActive)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Selectone.png"
                                            alt="Photo Selectone"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
                                            }}
                                        />
                                        <img
                                            src="/assets/Selecttwo.png"
                                            alt="Photo Selecttwo"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
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
                                        {highlightText("Click on a photo from the right panel and then ", searchTerm, isSearchActive)}
                                        {highlightText("click ", searchTerm, isSearchActive)}
                                        <strong>{highlightText("'Download'", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText("to save it.", searchTerm, isSearchActive)}
                                        <br />
                                        {highlightText(
                                            "Multiple photos will be downloaded as a ZIP file, while single images will be saved in their original format.",
                                            searchTerm, isSearchActive
                                        )}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/Viewphotoone.png"
                                            alt="Viewphoto example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
                                            }}
                                        />
                                        <img
                                            src="/assets/download4.png"
                                            alt="Download example"
                                            style={{
                                                width: "100%",
                                                maxWidth: 800,
                                                borderRadius: 8,
                                                display: "block",
                                                objectFit: "cover",
                                                marginBottom: 12
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );

            case "FAQ":
                return (
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current["FAQ"] = el;}} // 新增
                        sx={styles.tutorialModelBox}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText("Frequently Asked Questions", searchTerm, isSearchActive)}
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
                                            {highlightText("Photo Quality Issues", searchTerm, isSearchActive)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Why are my photos being rejected?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Photos may be rejected due to shadows, obstructions, poor lighting, or incorrect perspective.", searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: What about unavoidable obstructions?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Try different angles or note the obstruction in your submission.", searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Upload Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText("Upload Issues", searchTerm, isSearchActive)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Upload is failing. What to do?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Check internet connection and ensure file size is under 10MB. Supported: JPG, PNG.", searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: How long for approval?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("1-3 business days. Check status in Upload History.", searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* 右列 */}
                                <Box>
                                    {/* Address Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText("Address Issues", searchTerm, isSearchActive)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Can't find correct address?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Use the auto location function of the upload page. Submit request to add missing addresses.", searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Multiple buildings at once?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Yes, but each photo needs its specific building address.", searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Technical Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText("Technical Issues", searchTerm, isSearchActive)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: App running slowly?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Clear browser cache, check internet connection, use latest Chrome or Safari.", searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                Q: Login troubles?
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                A: {highlightText("Check credentials or contact administrator for password reset.", searchTerm, isSearchActive)}
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
                    <Box ref={(el: HTMLDivElement | null) => {sectionRefs.current[""] = el;}} >
                        <Typography variant="h2" sx={styles.title}>
                            {highlightText("CityUp Tutorial",searchTerm, isSearchActive)}
                        </Typography>
                        <Divider sx={styles.divider} />
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                "Welcome to the CityUp tutorial. Select a topic on the left to get started.",
                                searchTerm, isSearchActive
                            )}
                        </Typography>

                        {/* 常见问题快速链接 */}
                        <Box sx={{ ...styles.body, mt: 4 }}>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                                {highlightText("Quick Help - Common Questions", searchTerm, isSearchActive)}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {highlightText("Click on any question below to jump directly to the answer:", searchTerm, isSearchActive)}
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
                                        • {highlightText("Why are my photos being rejected?", searchTerm, isSearchActive)}
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
                                        • {highlightText("My photo upload is failing. What should I do?", searchTerm, isSearchActive)}
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
                                        • {highlightText("How long does it take for photos to be approved?", searchTerm, isSearchActive)}
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
                                        • {highlightText("I can't find the correct address for my building", searchTerm, isSearchActive)}
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
                                        • {highlightText("The application is running slowly", searchTerm, isSearchActive)}
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
                                        • {highlightText("I'm having trouble logging in", searchTerm, isSearchActive)}
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
                                        {highlightText("→ View All FAQ", searchTerm, isSearchActive)}
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
            {/* 左侧菜单栏 - 桌面端和移动端都显示 */}
            <Box
                sx={{
                    position: "fixed",
                    top: "64px", // 修改：从顶部菜单栏下方开始
                    left: 0,
                    width: isMobile ? `${drawerWidth * 0.8}px` : `${drawerWidth}px`, // 移动端稍微窄一点
                    height: "calc(100vh - 64px)", // 修改：减去顶部菜单栏高度
                    borderRight: "1px solid #ddd",
                    backgroundColor: "#fdfdfb",
                    overflowY: "auto",
                    zIndex: 900, // 修改：降低z-index，确保不遮住顶部菜单栏
                    padding: 0,
                    // 移动端可以滑动隐藏/显示
                    transform: isMobile && !mobileOpen ? `translateX(-${drawerWidth * 0.8}px)` : 'translateX(0)',
                    transition: 'transform 0.3s ease-in-out',
                }}
            >
                <Box sx={{ overflow: "auto", p: 2 }}>
                    {/* 移动端添加关闭按钮 */}
                    {isMobile && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                            <IconButton
                                size="small"
                                onClick={() => setMobileOpen(false)}
                                sx={{ color: 'text.secondary' }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    )}

                    {/* 搜索框 */}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                // 修复bug1：当搜索词为空时，立即清空搜索结果
                                if (!e.target.value.trim()) {
                                    setSearchResults([]);
                                }
                            }}
                            onKeyDown={(e) => {
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
                                    onClick={() => {
                                        setSelectedSection(text);
                                        // 新增：点击菜单项自动跳转到模块
                                        const scrollTarget = sectionRefs.current[text];
                                        if (scrollTarget) {
                                            scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }
                                        // 移动端选择后自动关闭菜单
                                        if (isMobile) {
                                            setMobileOpen(false);
                                        }
                                    }}
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
                                            primary={highlightText(text, searchTerm, isSearchActive && searchResults.includes(text))} //  第三处更新：统一调用方式
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

            {/* 移动端遮罩层 */}
            {isMobile && mobileOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 64, // 修改：从顶部菜单栏下方开始
                        left: 0,
                        width: '100vw',
                        height: 'calc(100vh - 64px)', // 修改：减去顶部菜单栏高度
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 899, // 修改：确保在菜单栏下方
                    }}
                    onClick={() => {
                        setMobileOpen(false);

                        // 新增：关闭菜单时自动滚动到当前选中模块
                        const currentRef = sectionRefs.current[selectedSection];
                        currentRef?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                />
            )}

            {/* 移动端菜单切换按钮 */}
            {isMobile && (
                <IconButton
                    sx={{
                        position: 'fixed',
                        top: 72, // 修改：调整到顶部菜单栏下方
                        left: mobileOpen ? `${drawerWidth * 0.8 - 40}px` : '16px',
                        zIndex: 901, // 修改：确保按钮在菜单栏之上
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ddd',
                        transition: 'left 0.3s ease-in-out',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                        }
                    }}
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <MenuIcon />
                </IconButton>
            )}


            {/* 右侧内容区域 */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: isMobile ? 0 : `${drawerWidth}px`,
                    //marginLeft: `${drawerWidth}px`,
                    height: "100vh",
                    padding: isMobile ? 2 : 3,
                    //padding: 3,
                    backgroundColor: "#fdfdfb",
                    overflowY: "auto",
                    paddingBottom: '80px'
                }}
            >
                {/* 内容区域顶部补空，让内容不被 AppBar 挡住 */}
                <Box sx={{ paddingTop: isMobile ? '60px' : 0}}>
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