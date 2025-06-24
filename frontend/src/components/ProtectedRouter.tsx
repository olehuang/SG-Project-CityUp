
import React, {JSX, useState} from "react";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import { useAuthHook } from "./AuthProvider";
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import  Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Typography} from "@mui/material";
import LoadingPage from "../pages/LoadingPage";

/**
 *  Protected Web from User bypass to Keycloak
 *
 * **/
const ProtectedRouter=()=> {
    const {auth, authLoading} = useAuthHook();

    /**
     * if user between auth and unauth status will be Loading page to show
     *
     * **/
    if (authLoading) {
        return <LoadingPage />; //If user with URL bypass Keycloak Authentikat
    }
    //if user no load, trans to homepage
    if (!auth) {
        return <Navigate to="/" replace/>;
    }

    return (
        <Outlet/>
    );


}


export default ProtectedRouter;

