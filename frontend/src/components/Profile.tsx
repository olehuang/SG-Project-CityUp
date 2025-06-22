import {useEffect, useState} from "react";
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeycloakClient from "./keycloak";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';


const Profile = ({ token }: { token: string })=>{
    const [openProfile, setOpenProfile] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);

    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();//
        setOpenProfile(!openProfile);
    };

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

    const keycloakBaseUrl = "http://localhost:8080";

    const hanldAdminPanel=()=>{
        window.open(`${keycloakBaseUrl}/admin/master/console/#/master/users`, "_blank")
    }

    const handleToProfile= ()=>{

        window.open(`${keycloakBaseUrl}/realms/master/account`, "_blank");
    }

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <ListItemButton onClick={handleClick} >
                <ListItemIcon><AccountBoxIcon/>
                </ListItemIcon>
                <ListItemText primary="Profile" />
                {openProfile ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openProfile} >
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={handleToProfile} >
                        <ListItemIcon><AccountCircleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="User Information" />
                    </ListItemButton>
                    {roles.includes('admin') &&
                        <ListItemButton sx={{ pl: 4 }} onClick={hanldAdminPanel}>
                        <ListItemIcon><SupervisorAccountIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Admin Panel" />
                    </ListItemButton>}
                </List>
            </Collapse>
        </List>
    )
}


export default Profile;