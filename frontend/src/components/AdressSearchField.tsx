import React, { useState ,useEffect} from "react";
import {Autocomplete, Button, TextField,Box} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";


interface Props {
    onSearch: (query: string) => void;//return search result
    onSelect?: (selected: string) => void;//clearn search field
    isNomatch: boolean;
    setIsNomatch: (isNomatch: boolean) => void;
    setSearchResult: (searchResult: string[]) => void;
    allAddresses: string[];


}

const AdressSearchField: React.FC<Props> = ({onSearch,onSelect,isNomatch,setIsNomatch,setSearchResult,allAddresses}) => {
    const [inputValue, setInputValue] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<string|null>("");
    const [history, setHistory] = useState<string[]>([]);

    const [hasSearched, setHasSearched] = useState(false);

    const STORAGE_KEY = "address_search_history";
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setHistory(parsed);
                }
            } catch (e) {
                console.warn("Failed to parse search history");
            }
        }
    }, []);

    const updateHistory = (newEntry: string) => {
        const trimmed = newEntry.trim();
        if (!trimmed) return;

        const updated = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, 10); // keep max 10
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleSearch = () => {
        const trimmedInput = inputValue.trim();
        if (trimmedInput !== "") {
            onSearch(trimmedInput);
            updateHistory(trimmedInput);
            setInputValue("");
            setSelectedAddress(null);
            setHasSearched(true);
        }
    };

    const handleChange = (event: any, newValue: string | null) => {
        if (newValue) {
            setInputValue("");
            setSelectedAddress("");
            onSelect?.(newValue);// tell the parent Component choose already
            onSearch?.(newValue);
        }
    };

    const clearHistory = () => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([]);
    };

    const mergedOptions = Array.from(new Set([...history]));
    return (
        <>
        <Autocomplete
            style={{margin:"1% 1% 0 1%"}}
            freeSolo
            options={mergedOptions}
            value={selectedAddress}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    sx={{}}
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
            <Box sx={{display: "flex",gap:1,alignItems:"center",justifyContent: "space-between",margin:"1% 0 0 1%",}}>
                {(isNomatch ||hasSearched) && <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        setSearchResult([...allAddresses])
                        setIsNomatch(false)
                        setHasSearched(false)
                }}> Back</Button>}
                {history.length > 0 && (
                    <Button
                        sx={{marginRight:"auto"}}
                        onClick={()=> {
                            clearHistory()
                            setIsNomatch(false)
                        }}
                        variant="outlined"
                        color="secondary"
                        size="small"
                    >
                        Clear History
                    </Button>
                )}
            </Box>
        </>
    );
}

export default AdressSearchField;