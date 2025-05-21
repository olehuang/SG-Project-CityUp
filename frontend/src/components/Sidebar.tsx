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
import UploadHistory from "./UploadHistory";
import Upload from "./Upload";
import Tutorial from  "./Tutorial";
import ProductIntroduction from "./ProductIntroduction";
import BuildingInfo from "./BuildingInfo";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}



const Sidebar = ({ open, onClose }: SidebarProps) => {
    const {token}=useAuthHook();

    return (
        <Drawer open={open} onClick={onClose}>
            <Box sx={{ width: 250 }} role="presentation" >{/*onClose={onClose}*/}
                <Box>
                    <List>
                        <ListItem key={'dashboard'} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                </ListItemIcon>
                                <ListItemText primary={'dashboard'} />
                            </ListItemButton>
                        </ListItem>
                        {/* Upload 页面入口 */}
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/upload">
                                <ListItemIcon><UploadIcon/></ListItemIcon>
                                {/*<Upload/>*/}
                                <ListItemText primary="Upload" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>

                        <Profile token={token}/>
                        <Tutorial/>
                        <BuildingInfo/>
                        <UploadHistory/>
                        <ProductIntroduction/>
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