
import { Routes,Route,BrowserRouter,Link} from 'react-router-dom';
import React, {useState, useEffect, useContext} from "react";
import {Button} from "@mui/material";

const HomePage = () => {
    return(<div>
        <Link to={"/dashboard"}>
        <Button>GetStart</Button>
        </Link>
    </div>
    )
}



export default HomePage;