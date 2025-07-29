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
        <FormControl
            fullWidth
            sx={{  minWidth: { xs: '100%', sm: 160 },
            maxWidth: { xs: '100%', sm: 200 }, }}>
            <InputLabel id="demo-simple-select-helper-label"sx={{ fontSize: { xs: 12, sm: 14 } }}>Order</InputLabel>
            <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selectOrder}
                label="Order"
                onChange={handleChange}
                sx={{fontSize: { xs: 12, sm: 14 },
                    padding: { xs: '4px 8px', sm: '6px 12px' }, }}
            >
                <MenuItem value="Time Asc" sx={{ fontSize: { xs: 8, sm: 12 } }}>Sort by Upload Time Ascending</MenuItem>
                <MenuItem value="Time Desc"sx={{ fontSize: { xs: 8, sm: 12 } }}>Sort by Upload Time Descending</MenuItem>
                <MenuItem value="Name Asc"sx={{ fontSize: { xs: 8, sm: 12 } }}>Sort by Name A-Z</MenuItem>
                <MenuItem value="Name Desc"sx={{ fontSize: { xs: 8, sm: 12 } }}>Sort by Name Z-A</MenuItem>
                <MenuItem value="Like Asc"sx={{ fontSize: { xs: 8, sm: 12 } }}>Sort by most favorite</MenuItem>
                <MenuItem value="Like Desc"sx={{ fontSize: { xs: 8, sm: 12 } }}>Sort by least favorite</MenuItem>
            </Select>
        </FormControl>
    )
}

export default PhotoOrderSelector;