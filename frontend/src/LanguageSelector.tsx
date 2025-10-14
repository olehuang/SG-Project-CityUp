import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Select, MenuItem, SelectChangeEvent, Button } from '@mui/material';

//defined what can this component accept
interface LanguageSelectorProps {
    setLanguage: (lang: string) => void; // Function to change language，which passed from parent
    giveLanguage:  string; // Initial language from backend (user preference)
}

const LanguageSelector : React.FC<LanguageSelectorProps> = ({setLanguage,giveLanguage}:any) => {

    const { i18n } = useTranslation(); // Access i18n instance

    // Toggle between English and German
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'de' : 'en';
        setLanguage(newLang); // Call parent function to update language state + backend
    };

    //from backend give storaged User used Language,
    useEffect(() => {
        if (giveLanguage) {
            i18n.changeLanguage(giveLanguage);
        }
    }, []);

    return (
        <Box>
            <Button
                onClick={toggleLanguage}
                sx={{
                    color: 'white',
                    minWidth: '50px',
                    padding: '6px 12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    marginTop: '2px',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                }}
            >
                {i18n.language.toUpperCase()}
            </Button>
        </Box>
    );
};

export default LanguageSelector;
