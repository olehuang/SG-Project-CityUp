import pageBackgroundStyles from "../pages/pageBackgroundStyles";
import {Box, Typography} from "@mui/material";
import React from "react";


const PhotoReview=()=>{
    return (
        <Box sx={pageBackgroundStyles.container}>
            <Box sx={pageBackgroundStyles.wrapper}>
                <Typography variant="h1" component="h1" sx={pageBackgroundStyles.title}>
                    Comming soon...
                </Typography>
            </Box>
        </Box>
    )
}

export default PhotoReview