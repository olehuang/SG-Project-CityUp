import React from "react";
import { Box, Typography } from "@mui/material";


const PhotoGrid = (props: any) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",   // 自动换行
                gap: 2,             // 块之间的间距，单位是 theme.spacing(2)
            }}
        >
            {[...Array(10)].map((_, index) => (
                <Box
                    key={index}
                    sx={{...styles.photoBox,}}
                >
                    <Typography>Photo {index + 1}</Typography>
                </Box>
            ))}
        </Box>
    )
 }
 const styles={
    photoBox:{
        flex: "0 0 30%",                  // width 1/3 - space（gap*2）
        aspectRatio: "3 / 4",               // （width:height = 3:4）
        backgroundColor: "#fff",
        borderRadius: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover()":{
            backgroundColor: "#e0f7fa",
            borderColor: "#128d9e",
        },
        "&:active": {
            transform: "scale(0.98)",
            backgroundColor: "#b2ebf2",
        },
    }
 }

export default PhotoGrid;