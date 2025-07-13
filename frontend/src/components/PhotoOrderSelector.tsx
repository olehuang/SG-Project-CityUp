import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";


interface porps{
    setSelectOrder: (selectOrder:any)=>void;
    selectOrder:any;
}

const PhotoOrderSelector:React.FC<porps> =({setSelectOrder,selectOrder})=>{


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md:  <900px
    const { t } = useTranslation();//double language


    const handleChange=(event:SelectChangeEvent)=>{
        setSelectOrder(event.target.value as string);
    }
    return(
        <FormControl
            sx={{
                minWidth:120,
            }}
        >
            <InputLabel >{t("photoGallery.orderLabel")}</InputLabel>
            <Select
                value={selectOrder}
                label="Order"
                onChange={handleChange}
                sx={{
                    padding:"0 0.5% 0.5% 1%",
                    marginBottom:"2%",
                }}
            >
                <MenuItem value={"Time Asc"}>{t("photoGallery.updateTimeAcs")}</MenuItem>
                <MenuItem value={"Time Desc"}>{t("photoGallery.updateTimeDecs")}</MenuItem>
                <MenuItem value={"Name Asc"}>{t("photoGallery.nameAZ")}</MenuItem>
                <MenuItem value={"Name Desc"}>{t("photoGallery.nameZA")}</MenuItem>
                <MenuItem value={"Like Asc"}>{t("photoGallery.mostFavorite")}</MenuItem>
                <MenuItem value={"Like Desc"}>{t("photoGallery.leastFavorite")}</MenuItem>
            </Select>
        </FormControl>
    )
}

export default PhotoOrderSelector;