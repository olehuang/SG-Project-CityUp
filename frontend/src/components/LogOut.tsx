import AuthProvider, {useAuthHook} from "./AuthProvider";
import KeycloakClient from "./keycloak";

import {useContext} from "react";
import {Button} from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const LogOut = () => {
    const {auth,setAuth}=useAuthHook();
    const handleLogOut= async ()=>{
        //keycloak logout
        KeycloakClient.creatKeycloak.logout({
            redirectUri: `${window.location.origin}`,
        });
        setAuth(false);
    }
    return (
        <List>
            <ListItemButton onClick={handleLogOut} style={{textAlign:"center"}}>
                <ListItemText primary="LogOut" />
                <ListItemIcon>
                </ListItemIcon>
            </ListItemButton>
        </List>
    )
}


export default LogOut ;