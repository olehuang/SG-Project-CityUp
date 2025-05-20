import Keycloak from 'keycloak-js';

import { jwtDecode } from "jwt-decode";

const creatKeycloak: any = new (Keycloak as any)({//keycloak Client
    url: "http://localhost:8080/", // keycloak goal URL
    realm:"master",                // which realm used
    clientId: "cityup",// which clientID
});

const tokenParsed = () => creatKeycloak.tokenParsed;

const hasRole = async (role: string) => {
    const roles = creatKeycloak.tokenParsed.resource_access?.['cityup']?.roles
    return  roles.includes(role);
};

//Decode keycloak token
const decodeAndVerifyToken = async (token: string) => {
    try {
        // decode Payload
        const decoded: any = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
//extract User Infomation von Keycloak token
const extractUserInfo = async (token: string) => {
    const payload = await decodeAndVerifyToken(token);
    const getUserRoles =  (): string[] => {
        const roles = payload.resource_access?.['cityup']?.roles ||
            payload.realm_access?.roles ||
            [];
        return roles;
    };

    if (!payload) {
        console.error('Failed to decode or verify token');
        return null;
    }

    // User Info
    const userInfo = {
        userId: payload.sub || null,   // user ID
        userName: payload.preferred_username || null,// user prefered username
        family_name: payload.family_name || null,   // user family_name
        given_name:payload.given_name || null,//user given_name
        email: payload.email || null, // User Email
        roles:getUserRoles() || [],   // user Role
    };

    return userInfo;
};


const KeycloakClient={
    creatKeycloak,
    tokenParsed,
    hasRole,
    decodeAndVerifyToken,
    extractUserInfo,
}


export default KeycloakClient;

