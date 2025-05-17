import {Outlet} from "react-router-dom";
import Sidebar from "./Sidebar";
import {Box} from "@mui/material";

const DashboardLayout = () => {
    return (
        <Box className="dashboardLayout">
            <Sidebar></Sidebar>
            <Outlet></Outlet>
        </Box>
       )
};
export default DashboardLayout;

