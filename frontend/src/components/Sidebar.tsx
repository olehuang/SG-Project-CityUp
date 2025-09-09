import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import UploadIcon from '@mui/icons-material/Upload';      // ← neu Icon
import { Link } from 'react-router-dom';                 // ← import Link
import {useAuthHook} from "./AuthProvider";
import LogOut from "./LogOut";
import Profile from "./Profile";
import UploadHistory from "../pages/UploadHistory";
import Upload from "../pages/Upload";
import Tutorial from "../pages/Tutorial";
import ProductIntroduction from "../pages/ProductIntroduction";
import PhotoGallery from "../pages/PhotoGallery";
import {useEffect, useState} from "react";
import KeycloakClient from "./keycloak";
import {Checklist, History, Info, MenuBook, PhotoLibrary, RateReview, Language} from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from 'react-i18next';
interface SidebarProps {
    open: boolean;
    onClose: () => void;
    variant: 'temporary' | 'permanent'; // new
}



const Sidebar = ({ open, onClose, variant }: SidebarProps) => {
    const {token}=useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);
    const { i18n,t } = useTranslation()
    const [language, setLanguage] = useState("en");
    const [giveLanguage, setGiveLanguage] = useState("en");
    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const newLang = currentLang === 'en' ? 'de' : 'en';
        i18n.changeLanguage(newLang);
        setLanguage(newLang);
    };
    useEffect(() => {
        const fetchRoles = async () => {
            const userInfo= await KeycloakClient.extractUserInfo(token);
            setRoles(userInfo?.roles||[]);
        }
        if (token!==null && token!==undefined) {
            fetchRoles();
        }
    },[token]);

    return (
        <Drawer open={open} onClick={onClose} variant={variant} ModalProps={{ keepMounted: true }} >
            <Box sx={{  width: { xs: 220, sm: 250 },  }} role="presentation" onClick={variant === 'temporary' ? onClose : undefined}>{/*onClose={onClose}*/}
                <Box>
                    <List>

                        <Profile token={token}/>
                    </List>
                    <Divider />
                    <List>

                        {/* Upload Page entry */}
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/upload">
                                <ListItemIcon><UploadIcon/></ListItemIcon>
                                <ListItemText primary={t('bar.upload')} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/tutorial">
                                <ListItemIcon><MenuBook  /></ListItemIcon>
                                <ListItemText primary={t('bar.tutorial')} />
                            </ListItemButton>
                        </ListItem>

                        <ListItemButton  component={Link} to="/dashboard/photoGallery">
                            <ListItemIcon><PhotoLibrary /></ListItemIcon>
                            <ListItemText primary={t('bar.photoGallery')}/>
                        </ListItemButton>
                        <ListItemButton component={Link} to="/dashboard/uploadHistory" >
                            <ListItemIcon><History  />
                            </ListItemIcon>
                            <ListItemText primary={t('bar.uploadHistory')} />
                        </ListItemButton>
                        <ListItemButton  component={Link} to="/dashboard/productIntroduction">
                            <ListItemIcon><Info/>
                            </ListItemIcon>
                            <ListItemText primary={t('bar.productIntroduction')} />
                        </ListItemButton>

                        {roles.includes('admin') &&
                            <ListItemButton component={Link} to="/dashboard/photoReview">
                                <ListItemIcon><RateReview  />
                                </ListItemIcon>
                                <ListItemText primary={t('bar.photoReview')} />
                            </ListItemButton>}
                        <ListItemButton  component={Link} to="/dashboard/ranking">
                            <ListItemIcon><Checklist />
                            </ListItemIcon>
                            <ListItemText primary={t('bar.ranking')} />
                        </ListItemButton>

                    </List>
                </Box>
                <Divider />
                <Box>
                    <Divider />
                    <List>
                        {/* 添加语言选择器 */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={toggleLanguage}>
                                <ListItemIcon><Language /></ListItemIcon>
                                <ListItemText
                                    primary={i18n.language === 'en' ? 'English' : 'Deutsch'}
                                />
                            </ListItemButton>
                        </ListItem>
                        <LogOut />
                    </List>
                </Box>
            </Box>
        </Drawer>
    );
}
export default Sidebar;