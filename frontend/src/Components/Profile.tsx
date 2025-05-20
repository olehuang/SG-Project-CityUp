import {useState} from "react";
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeycloakClient from "./keycloak";
import {AuthProvider,useAuthHook} from "../components/AuthProvider";


const Profile = ()=>{
    const [openProfile, setOpenProfile] = useState(false);
    const {user_id,userInfo}=useAuthHook();
    const [admin,setAdmin]=useState(false);
    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();//
        setOpenProfile(!openProfile);
    };


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
                <ListItemIcon>
                </ListItemIcon>
                <ListItemText primary="Profile" />
                {openProfile ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openProfile} >
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={handleToProfile} >
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="User Information" />
                    </ListItemButton>
                    {
                        <ListItemButton sx={{ pl: 4 }} onClick={hanldAdminPanel}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="Admin Panel" />
                    </ListItemButton>}
                    <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                        </ListItemIcon>
                        <ListItemText primary="History" />
                    </ListItemButton>

                </List>
            </Collapse>
        </List>
    )
}


export default Profile;