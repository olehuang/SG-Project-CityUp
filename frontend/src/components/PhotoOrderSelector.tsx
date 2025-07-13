import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useMediaQuery, useTheme} from "@mui/material";


interface porps{
    setSelectOrder: (selectOrder:any)=>void;
    selectOrder:any;
}

const PhotoOrderSelector:React.FC<porps> =({setSelectOrder,selectOrder})=>{


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md:  <900px

    const handleChange=(event:SelectChangeEvent)=>{
        setSelectOrder(event.target.value as string);
    }
    return(
        <FormControl
            sx={{
                minWidth: 120,
            }}
        >
            <InputLabel >Order</InputLabel>
            <Select
                value={selectOrder}
                label="Order"
                onChange={handleChange}
                sx={{
                    padding:"0 0.5% 0.5% 1%",
                    marginBottom:"2%",
                }}
            >
                <MenuItem value={"Time Asc"}>Upload Time Ascending</MenuItem>
                <MenuItem value={"Time Desc"}>Upload Time Descending</MenuItem>
                <MenuItem value={"Name Asc"}>Name A-Z</MenuItem>
                <MenuItem value={"Name Desc"}>Name Z-A</MenuItem>
                <MenuItem value={"Like Asc"}>Most favorite</MenuItem>
                <MenuItem value={"Like Desc"}>Least favorite</MenuItem>
            </Select>
        </FormControl>
    )
}

export default PhotoOrderSelector;