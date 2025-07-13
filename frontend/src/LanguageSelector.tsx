import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Select, MenuItem, SelectChangeEvent, Button } from '@mui/material';

//defined what can this component accept
interface LanguageSelectorProps {
    setLanguage: (lang: string) => void;
    giveLanguage:  string;
}

const LanguageSelector : React.FC<LanguageSelectorProps> = ({setLanguage,giveLanguage}:any) => {

    const { i18n } = useTranslation();
    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const newLang = currentLang === 'en' ? 'de' : 'en';
        i18n.changeLanguage(newLang);
        setLanguage(newLang);
    };

    //from backend give storaged User used Language,
    useEffect(() => {
        i18n.changeLanguage(giveLanguage);//set language
        setLanguage(giveLanguage) //set aktuelle language Singal send to MongoDB
    }, [giveLanguage]);

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
