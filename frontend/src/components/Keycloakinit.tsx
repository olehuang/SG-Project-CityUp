import KeycloakClient from "./keycloak";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {Outlet} from "react-router-dom";
import {useAuthHook} from "./AuthProvider";
import {useEffect, useState} from "react";
import {routes} from "@keycloak/keycloak-account-ui/lib/routes";

import axios from "axios";


const KeycloakInit = () => {

    const {auth,setAuth,user_id,setUserID,authLoading,setAuthLoading,setToken}=useAuthHook();
    const [userInfo,setUserInfo]=useState<any>({});
    const [role0,setRole0]=useState<string>("");
    //listen Keycloak Certification status changes
    useEffect(() => {
        //macke sure login
        KeycloakClient.creatKeycloak.onAuthSuccess = () => {
            setAuth(true);//recoder login status from Keycloak
            setAuthLoading(false);

        };
       //if use no in DB storaged, save in DB
        if (user_id) {
            checkUser(user_id);
            checkRole(user_id)
        }
    }, [user_id,auth]);


    const onKeycloakTokens = (tokens:any) => {
        const {token} = tokens || {};
        try{
            setToken(token); //  token to storge

            KeycloakClient.extractUserInfo(token)
                .then(userInfo => {
                    if (userInfo) {
                        setUserInfo(userInfo);
                        setUserID(userInfo.userId)//global
                        setAuthLoading(false);
                        setToken(token);
                        setRole0(userInfo.roles[0])
                        console.log(userInfo);
                    }
                });
        }catch (error:any){
            console.log(error);           // print to console
            // addAlert("Failed to obtain Keycloak token: " + error.message, "error");
        }
    };

    const uploadRole =async (user_id:any,role="user")=>{
         const url=`http://127.0.0.1:8000/users/update_user`;
         const payload={user_id, role}
        console.log("payload in upload role",payload);
         try{
             const response = await fetch(url, {
                 method: "POST",
                 headers: {
                     "Content-Type": "application/json"
                 },
                 body: JSON.stringify(payload)
             });
             if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.detail || "Upload user role faile");
             }
             const data = await response.json();
             console.log("Upload user role seccessfull", data);
         }catch (error:any){
             console.error("Something wrong with uploading user role ：", error);
         }
    }

    const checkUser=async (user_id:any)=>{
        const url=`http://127.0.0.1:8000/users/check_user`;
        try{
            const response = await axios.get(url,{ params: { user_id } });
            const data = response.data;

            if (data===false){
                saveUser(userInfo)
            }
        }catch (error:any){
            console.error("Something wrong with checking user ：", error);
        }
    }

    const checkRole=async (user_id:any)=>{
        const url=`http://127.0.0.1:8000/users/check_role`;
        try{
            const response = await axios.get(url,{ params: { user_id } });
            const data =  response.data;

            if (data!==userInfo.roles[0]){
                if (userInfo.roles[0]==="admin") {
                    uploadRole(userInfo.userId,"admin");
                }else{
                    uploadRole(userInfo.userId);
                }
            }else if(!data){return}
        }catch (error:any){
            console.error("Something wrong with checking role ：", error);
        }
    }
    const saveUser=async (userInfo:any)=>{
        const url=`http://127.0.0.1:8000/users/save_user`;
        const payload={
            user_id:userInfo.userId,
            username:userInfo.userName,
            email:userInfo.email,
            role: userInfo.roles && userInfo.roles.length > 0 ? userInfo.roles[0] : "user"
        }
        console.log("payload to save user:",payload);
        try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Save user faile");
            }

            const data = await response.json();
            console.log("save user seccessfull", data);
        }catch (error:any){
            console.error("Something wrong with saving user ：", error);
        }
    }

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