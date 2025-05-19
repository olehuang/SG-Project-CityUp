
import React, {useEffect, createContext, useContext, useState,useRef, ReactNode} from "react";


// Defining Context Data Structures
interface AuthContextProps {
    auth: boolean;                     // Is the current user logged in
    setAuth: (value: boolean) => void; // Methods for updating authentication status
    user_id: string;                    //storage keycloak user id
    setUserID: (value: string) => void; // setting keycloak user id to user_id
    authLoading: boolean;
    setAuthLoading: (value: boolean) => void;
}

// setting default value
const defaultAuthContext: AuthContextProps = {
    auth: false,             // default is logout
    setAuth: () => {}, // default is empty
    user_id:"",              //default is empty
    setUserID:()=>{},  // default is empty
    authLoading: true,
    setAuthLoading: (value: boolean) => {}
};
// AuthContext erstellt mit default value
const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

//  Create provider Used to package components that need to access the authentication status
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState(false); // manager global login status
    const [user_id,setUserID] = useState<string>("");//manage global user_id
    const [authLoading, setAuthLoading] = useState(true);

    return (
        <AuthContext.Provider value={{ auth, setAuth,user_id,setUserID,authLoading, setAuthLoading}}>
            {children}
        </AuthContext.Provider>
    )
};

//  Hook,Convenient access to authentication status in other components
export const useAuthHook = () => {
    return  useContext(AuthContext);
};

export default AuthProvider ;
