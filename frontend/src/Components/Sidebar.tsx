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

        </List>
    </Box>
);

// const DrawerList = (
//       <Box>
//             <List>
//               {/* 仪表盘入口 */}
//               <ListItem disablePadding>
//                 <ListItemButton component={Link} to="/dashboard">
//                   <ListItemIcon>
//                     <InboxIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="Dashboard" />
//                 </ListItemButton>
//               </ListItem>
//               {/* Upload 入口 */}
//               <ListItem disablePadding>
//                 <ListItemButton component={Link} to="/dashboard/upload">
//                   <ListItemIcon>
//                     <UploadIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="Upload" />
//                 </ListItemButton>
//               </ListItem>
//             </List>
//             <Divider />
//             <List>
//               {/* 这里可以继续添加其他分组或菜单项 */}
//             </List>
//           </Box>
//     );

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