import React, { useState } from "react";
import {Autocomplete, Button, TextField} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const addressList = [
    "Karolinenpl. 5, 64289 Darmstadt ",
    "Luisenplatz, Luisenpl. 5, 64283 Darmstadt",
    "Marktpl. 15, 64283 Darmstadt"
];

interface Props {
    onSearch: (query: string) => void;//return search result
    onSelect?: (selected: string) => void;//clearn search field
}

const AdressSearchField: React.FC<Props> = ({onSearch,onSelect}) => {
    const [inputValue, setInputValue] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<string|null>("");

    const handleSearch = () => {
        const trimmedInput = inputValue.trim();
        if (trimmedInput !== "") {
            onSearch(trimmedInput);
            setInputValue(""); // 搜索完再清空
            setSelectedAddress(null);
        }
    };

    const handleChange = (event: any, newValue: string | null) => {
        if (newValue) {
            setInputValue("");
            setSelectedAddress("");
            onSelect?.(newValue); // tell the parent Component choose already
        }
    };
    return (
        <Autocomplete
            style={{ width: "100%" }}
            freeSolo
            options={addressList}
            value={selectedAddress}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            // onChange={(event, newValue:any) => {
            //     setInputValue(newValue || "");
            //     setSelectedAddress(newValue);
            //     console.log("choose the address：", newValue);
            // }}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Input Adress"
                    variant="outlined"
                    type="search"
                    fullWidth
                    size="medium"
                    onKeyDown={(even)=>{
                        if (even.key==="Enter"){
                            even.preventDefault();
                            handleSearch()
                        }
                    }
                    }
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    type="button"
                                    size="large"
                                    onClick={handleSearch}>
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