import React, { useState } from "react";
import {Autocomplete, Button, TextField} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const addressList = [
    "Karolinenpl. 5, 64289 Darmstadt",
    "456 Park Ave",
    "789 Broadway",
    "Shanghai Road",
    "Beijing Street",
    "New York Avenue"
];

const AdressSearchField = () => {
    const [inputValue, setInputValue] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");

    return (
        <Autocomplete
            style={{ width: "100%" ,}}
            freeSolo
            options={addressList}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                event.stopPropagation();
                setInputValue(newInputValue);
            }}
            onChange={(event, newValue:any) => {
                event.stopPropagation();
                setSelectedAddress(newValue);
                console.log("choose the address：", newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Input Adress"
                    variant="outlined"
                    type="search"
                    fullWidth
                    size="medium"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    size="large">
                                    Search
                                </Button>
                            </InputAdornment>)
                    }}
                />
            )}
        />
    );
}

export default AdressSearchField;