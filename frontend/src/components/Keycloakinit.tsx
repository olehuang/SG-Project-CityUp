import KeycloakClient from "./keycloak";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {Outlet} from "react-router-dom";
import {useAuthHook} from "./AuthProvider";
import {useEffect, useState} from "react";
import {routes} from "@keycloak/keycloak-account-ui/lib/routes";



const KeycloakInit = () => {

    const {auth,setAuth,user_id,setUserID,authLoading,setAuthLoading,setToken}=useAuthHook();
    const [userInfo,setUserInfo]=useState<any>({});

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
                        setUserInfo(userInfo);
                        saveUser(userInfo);
                        setUserID(userInfo.userId)//global
                        setAuthLoading(false);
                        setToken(token);
                        if (userInfo.roles.includes("admin")) {
                            uploadRole("admin");
                        }else{
                            uploadRole();
                        }
                        console.log(userInfo);
                    }
                });
        }catch (error:any){
            console.log(error);           // print to console
            // addAlert("Failed to obtain Keycloak token: " + error.message, "error");
        }
    };

    const uploadRole =async (role="user")=>{
         const url=`http://127.0.0.1:8000/user/update_user`;
         try{
             const response = await fetch(url, {
                 method: "POST",
                 headers: {
                     "Content-Type": "application/json"
                 },
                 body: JSON.stringify(role)
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

    const saveUser=async (userInfo:any)=>{
        const url=`http://127.0.0.1:8000/user/save_user`;
        const payload={
            user_id:userInfo.userId,
            username:userInfo.username,
            email:userInfo.email,
            roles:userInfo?.roles[0],
        }
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