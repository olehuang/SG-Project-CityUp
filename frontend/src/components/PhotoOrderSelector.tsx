import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface porps{
    setSelectOrder: (selectOrder:any)=>void;
    selectOrder:any;
}

const PhotoOrderSelector:React.FC<porps> =({setSelectOrder,selectOrder})=>{


    const handleChange=(event:SelectChangeEvent)=>{
        setSelectOrder(event.target.value as string);
    }
    return(
        <FormControl sx={{  minWidth: 120}}>
            <InputLabel id="demo-simple-select-helper-label">Order</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selectOrder}
                label="Order"
                onChange={handleChange}
                sx={{padding:"0 1% 0 2%"}}
            >
                <MenuItem value={"Time Asc"}>Sort by Upload Time Ascending</MenuItem>
                <MenuItem value={"Time Desc"}>Sort by Upload Time Descending</MenuItem>
                <MenuItem value={"Name Asc"}>Sort by Name A-Z</MenuItem>
                <MenuItem value={"Name Dsc"}>Sort by Name Z-A</MenuItem>
            </Select>
        </FormControl>
    )
}

export default PhotoOrderSelector;