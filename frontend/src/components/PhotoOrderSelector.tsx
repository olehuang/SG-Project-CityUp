import React from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface Porps{
    setSelectOrder: (selectOrder:any)=>void;
    selectOrder:any;
}

const PhotoOrderSelector:React.FC<Porps> =({setSelectOrder,selectOrder})=>{


    const handleChange=(event:SelectChangeEvent)=>{
        setSelectOrder(event.target.value as string);
    }
    return(
        <FormControl sx={{  minWidth: 120, width: { xs: "100%", sm: 180 }, }}>
            <InputLabel id="demo-simple-select-helper-label">Order</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selectOrder}
                label="Order"
                onChange={handleChange}
                sx={{padding:"0 0.5% 0 1%", fontSize: { xs: 12, sm: 14 }, }}
            >
                <MenuItem value={"Time Asc"}>Sort by Upload Time Ascending</MenuItem>
                <MenuItem value={"Time Desc"}>Sort by Upload Time Descending</MenuItem>
                <MenuItem value={"Name Asc"}>Sort by Name A-Z</MenuItem>
                <MenuItem value={"Name Desc"}>Sort by Name Z-A</MenuItem>
                <MenuItem value={"Like Asc"}>Sort by most favorite</MenuItem>
                <MenuItem value={"Like Desc"}>Sort by least favorite</MenuItem>
            </Select>
        </FormControl>
    )
}

export default PhotoOrderSelector;