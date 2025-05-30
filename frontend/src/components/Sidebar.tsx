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
import UploadIcon from '@mui/icons-material/Upload';      // ← 新增图标
import { Link } from 'react-router-dom';                 // ← 引入 Link


import  {useNavigate} from 'react-router-dom';
import Keycloak from "./keycloak";
import AuthProvider, {useAuthHook} from "./AuthProvider";
import LogOut from "./LogOut";
import Profile from "./Profile";
import UploadHistory from "../pages/UploadHistory";
import Upload from "../pages/Upload";
import Tutorial from "../pages/Tutorial";
import ProductIntroduction from "../pages/ProductIntroduction";
import BuildingInfo from "../pages/BuildingInfo";
import {useEffect, useState} from "react";
import KeycloakClient from "./keycloak";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}



const Sidebar = ({ open, onClose }: SidebarProps) => {
    const {token}=useAuthHook();
    const [roles, setRoles] = useState<string[]>([]);
    useEffect(() => {
        const fetchRoles = async () => {
            const userInfo= await KeycloakClient.extractUserInfo(token);
            setRoles(userInfo?.roles||[]);
            console.log(userInfo?.roles);
        }
        if (token!==null && token!==undefined) {
            fetchRoles();
        }
    },[token]);

    return (
        <Drawer open={open} onClick={onClose}>
            <Box sx={{ width: 250 }} role="presentation" >{/*onClose={onClose}*/}
                <Box>
                    <List>
                        <ListItem key={'dashboard'} disablePadding >
                            <ListItemButton component={Link} to={"/dashboard"}>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary='dashboard' />
                            </ListItemButton>
                        </ListItem>
                        {/* Upload 页面入口 */}
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/upload">
                                <ListItemIcon><UploadIcon/></ListItemIcon>
                                <ListItemText primary="Upload" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <Profile token={token}/>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/tutorial">
                                <ListItemIcon></ListItemIcon>
                                <ListItemText primary="Tutorial" />
                            </ListItemButton>
                        </ListItem>
                        <ListItemButton  component={Link} to="/dashboard/buildingInformation">
                            <ListItemIcon>
                            </ListItemIcon>
                            <ListItemText primary="Building Information" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/dashboard/uploadHistory" >
                            <ListItemIcon>
                            </ListItemIcon>
                            <ListItemText primary="History" />
                        </ListItemButton>
                        <ListItemButton  component={Link} to="/dashboard/productIntroduction">
                            <ListItemIcon>
                            </ListItemIcon>
                            <ListItemText primary="Product Introduction" />
                        </ListItemButton>
                        {roles.includes('admin') &&
                            <ListItemButton component={Link} to="/dashboard/photoReview">
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary="Photo Review " />
                            </ListItemButton>}

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