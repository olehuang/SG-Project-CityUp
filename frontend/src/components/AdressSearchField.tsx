import React, { useState ,useEffect} from "react";
import {Autocomplete, Button, TextField,Box} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {useTranslation} from "react-i18next";
import { createFilterOptions } from "@mui/material/Autocomplete";

interface Props {
    onSearch: (query: string) => void;//return search result
    onSelect?: (selected: string) => void;//clearn search field
    isNomatch: boolean; //if no result find
    setIsNomatch: (isNomatch: boolean) => void; //function to set match or not
    setSearchResult: (searchResult: string[]) => void; // function to set result
    allAddresses: string[];

}

/*
* Search field box include: add address button, clearn history button
* user input address, show to user which result hat
* */
const AdressSearchField: React.FC<Props> = ({onSearch,onSelect,isNomatch,setIsNomatch,setSearchResult,allAddresses}) => {
    const [inputValue, setInputValue] = useState(""); //user input
    const [selectedAddress, setSelectedAddress] = useState<string|null>("");// whiche address select
    const [history, setHistory] = useState<string[]>([]); //storage which address has been research

    const [hasSearched, setHasSearched] = useState(false);

    const { t } = useTranslation();

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

    //if user something input will add to history
    const updateHistory = (newEntry: string) => {
        const trimmed = newEntry.trim();
        if (!trimmed) return;

        const updated = [trimmed, ...history.filter(h => h !== trimmed)].slice(0, 10); // keep max 10
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    //storage and  search  user input
    const handleSearch = () => {
        const trimmedInput = inputValue.trim();
        console.log("Search input:", JSON.stringify(trimmedInput));
        if (trimmedInput !== "") {
            onSearch(trimmedInput);
            updateHistory(trimmedInput);
            //setInputValue("");
            setSelectedAddress(null);
            setHasSearched(true);
        }
    };

    const handleChange = (event: any, newValue: string | null) => {
        if (newValue) {
            setInputValue("");
            setSelectedAddress("");
            onSearch?.(newValue);
            setHasSearched(true);
        }
    };

    //clear user History:which uer has inputed
    const clearHistory = () => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([]);
    };

    const filterOptions = createFilterOptions({
        matchFrom:"any",
        stringify:(option:string)=>option,
    })
    const mergedOptions = Array.from(new Set([...history,...allAddresses]));
    return (
        <>
        <Autocomplete
            style={{margin:"1% 1% 0 1%"}}
            freeSolo
            options={mergedOptions}
            filterOptions={filterOptions}
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
                    label={t("photoGallery.inputBoxLabel")}
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
                                <SearchIcon  />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    type="button"
                                    size="large"
                                    onClick={handleSearch}
                                >
                                    {t("photoGallery.searchButton")}
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
                }}> {t("photoGallery.allAddress")} </Button>}
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
                        {t("photoGallery.clearHistory")}
                    </Button>
                )}
            </Box>
        </>
    );
}

export default AdressSearchField;