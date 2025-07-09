import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import UploadIcon from '@mui/icons-material/Upload';      // ← neu Icon
import { Link } from 'react-router-dom';                 // ← import Link
import  {useNavigate,useLocation} from 'react-router-dom';
import Keycloak from "./keycloak";
import AuthProvider, {useAuthHook} from "./AuthProvider";
import LogOut from "./LogOut";
import Profile from "./Profile";
import UploadHistory from "../pages/UploadHistory";
import Upload from "../pages/Upload";
import Tutorial from "../pages/Tutorial";
import ProductIntroduction from "../pages/ProductIntroduction";
import BuildingPhotoGallery from "../pages/BuildingPhotoGallery";
import {useEffect, useState} from "react";
import KeycloakClient from "./keycloak";
import {Checklist, History, Info, MenuBook, PhotoLibrary, RateReview} from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    variant: 'temporary' | 'permanent'; // new
}



const Sidebar = ({ open, onClose, variant }: SidebarProps) => {
    const {token}=useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);


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
                        {/*<ListItem key={'dashboard'} disablePadding >*/}
                        {/*    <ListItemButton component={Link} to={"/dashboard"}>*/}
                        {/*        <ListItemIcon>*/}
                        {/*        </ListItemIcon>*/}
                        {/*        <ListItemText primary='dashboard' />*/}
                        {/*    </ListItemButton>*/}
                        {/*</ListItem>*/}
                        <Profile token={token}/>
                    </List>
                    <Divider />
                    <List>

                        {/* Upload 页面入口 */}
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/upload">
                                <ListItemIcon><UploadIcon/></ListItemIcon>
                                <ListItemText primary="Upload" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/tutorial">
                                <ListItemIcon><MenuBook  /></ListItemIcon>
                                <ListItemText primary="Tutorial" />
                            </ListItemButton>
                        </ListItem>

                        <ListItemButton  component={Link} to="/dashboard/buildingPhoto">
                            <ListItemIcon><PhotoLibrary />
                            </ListItemIcon>
                            <ListItemText primary="Building Photo Gallery" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/dashboard/uploadHistory" >
                            <ListItemIcon><History  />
                            </ListItemIcon>
                            <ListItemText primary="History" />
                        </ListItemButton>
                        <ListItemButton  component={Link} to="/dashboard/productIntroduction">
                            <ListItemIcon><Info/>
                            </ListItemIcon>
                            <ListItemText primary="Product Introduction" />
                        </ListItemButton>

                        {roles.includes('admin') &&
                            <ListItemButton component={Link} to="/dashboard/photoReview">
                                <ListItemIcon><RateReview  />
                                </ListItemIcon>
                                <ListItemText primary="Photo Review " />
                            </ListItemButton>}
                        <ListItemButton  component={Link} to="/dashboard/ranking">
                            <ListItemIcon><Checklist />
                            </ListItemIcon>
                            <ListItemText primary="Rankings" />
                        </ListItemButton>

                    </List>
                </Box>
                <Divider />
                <Box>
                    <Divider />
                    <List>
                        <LogOut />
                    </List>
                </Box>
            </Box>
        </Drawer>
    );
}
export default Sidebar;