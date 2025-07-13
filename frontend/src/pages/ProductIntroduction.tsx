import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import pageBackgroundStyles from "./pageBackgroundStyles";
import React from "react";
import { useTranslation } from 'react-i18next';
/**
 * 产品介绍组件（ProductIntroduction）
 * 用于展示CityUp项目简介、用户参与流程及操作入口，适配多端显示。
 *
 * Component for showing CityUp project introduction, participation steps, and main entry buttons. Responsive layout.
 */
const ProductIntroduction=()=>{
    const { t } = useTranslation();
    return(
        <Box sx={pageBackgroundStyles.container}>
            <Box sx={pageBackgroundStyles.wrapper}>
                <Typography variant="h3" component="h2" sx={{
                    ...pageBackgroundStyles.title,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                    mb: 3,
                }}>
                    {t('productIntro.title')}
                </Typography>

                <Typography variant="body1" paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                    {t('productIntro.description')}
                </Typography>

                <Typography variant="h2" component="h2" id="process-section" sx={{
                    mb: 0,
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: 'primary.main'
                }}>
                    {t('productIntro.participationTitle')}
                </Typography>

                <List sx={{ mb: 0 }}>
                    {[
                        {
                            text: t('productIntro.step1.title'),
                            secondary: t('productIntro.step1.desc'),
                            path: null,
                            action: <Button variant="text" size="small" component={Link} to="/dashboard/tutorial" sx={{ ml: 1 }}>{t('productIntro.viewTutorial')}</Button>
                        },
                        { text: t('productIntro.step2.title'), secondary: t('productIntro.step2.desc') },
                        { text: t('productIntro.step3.title'), secondary: t('productIntro.step3.desc') }
                    ].map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                component={item.path ? Link : 'div'}
                                to={item.path || undefined}
                                sx={{ py: 1.5 }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Typography color="primary">{index + 1}.</Typography>
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    secondary={
                                        <>
                                            {item.secondary}
                                            {item.action || null}
                                        </>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap'
                }}>
                    <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        to="/dashboard/upload"
                        sx={{ px: 4, minWidth: 160 }}
                    >
                        {t('productIntro.participateNow')}
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        component={Link}
                        to="/dashboard/tutorial"
                        sx={{ minWidth: 160 }}
                    >
                        {t('productIntro.viewExample')}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default ProductIntroduction;