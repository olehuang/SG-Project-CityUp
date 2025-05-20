
import { Routes,Route,BrowserRouter,Link} from 'react-router-dom';
import React, {useState, useEffect, useContext} from "react";
import {Button} from "@mui/material";

import { AuthProvider,useAuthHook} from "../components/AuthProvider";
import KeycloakClient from "../components/keycloak";

const HomePage = () => {
    const {auth,setAuth,setAuthLoading}=useAuthHook();

    const hanldeLogin= async ()=>{
        //click Get Start translat to keycloak webseite
        await KeycloakClient.creatKeycloak.login({
                redirectUri: `${window.location.origin}/dashboard`,
            }
        )

        setAuthLoading(false);
    }

    return(
        <Button onClick={hanldeLogin}>GetStart</Button>
    )
}



export default HomePage;