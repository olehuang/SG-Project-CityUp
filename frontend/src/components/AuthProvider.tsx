
import React, {useEffect, createContext, useContext, useState,useRef, ReactNode} from "react";


// Defining Context Data Structures
/**
 * define which value : type, need to transport
 * auth: user Loading or not
 * setAuth: a setting function to set auth
 * user_id: user_id from keycloak
 * setUserID: a setting function to set user_id
 * authLoading: the status between user loading or not, because keycloak need time to check
 * setAuthLoading: a setting function to set authLoading
 * token: storage keycloak token include user information
 * setToken: a setting function to set token
 * * */
interface AuthContextProps {
    auth: boolean;                            // Is the current user logged in
    setAuth: (value: boolean) => void;        // Methods for updating authentication status
    user_id: string;                          //storage keycloak user id
    setUserID: (value: string) => void;       // setting keycloak user id to user_id
    authLoading: boolean;                     // user in loading  status
    setAuthLoading: (value: boolean) => void; // setting loading status
    token: string;                            //token
    setToken: (value: any) => void;
}

// setting default value
/**
 * @brief: protected type save, if value by interface AuthContextProps has no exist,
 *         will be use here
 *
 * auth: user Loading or not
 * setAuth: a setting function to set auth
 * user_id: user_id from keycloak
 * setUserID: a setting function to set user_id
 * authLoading: the status between user loading or not, because keycloak need time to check
 * setAuthLoading: a setting function to set authLoading
 * token: storage keycloak token include user information
 * setToken: a setting function to set token
 * */
const defaultAuthContext: AuthContextProps = {
    auth: false,             // default is logout
    setAuth: () => {}, // default is empty
    user_id:"",              //default is empty
    setUserID:()=>{},  // default is empty
    authLoading: true,
    setAuthLoading: (value: boolean) => {},
    setToken:()=>{},
    token:""
};
/**
 * First Main Part of <AuthProvider/>
 * createContest<>() will return an Context object
 * it include Provider component and Consumer component
 * @AuthContextProps: self defined Type,which value will transport
 * @return:an Context object here name:AuthContext
 *
*/
const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

//  Create provider Used to package components that need to access the authentication status
/**
 * @brief: Second Main Part of <AuthProvider/>, defined scopt of value,
 *         any value by <AuthProvider/> only work in {children} component
 *         !! anyone value of that change, all value will refresh,even it no change
 *         this Part of Component can management value status with useState/useReducer etc...
 *         !!! ContextProvider can be more than one, because useContext(AuthContext(here)),
 *             will find most recent ancestor read/abo value,
 *             and each Provider can different value transport
 * @value: which value need to transport to children Component, can be an Array, a function, any type
 * @children:need rendered(don't need care),than value can be reference in children
 * **/
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState(false); // manager global login status
    const [user_id,setUserID] = useState<string>("");//manage global user_id
    const [authLoading, setAuthLoading] = useState(true);
    const [token, setToken] = useState<string>("");

    return (
        <AuthContext.Provider value={{ auth, setAuth,
            user_id,setUserID,authLoading,setAuthLoading,token,setToken}}>
            {children}
        </AuthContext.Provider>
    )
};

//  Hook,Convenient access to authentication status in other components

/**
 * @brief: Third Main Part of <AuthProvider/>,
 *         a Hook use to reference/read value,which value by <AuthProvider/> transport,
 *         !! only in top by function component use,can not in Loop condition Statements,nesting function use
 * @reference: for example, const {auth, setAuth,...} =useAuthHook();
 *
 * */
export const useAuthHook = () => {
    return  useContext(AuthContext);
};

export default AuthProvider ;
