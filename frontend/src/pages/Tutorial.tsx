import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import pageBackgroundStyles from "./pageBackgroundStyles";
import React, { useEffect, useState, } from "react";
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
import { useTranslation } from 'react-i18next';

const Tutorial = () => {
    const drawerWidth = 240;
    const { token } = useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedSection, setSelectedSection] = useState("Tutorial");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<string[]>([]);
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
        "Tutorial",
        "Photograph",
        "Photo Upload",
        "Upload History",
        "Building Photo Gallery",
        "User Information",
        "FAQ",
        ...(roles.includes("admin") ? ["Photo Review", "Photo Download","User Management"] : [])
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
                            {highlightText(t("tutorial.photograph.title"), searchTerm)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.photograph.description"), searchTerm)}
                        </Typography>

                        {/* ✅ Good examples */}
                        <Box sx={{ ...styles.body, mt: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#4caf50", mr: 1, fontWeight: "bold" }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t("tutorial.photograph.noShadows.title")}</strong> –{" "}
                                    {highlightText(t("tutorial.photograph.noShadows.description"), searchTerm)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#4caf50", mr: 1, fontWeight: "bold" }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t("tutorial.photograph.noObstructions.title")}</strong> –{" "}
                                    {highlightText(t("tutorial.photograph.noObstructions.description"), searchTerm)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#4caf50", mr: 1, fontWeight: "bold" }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t("tutorial.photograph.straightPerspective.title")}</strong> –{" "}
                                    {highlightText(t("tutorial.photograph.straightPerspective.description"), searchTerm)}
                                </Typography>
                            </Box>

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
                                {highlightText(t("tutorial.photograph.incorrectExamples.title"), searchTerm)}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "flex-start", mt: 2, mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#f44336", mr: 1, fontWeight: "bold" }}>
                                    ❌
                                </Typography>
                                <Typography variant="body1">
                                    {highlightText(t("tutorial.photograph.incorrectExamples.tooManyObstructions"), searchTerm)}
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
                                    {highlightText(t("tutorial.photograph.incorrectExamples.buildingWithShadow"), searchTerm)}
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
                            {highlightText(t("tutorial.photoUpload.title"), searchTerm)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.photoUpload.description"), searchTerm)}
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
                                        {highlightText(t("tutorial.photoUpload.setLocation.description"), searchTerm)}
                                        <br />
                                        <strong>{t("tutorial.photoUpload.setLocation.browserOptions.intro")}</strong>
                                        <br />
                                        <strong>"{t("tutorial.photoUpload.setLocation.browserOptions.allowWhileVisiting.title")}"</strong> –{" "}
                                        {highlightText(t("tutorial.photoUpload.setLocation.browserOptions.allowWhileVisiting.description"), searchTerm)}
                                        <br />
                                        <strong>"{t("tutorial.photoUpload.setLocation.browserOptions.allowThisTime.title")}"</strong> –{" "}
                                        {highlightText(t("tutorial.photoUpload.setLocation.browserOptions.allowThisTime.description"), searchTerm)}
                                        <br />
                                        <strong>"{t("tutorial.photoUpload.setLocation.browserOptions.neverAllow.title")}"</strong> –{" "}
                                        {highlightText(t("tutorial.photoUpload.setLocation.browserOptions.neverAllow.description"), searchTerm)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* 2. Upload photos */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    📷
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t("tutorial.photoUpload.uploadPhotos.title")}</strong>
                                    <br />
                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Choose%20photos.png"
                                            alt="Choose photo example"
                                            style={{ width: '800px', borderRadius: 8 }}
                                        />
                                    </Box>
                                    {highlightText(t("tutorial.photoUpload.uploadPhotos.click"), searchTerm)}
                                    <strong>{highlightText(`'${t("tutorial.photoUpload.uploadPhotos.shootingUpload.buttonText")}'`, searchTerm)}</strong>
                                    {highlightText(t("tutorial.photoUpload.uploadPhotos.shootingUpload.description"), searchTerm)}
                                    <br />
                                    {highlightText(t("tutorial.photoUpload.uploadPhotos.click"), searchTerm)}
                                    <strong>{highlightText(`'${t("tutorial.photoUpload.uploadPhotos.albumUpload.buttonText")}'`, searchTerm)}</strong>
                                    {highlightText(t("tutorial.photoUpload.uploadPhotos.albumUpload.description"), searchTerm)}
                                </Typography>
                            </Box>

                            {/* 3. Finalize upload */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: '#2196f3', mr: 1, fontWeight: 'bold' }}>
                                    ✅
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t("tutorial.photoUpload.finalizeUpload.title")}</strong>
                                    <br />
                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Submit.png"
                                            alt="Choose photo example"
                                            style={{ width: '600px', borderRadius: 8 }}
                                        />
                                    </Box>
                                    {highlightText(t("tutorial.photoUpload.uploadPhotos.click"), searchTerm)}
                                    <strong>{highlightText(`'${t("tutorial.photoUpload.finalizeUpload.submit.buttonText")}'`, searchTerm)}</strong>
                                    {highlightText(t("tutorial.photoUpload.finalizeUpload.submit.description"), searchTerm)}
                                    <br />
                                    {highlightText(t("tutorial.photoUpload.uploadPhotos.click"), searchTerm)}
                                    <strong>{highlightText(`'${t("tutorial.photoUpload.finalizeUpload.remove.buttonText")}'`, searchTerm)}</strong>
                                    {highlightText(t("tutorial.photoUpload.finalizeUpload.remove.description"), searchTerm)}
                                    <Box sx={{ mt: 1.5 }}>
                                        <img
                                            src="/assets/Uploadsucess.png"
                                            alt="Choose photo example"
                                            style={{ width: '600px', borderRadius: 8 }}
                                        />
                                    </Box>
                                    <br />
                                    {highlightText(t("tutorial.photoUpload.finalizeUpload.successMessage"), searchTerm)}
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
                            {highlightText(t("tutorial.uploadHistory.title"), searchTerm)}
                        </Typography>

                        {/* 段落说明 */}
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.uploadHistory.description"), searchTerm)}
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
                                        {highlightText(t("tutorial.uploadHistory.steps.searchAndFilter.description"), searchTerm)}
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

                                {/* 文字内容包一层 */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>{t("tutorial.uploadHistory.steps.viewDetails.title")}</strong> {" "}
                                        <br />
                                        {highlightText(t("tutorial.uploadHistory.click"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.uploadHistory.steps.viewDetails.viewDetails"), searchTerm)}</strong>
                                        {highlightText(t("tutorial.uploadHistory.steps.viewDetails.description"), searchTerm)}
                                        <br />
                                        {t("tutorial.uploadHistory.click")} <strong>'{t("tutorial.uploadHistory.steps.viewDetails.closeButton")}'</strong> {t("tutorial.uploadHistory.steps.viewDetails.desc")}
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

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    📁
                                </Typography>

                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>{t("tutorial.uploadHistory.steps.pagination.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.uploadHistory.steps.pagination.description"), searchTerm)}
                                    </Typography>

                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {highlightText(t("tutorial.uploadHistory.steps.pagination.navigation"), searchTerm)}
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
                                        <strong>{t("tutorial.uploadHistory.steps.exitAndReturn.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.uploadHistory.steps.exitAndReturn.description"), searchTerm)}
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
                            {highlightText(t('tutorial.gallery.title'), searchTerm)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t('tutorial.gallery.description'), searchTerm)}
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
                                        <strong>{t('tutorial.gallery.step1.title')}</strong> –{" "}
                                        {highlightText(t('tutorial.gallery.step1.content'), searchTerm)}
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

                                <Box sx={{flex: 1}}>
                                    <Typography variant="body1">
                                        <strong>{t('tutorial.gallery.step2.title')}</strong> –{" "}
                                        {highlightText(t('tutorial.gallery.step2.content1'), searchTerm)}
                                        <strong>{highlightText(t('tutorial.gallery.step2.viewAll'), searchTerm)}</strong>{" "}
                                        {highlightText(t('tutorial.gallery.step2.content2'), searchTerm)}
                                    </Typography>

                                    <Box sx={{mt: 2}}>
                                        <img
                                            src="/assets/Selectone.png"
                                            alt="Select Photo"
                                            style={{
                                                width: "100%",
                                                maxWidth: 1000,
                                                borderRadius: 8,
                                                display: "block",
                                                marginBottom: 12,
                                            }}
                                        />
                                        <img
                                            src="/assets/viewPhoto.png"
                                            alt="View Photo"
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

                        </Box>
                    </Box>
                );

            case "User Information":
                return (
                    <Box sx={{ ...styles.tutorialModelBox, paddingBottom: "80px" }}>
                        <Typography variant="h4" sx={styles.title}>
                            {highlightText(t("tutorial.userinfo.title"), searchTerm)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.userinfo.description"), searchTerm)}
                        </Typography>

                        <Box sx={{ ...styles.body, mt: 2 }}>
                            {/* 1. Navigate to User Information page */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    📂
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>{t("tutorial.userinfo.step1.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.userinfo.step1.content1"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.userinfo.step1.profile"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.userinfo.step1.content3"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.userinfo.step1.userinfo"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.userinfo.step1.content2"), searchTerm)}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/userinfo1.png"
                                            alt="User Information navigation"
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

                            {/* 2. Modify personal details */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography
                                    variant="body1"
                                    sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}
                                >
                                    ✏️
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>{t("tutorial.userinfo.step2.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.userinfo.step2.content1"), searchTerm)}{" "}
                                        {highlightText(
                                            t("tutorial.userinfo.step2.click"),
                                            searchTerm
                                        )}
                                        <strong>{highlightText(t("tutorial.userinfo.step2.save"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.userinfo.step2.content3"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.userinfo.step2.cancel"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.userinfo.step2.content2"), searchTerm)}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/userinfo2.png"
                                            alt="Edit user information"
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
                            {highlightText(t("tutorial.photoReview.title"), searchTerm)}
                        </Typography>

                        {/* Description */}
                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.photoReview.description"), searchTerm)}
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
                                        {highlightText(t("tutorial.photoReview.step1.desc1"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.photoReview.step1.fetchPhotos"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.photoReview.step1.desc2"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.photoReview.step1.statusApproved"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.photoReview.step1.and"), searchTerm)}{" "}
                                        <strong>{highlightText(t("tutorial.photoReview.step1.statusRejected"), searchTerm)}</strong>.
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
                                        <strong>{t("tutorial.photoReview.step2.title")}</strong> –{" "}
                                        {highlightText(t("tutorial.photoReview.step2.desc1"), searchTerm)}
                                        <br />
                                        <strong>{highlightText(t("tutorial.photoReview.step2.accept"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.photoReview.step2.desc2"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.photoReview.step2.reject"), searchTerm)}</strong>.
                                        <br />
                                        {highlightText(t("tutorial.photoReview.step2.desc3"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.photoReview.step2.cancel"), searchTerm)}</strong>.
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
                                        <img
                                            src="/assets/batch.png"
                                            alt="select batch photo example"
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
                                        {highlightText(t("tutorial.photoReview.step3.desc1"), searchTerm)}
                                        <br />
                                        {highlightText(t("tutorial.photoReview.step3.desc2"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.photoReview.step3.photoReview"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.photoReview.step3.or"), searchTerm)}{" "}
                                        <strong>{highlightText(t("tutorial.photoReview.step3.exit"), searchTerm)}</strong>{" "}
                                        {highlightText(t("tutorial.photoReview.step3.desc3"), searchTerm)}
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
                            {highlightText(t("tutorial.userManagement.title"), searchTerm)}
                        </Typography>

                        <Typography variant="body1" sx={styles.body}>
                            {highlightText(t("tutorial.userManagement.description"), searchTerm)}
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
                                        {highlightText(t("tutorial.userManagement.step1.description"), searchTerm)}
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
                                        <strong>{t("tutorial.userManagement.step2.title")}</strong> –{" "}
                                        {t("tutorial.userManagement.step2.description1")}
                                        <strong>{t("tutorial.userManagement.step2.refresh")}</strong>{" "}
                                        {t("tutorial.userManagement.step2.description2")}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/managment.png"
                                            alt="User search example"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 3. Delete Users */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    ➖
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>{t("tutorial.userManagement.step3.title")}</strong> <br />
                                        {t("tutorial.userManagement.step3.description1")}
                                        <strong>{t("tutorial.userManagement.step3.delete")}</strong>.
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/delete.png"
                                            alt="Delete user example"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            {/* 4. Add User as Admin */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                                <Typography variant="body1" sx={{ color: "#2196f3", mr: 1, fontWeight: "bold" }}>
                                    ➕
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">
                                        <strong>{t("tutorial.userManagement.step4.title")}</strong>
                                        <br />
                                        {t("tutorial.userManagement.step4.description1")}
                                        <strong>{t("tutorial.userManagement.step4.group")}</strong>
                                        {t("tutorial.userManagement.step4.description2")}
                                        <strong>{t("tutorial.userManagement.step4.joinGroup")}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin1.png"
                                            alt="Step 1 - Select user and click Group"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin2.png"
                                            alt="Step 2 - Choose Join Group"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {highlightText(t("tutorial.userManagement.step4.reminder"), searchTerm)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin3.png"
                                            alt="Reminder - Keep user in User group"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {highlightText(t("tutorial.userManagement.step4.description3"), searchTerm)} <strong>{highlightText(">", searchTerm)}</strong>
                                        {highlightText(t("tutorial.userManagement.step4.description4"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.userManagement.step4.adminGroup"), searchTerm)}</strong>
                                        {highlightText(t("tutorial.userManagement.step4.description5"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.userManagement.step4.join"), searchTerm)}</strong>.
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin4.png"
                                            alt="Step 4 - Navigate to groups"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin5.png"
                                            alt="Step 5 - Join admin group"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {highlightText(t("tutorial.userManagement.step4.description6"), searchTerm)}
                                        <strong>{highlightText(t("tutorial.userManagement.step4.leave"), searchTerm)}</strong>
                                        {highlightText(t("tutorial.userManagement.step4.description7"), searchTerm)}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin6.png"
                                            alt="Remove user from admin - step 1"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin7.png"
                                            alt="Confirm admin leave"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src="/assets/addadmin8.png"
                                            alt="Success message shown"
                                            style={{ width: "100%", maxWidth: 1000, borderRadius: 8, display: "block" }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ) : null;

            case "Photo Download":
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
                            placeholder={t('Search')+"..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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