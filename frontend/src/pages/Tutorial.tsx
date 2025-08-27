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
import { useTranslation } from 'react-i18next';

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

    const {t} = useTranslation();
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
        { key: "Tutorial", label: t("tutorial.menu.tutorial") },
        { key: "Photograph", label: t("tutorial.menu.photograph") },
        { key: "Photo Upload", label: t("tutorial.menu.photoUpload") },
        { key: "Upload History", label: t("tutorial.menu.uploadHistory") },
        { key: "Building Photo Gallery", label: t("tutorial.menu.gallery") },
        { key: "Rankings", label: t("tutorial.menu.rankings") },
        { key: "User Information", label: t("tutorial.menu.userInfo") },
        { key: "FAQ", label: t("tutorial.menu.faq") },
        ...(roles.includes("admin")
            ? [
                { key: "Photo Review", label: t("tutorial.menu.photoReview") },
                { key: "Photo Download", label: t("tutorial.menu.photoDownload") },
                { key: "User Management", label: t("tutorial.menu.userManagement") },
            ]
            : []),
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
            const titleMatch = sectionName.key.toLowerCase().includes(searchLower);
            const contentText = sectionRefs.current[sectionName.key]?.innerText?.toLowerCase() || "";
            const contentMatch = contentText.includes(searchLower);

            if (titleMatch || contentMatch) {
                results.push(sectionName.key);
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
                            {highlightText(t("tutorial.photograph.title"), searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.photograph.description"), searchTerm, isSearchActive)}
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
                                    <strong>{highlightText(t("tutorial.photograph.noShadows.title"), searchTerm, isSearchActive)}</strong> –{"  "}
                                    {highlightText(t("tutorial.photograph.noShadows.description"), searchTerm)}
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
                                    <strong>{highlightText(t("tutorial.photograph.straightPerspective.title"), searchTerm, isSearchActive)}</strong> –{"  "}
                                    {highlightText(t("tutorial.photograph.straightPerspective.description"), searchTerm, isSearchActive)}
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
                            {highlightText(t("tutorial.photograph.incorrectExamples.title"), searchTerm, isSearchActive)}
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
                                    <strong>{highlightText(t("tutorial.photograph.noObstructions.title"), searchTerm, isSearchActive)}</strong>  –{"  "}
                                    {highlightText(t("tutorial.photograph.noObstructions.description"), searchTerm)}
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
                                    <strong>{highlightText(t("tutorial.photograph.incorrectExamples.buildingWithShadow"), searchTerm, isSearchActive)}</strong> –{"  "}
                                    {highlightText(t("tutorial.photograph.incorrectExamples.description"), searchTerm, isSearchActive)}
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
                            {highlightText(t("tutorial.photoUpload.title"), searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                t("tutorial.photoUpload.description"),
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
                                        <strong>{t("tutorial.photoUpload.setLocation.title")}</strong>
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
                                            t("tutorial.photoUpload.setLocation.description"),
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        <strong>{t("tutorial.photoUpload.setLocation.browserOptions.intro")}</strong>
                                        <br />
                                        <strong>{t("tutorial.photoUpload.setLocation.browserOptions.allowWhileVisiting.title")}</strong> –{" "}
                                        {highlightText(
                                            t("tutorial.photoUpload.setLocation.browserOptions.allowWhileVisiting.description"),
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        <strong>{t("tutorial.photoUpload.setLocation.browserOptions.allowThisTime.title")}</strong> –{" "}
                                        {highlightText(
                                            t("tutorial.photoUpload.setLocation.browserOptions.allowThisTime.description"),
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        <strong>{t("tutorial.photoUpload.setLocation.browserOptions.neverAllow.title")}</strong> –{" "}
                                        {highlightText(
                                            t("tutorial.photoUpload.setLocation.browserOptions.neverAllow.description"),
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
                                        <strong>{t("tutorial.photoUpload.uploadPhotos.title")}</strong>
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
                                        {highlightText(t("tutorial.photoUpload.uploadPhotos.click"), searchTerm)}
                                        <strong>{highlightText(`'${t("tutorial.photoUpload.uploadPhotos.shootingUpload.buttonText")}'`, searchTerm, isSearchActive)}</strong>
                                        {highlightText(
                                            t("tutorial.photoUpload.uploadPhotos.shootingUpload.description"),
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        {highlightText(t("tutorial.photoUpload.uploadPhotos.click"), searchTerm)}
                                        <strong>{highlightText(`'${t("tutorial.photoUpload.uploadPhotos.albumUpload.buttonText")}'`, searchTerm, isSearchActive)}</strong>
                                        {highlightText(
                                            t("tutorial.photoUpload.uploadPhotos.albumUpload.description"),
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
                                        <strong>{t("tutorial.photoUpload.finalizeUpload.title")}</strong>
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
                                        {highlightText(t("tutorial.photoUpload.uploadPhotos.click"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(`'${t("tutorial.photoUpload.finalizeUpload.submit.buttonText")}'`, searchTerm, isSearchActive)}</strong>
                                        {highlightText(t("tutorial.photoUpload.finalizeUpload.submit.description"), searchTerm, isSearchActive)}
                                        <br />
                                        {highlightText(t("tutorial.photoUpload.uploadPhotos.click"), searchTerm)}
                                        <strong>{highlightText(`'${t("tutorial.photoUpload.finalizeUpload.remove.buttonText")}'`, searchTerm, isSearchActive)}</strong>
                                        {highlightText(t("tutorial.photoUpload.finalizeUpload.remove.description"), searchTerm)}
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
                                        {highlightText(t("tutorial.photoUpload.finalizeUpload.successMessage"), searchTerm, isSearchActive)}
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
                            {highlightText(t("tutorial.uploadHistory.title"), searchTerm, isSearchActive)}
                        </Typography>

                        {/* 段落说明 */}
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                t("tutorial.uploadHistory.description"),
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
                                        <strong>{t("tutorial.uploadHistory.steps.searchAndFilter.title")}</strong> –{" "}
                                        {highlightText(
                                            t("tutorial.uploadHistory.steps.searchAndFilter.description"),
                                            searchTerm, isSearchActive
                                        )}
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {t("tutorial.uploadHistory.steps.searchAndFilter.searchInstructions.enterKeywords")} <strong>'{t("tutorial.uploadHistory.steps.searchAndFilter.searchInstructions.clickSearch")}'</strong>{t("tutorial.uploadHistory.steps.searchAndFilter.searchInstructions.desc1")}
                                        <br />
                                        {t("tutorial.uploadHistory.click")} <strong>'{t("tutorial.uploadHistory.steps.searchAndFilter.searchInstructions.clickClear")}'</strong>{t("tutorial.uploadHistory.steps.searchAndFilter.searchInstructions.desc2")}
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
                                        <strong>{t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.title")}</strong>
                                        <br />
                                        <strong>"{t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.pending.title")}"</strong>: {t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.pending.description")}
                                        <br />
                                        <strong>"{t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.reviewing.title")}"</strong>: {t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.reviewing.description")}
                                        <br />
                                        <strong>"{t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.approved.title")}"</strong>: {t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.approved.description")}
                                        <br />
                                        <strong>"{t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.rejected.title")}"</strong>: {t("tutorial.uploadHistory.steps.searchAndFilter.statusFilter.rejected.description")}
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
                                        <strong>{t("tutorial.uploadHistory.steps.viewDetails.title")}</strong>
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                                        {highlightText(t("tutorial.uploadHistory.click"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.uploadHistory.steps.viewDetails.viewDetails"), searchTerm, isSearchActive)}</strong>
                                        {highlightText(t("tutorial.uploadHistory.steps.viewDetails.description"), searchTerm, isSearchActive)}
                                        <br />
                                        {t("tutorial.uploadHistory.click")} <strong>'{t("tutorial.uploadHistory.steps.viewDetails.closeButton")}'</strong> {t("tutorial.uploadHistory.steps.viewDetails.desc")}
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
                                        <strong>{t("tutorial.uploadHistory.steps.pagination.title")}</strong> –{' '}
                                        {highlightText(
                                            t("tutorial.uploadHistory.steps.pagination.description"),
                                            searchTerm, isSearchActive
                                        )}
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1.5 }}>
                                        {highlightText(
                                            t("tutorial.uploadHistory.steps.pagination.navigation"),
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
                                        <strong>{t("tutorial.uploadHistory.steps.exitAndReturn.title")}</strong> –{' '}
                                        {highlightText(
                                            t("tutorial.uploadHistory.steps.exitAndReturn.description"),
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
                            {highlightText(t('tutorial.gallery.title'), searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                t('tutorial.gallery.description'),
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
                                        <strong>{t('tutorial.gallery.step1.title')}</strong> –{" "}
                                        {highlightText(
                                            t('tutorial.gallery.step1.content'),
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

                                <Box sx={{flex: 1}}>
                                    <Typography variant="body1">
                                        <strong>{t('tutorial.gallery.step2.title')}</strong> –{" "}
                                        {highlightText(
                                            t('tutorial.gallery.step2.content1'),
                                            searchTerm
                                        )}
                                        <strong>{highlightText(t('tutorial.gallery.step2.viewAll'), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t('tutorial.gallery.step2.content2'), searchTerm, isSearchActive)}
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
                            {highlightText(t("tutorial.rankings.title"), searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.rankings.howToEarn"), searchTerm, isSearchActive)}
                        </Typography>

                        <Box sx={styles.body}>
                            <Typography variant="body1">
                                <strong>{t("tutorial.rankings.points.dailyCheckIn.title")}</strong> –{" "}
                                {highlightText(
                                    t("tutorial.rankings.points.dailyCheckIn.description"),
                                    searchTerm, isSearchActive
                                )}
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2 }}>
                                <strong>{t("tutorial.rankings.points.approvedPhotos.title")}</strong> –{" "}
                                {highlightText(
                                    t("tutorial.rankings.points.approvedPhotos.description1"),
                                    searchTerm, isSearchActive
                                )}
                                <br />
                                {highlightText(
                                    t("tutorial.rankings.points.approvedPhotos.description2"),
                                    searchTerm, isSearchActive
                                )}
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2 }}>
                                <strong>{t("tutorial.rankings.points.likes.title")}</strong> –{" "}
                                {highlightText(
                                    t("tutorial.rankings.points.likes.description"),
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
                            {highlightText(t("tutorial.rankings.leaderboard.title"), searchTerm, isSearchActive)}
                        </Typography>

                        <Box sx={styles.body}>
                            <Typography variant="body1">
                                <strong>{t("tutorial.rankings.leaderboard.displayScope.title")}</strong> –{" "}
                                {highlightText(
                                    t("tutorial.rankings.leaderboard.displayScope.description"),
                                    searchTerm, isSearchActive
                                )}
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 2 }}>
                                <strong>{t("tutorial.rankings.leaderboard.pagination.title")}</strong> –{" "}
                                {highlightText(
                                    t("tutorial.rankings.leaderboard.pagination.description"),
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
                            {highlightText(t("tutorial.userinfo.title"), searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.userinfo.description"), searchTerm, isSearchActive)}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1️⃣ Navigate to User Information page */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    📂
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>{t("tutorial.userinfo.step1.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.userinfo.step1.content1"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userinfo.step1.profile"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userinfo.step1.content3"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userinfo.step1.userinfo"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userinfo.step1.content2"), searchTerm, isSearchActive)}
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
                                        <strong>{t("tutorial.userinfo.step2.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.userinfo.step2.content1"), searchTerm)}{" "}
                                        {highlightText( t("tutorial.userinfo.step2.click"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userinfo.step2.save"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userinfo.step2.content3"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userinfo.step2.cancel"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userinfo.step2.content2"), searchTerm, isSearchActive)}
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
                            {highlightText(t("tutorial.photoReview.title"), searchTerm, isSearchActive)}
                        </Typography>

                        {/* Description */}
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                t("tutorial.photoReview.description"),
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
                                        <strong>{t("tutorial.photoReview.step1.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.photoReview.step1.desc1"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.photoReview.step1.fetchPhotos"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(
                                            t("tutorial.photoReview.step1.desc2"),
                                            searchTerm, isSearchActive
                                        )}
                                        <strong>{highlightText(t("tutorial.photoReview.step1.statusApproved"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.photoReview.step1.and"), searchTerm, isSearchActive)}{" "}
                                        <strong>{highlightText(t("tutorial.photoReview.step1.statusRejected"), searchTerm, isSearchActive)}</strong>.
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
                                        <strong>{t("tutorial.photoReview.step2.title")}</strong> –{" "}
                                        {highlightText(
                                            t("tutorial.photoReview.step2.desc1"),
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        <strong>{highlightText(t("tutorial.photoReview.step2.accept"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(
                                            t("tutorial.photoReview.step2.desc2"),
                                            searchTerm, isSearchActive
                                        )}
                                        <strong>{highlightText(t("tutorial.photoReview.step2.reject"), searchTerm, isSearchActive)}</strong>.
                                        <br />
                                        {highlightText(
                                            t("tutorial.photoReview.step2.desc3"),
                                            searchTerm, isSearchActive
                                        )}
                                        <strong>{highlightText(t("tutorial.photoReview.step2.cancel"), searchTerm, isSearchActive)}</strong>.
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
                                        <strong>{t("tutorial.photoReview.step3.title")}</strong> –{" "}
                                        {highlightText(
                                            t("tutorial.photoReview.step3.desc1"),
                                            searchTerm, isSearchActive
                                        )}
                                        <br />
                                        {highlightText(t("tutorial.photoReview.step3.desc2"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.photoReview.step3.photoReview"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.photoReview.step3.or"), searchTerm, isSearchActive)}{" "}
                                        <strong>{highlightText(t("tutorial.photoReview.step3.exit"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.photoReview.step3.desc3"), searchTerm, isSearchActive)}
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
                            {highlightText(t("tutorial.userManagement.title"), searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.userManagement.description"), searchTerm, isSearchActive)}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1. Access Admin Panel */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    🛠️
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>{t("tutorial.userManagement.step1.title")}</strong> –{" "}
                                        {highlightText(
                                            t("tutorial.userManagement.step1.description"),
                                            searchTerm
                                        )}
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
                                        <strong>{t("tutorial.userManagement.step2.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.userManagement.step2.description1"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userManagement.step2.refresh"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userManagement.step2.description2"), searchTerm, isSearchActive)}
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
                                        <strong>{t("tutorial.userManagement.step3.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.userManagement.step3.description1"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userManagement.step3.delete"), searchTerm, isSearchActive)}</strong>.
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
                                        <strong>{t("tutorial.userManagement.step4.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.userManagement.step4.description1"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userManagement.step4.group"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userManagement.step4.description2"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userManagement.step4.joinGroup"), searchTerm, isSearchActive)}</strong>.
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
                                        {highlightText(t("tutorial.userManagement.step4.reminder"), searchTerm, isSearchActive)}
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
                                        {highlightText(t("tutorial.userManagement.step4.description3"), searchTerm, isSearchActive)} <strong>{highlightText(">", searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userManagement.step4.description4"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userManagement.step4.adminGroup"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userManagement.step4.description5"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userManagement.step4.join"), searchTerm, isSearchActive)}</strong>.
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
                                        {highlightText(t("tutorial.userManagement.step4.description6"), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t("tutorial.userManagement.step4.leave"), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t("tutorial.userManagement.step4.description7"), searchTerm, isSearchActive)}
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
                            {highlightText(t("tutorial.photoDownload.title"), searchTerm, isSearchActive)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                t("tutorial.photoDownload.description"),
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
                                        <strong>{t('tutorial.photoDownload.step1.title')}</strong> –{" "}
                                        {highlightText(
                                            t('tutorial.photoDownload.step1.description'),
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
                                        <strong>{t('tutorial.photoDownload.step2.title')}</strong> –{" "}
                                        {highlightText(
                                            t('tutorial.photoDownload.step2.description1'),
                                            searchTerm, isSearchActive
                                        )}
                                        <strong>{highlightText(t('tutorial.photoDownload.step2.viewAll'), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t('tutorial.photoDownload.step2.description2'), searchTerm, isSearchActive)}
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
                                        <strong>{t('tutorial.photoDownload.step3.title')}</strong> –{" "}
                                        {highlightText(t('tutorial.photoDownload.step3.description1'), searchTerm, isSearchActive)}
                                        <strong>{highlightText(t('tutorial.photoDownload.step3.download'), searchTerm, isSearchActive)}</strong>{" "}
                                        {highlightText(t('tutorial.photoDownload.step3.description2'), searchTerm, isSearchActive)}
                                        <br />
                                        {highlightText(
                                            t('tutorial.photoDownload.step3.description3'),
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
                            {highlightText(t("tutorial.faq.title"), searchTerm, isSearchActive)}
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
                                            {highlightText(t("tutorial.faq.photoQuality.title"), searchTerm, isSearchActive)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {t('tutorial.faq.photoQuality.q1')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                {highlightText(t("tutorial.faq.photoQuality.a1"), searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {t('tutorial.faq.photoQuality.q2')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                {highlightText(t("tutorial.faq.photoQuality.a2"), searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Upload Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText(t("tutorial.faq.upload.title"), searchTerm, isSearchActive)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {t('tutorial.faq.upload.q1')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                {highlightText(t('tutorial.faq.upload.a1'), searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {t('tutorial.faq.upload.q2')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                {highlightText(t('tutorial.faq.upload.a2'), searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* 右列 */}
                                <Box>
                                    {/* Address Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText(t("tutorial.faq.address.title"), searchTerm, isSearchActive)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {t('tutorial.faq.address.q1')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                {highlightText(t('tutorial.faq.address.a1'), searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {t('tutorial.faq.address.q2')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                {highlightText(t('tutorial.faq.address.a2'), searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Technical Issues */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#1976d2', fontSize: '1rem' }}>
                                            {highlightText(t("tutorial.faq.technical.title"), searchTerm, isSearchActive)}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {t('tutorial.faq.technical.q1')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                {highlightText(t('tutorial.faq.technical.a1'), searchTerm, isSearchActive)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                {t('tutorial.faq.technical.q2')}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                                {highlightText(t('tutorial.faq.technical.a2'), searchTerm, isSearchActive)}
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
                            {highlightText(t("tutorial.main.title"),searchTerm, isSearchActive)}
                        </Typography>
                        <Divider sx={styles.divider} />
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(
                                t("tutorial.main.welcome"),
                                searchTerm, isSearchActive
                            )}
                        </Typography>

                        {/* 常见问题快速链接 */}
                        <Box sx={{ ...styles.body, mt: 4 }}>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                                {highlightText(t("tutorial.main.quickHelpTitle"), searchTerm, isSearchActive)}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {highlightText(t("tutorial.main.quickHelpIntro"), searchTerm, isSearchActive)}
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
                                        • {highlightText(t("tutorial.main.faqLinks.q1"), searchTerm, isSearchActive)}
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
                                        • {highlightText(t("tutorial.main.faqLinks.q2"), searchTerm, isSearchActive)}
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
                                        • {highlightText(t("tutorial.main.faqLinks.q3"), searchTerm, isSearchActive)}
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
                                        • {highlightText(t("tutorial.main.faqLinks.q4"), searchTerm, isSearchActive)}
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
                                        • {highlightText(t("tutorial.main.faqLinks.q5"), searchTerm, isSearchActive)}
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
                                        • {highlightText(t("tutorial.main.faqLinks.q6"), searchTerm, isSearchActive)}
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
                                        {highlightText(t("tutorial.main.faqLinks.viewAll"), searchTerm, isSearchActive)}
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
                            placeholder={t('Search')+"..."}
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
                                                {t('Search')}
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
                        {sections.map((section, index) => {
                            const isHighlighted = searchResults.includes(section.key);
                            return (
                                <ListItem
                                    key={index}
                                    disablePadding
                                    onClick={() => {
                                        setSelectedSection(section.key);
                                        // 新增：点击菜单项自动跳转到模块
                                        const scrollTarget = sectionRefs.current[section.key];
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
                                            backgroundColor: selectedSection === section.key ? '#1976d2' : 'transparent',
                                            color: selectedSection === section.key ? 'white' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: selectedSection === section.key ? '#1565c0' : '#f5f5f5',
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={highlightText(section.label, searchTerm, isSearchActive && searchResults.includes(section.label))} //  第三处更新：统一调用方式
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