
import React, {JSX} from "react";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import { useAuthHook } from "./AuthProvider";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

const ProtectedRouter=()=>{
        const { auth ,authLoading} = useAuthHook();
        const navigate=useNavigate();
        const handleCombackToHome = () => {
            return navigate("/")
        }
        if (authLoading) {
        return <div>
            <Stack spacing={2} direction="row" alignItems="center">
                <CircularProgress size="3rem" />
                Loading...
               <Button onClick={handleCombackToHome} style={{color:"FFFFFF"}}>Go Back t0 Home</Button>
            </Stack>
        </div>; //
        }

        if (!auth) {
            return <Navigate to="/" replace />;
        }
        return <Outlet/>;
}

export default ProtectedRouter;