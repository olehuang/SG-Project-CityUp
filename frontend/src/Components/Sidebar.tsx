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

import  {useNavigate} from 'react-router-dom';
import Keycloak from "./keycloak";
import AuthProvider from "./AuthProvider";
import LogOut from "./LogOut";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}




const DrawerList = (
    <Box>
        <List>
            <ListItem key={'dashboard'} disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary={'dashboard'} />
                </ListItemButton>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem key={'Profile'} disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        Profile
                    </ListItemIcon>
                    <ListItemText  />
                </ListItemButton>
            </ListItem>
            <ListItem key={'LogOut'}>
                <ListItemButton >
                    <ListItemIcon>
                        <LogOut/>
                    </ListItemIcon>
                    <ListItemText  />
                </ListItemButton>
            </ListItem>
        </List>
    </Box>
);

const Sidebar = ({ open, onClose }: SidebarProps) => {

    return (
        <Drawer open={open} onClose={onClose}>
            <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
                {DrawerList}
            </Box>
        </Drawer>
    );
}
export default Sidebar;