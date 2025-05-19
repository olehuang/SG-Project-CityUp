import AuthProvider, {useAuthHook} from "./AuthProvider";
import KeycloakClient from "./keycloak";

import {useContext} from "react";
import {Button} from "@mui/material";

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
        <Button onClick={handleLogOut} style={{textAlign:"center"}}>LogOut</Button>
    )
}


export default LogOut ;