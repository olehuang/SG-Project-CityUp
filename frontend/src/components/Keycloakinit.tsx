import KeycloakClient from "./keycloak";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {Outlet} from "react-router-dom";
import {useAuthHook} from "./AuthProvider";
import {useEffect, useState} from "react";


const KeycloakInit = () => {

    const {auth,setAuth,user_id,setUserID,authLoading,setAuthLoading,setToken}=useAuthHook();


    //listen Keycloak Certification status changes
    useEffect(() => {
        //macke sure login
        KeycloakClient.creatKeycloak.onAuthSuccess = () => {
            setAuth(true);//recoder login status from Keycloak
            setAuthLoading(false);

        };
        //after user Login fetch user Setting from MongoDB

    }, [user_id,auth]);


    const onKeycloakTokens = (tokens:any) => {
        const {token} = tokens || {};
        try{
            setToken(token); //  token to storge

            KeycloakClient.extractUserInfo(token)
                .then(userInfo => {
                    if (userInfo) {
                        setUserID(userInfo.userId)//global
                        setAuthLoading(false);
                        setToken(token);
                        console.log(userInfo);
                    }
                });
        }catch (error:any){
            console.log(error);           // print to console
            // addAlert("Failed to obtain Keycloak token: " + error.message, "error");
        }
    };
    return (
    <ReactKeycloakProvider // Keycloak Provider beginn
        authClient={KeycloakClient.creatKeycloak}
        onTokens={onKeycloakTokens}
        initOptions={{onload:"login-required", checkLoginIframe:"true"}}
    >
        <Outlet/>
    </ReactKeycloakProvider>
    )
}


export default KeycloakInit;