import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import pageBackgroundStyles from "./pageBackgroundStyles";
import React from "react";

const ProductIntroduction=()=>{
    return(
        <Box sx={pageBackgroundStyles.container}>
            <Box sx={pageBackgroundStyles.wrapper}>
                <Typography variant="h3" component="h2" sx={{
                    ...pageBackgroundStyles.title,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                    mb: 3,
                }}>
                    CityUp
                </Typography>

                <Typography variant="body1" paragraph sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                    CityUP is a student project on innovative urban digitization at Technical University of Darmstadt.
                    It aims to continuously optimize Darmstadt's 3D city digital model through community participation.
                    Your photos will be intelligently matched to corresponding buildings, enhancing the texture details and realism of the current 3D city model.
                    As a reward, you can earn points. We invite citizens to participate in optimizing the city model and become contributors to urban digitization!
                </Typography>

                <Typography variant="h2" component="h2" id="process-section" sx={{
                    mb: 0,
                    fontSize: '1.5rem',
                    fontWeight: 400,
                    color: 'primary.main'
                }}>
                    Participation Process
                </Typography>

                <List sx={{ mb: 0 }}>
                    {[
                        {
                            text: 'Upload building photos',
                            secondary: 'Photographing the architecture of Darmstadt\'s city centre',
                            path: null,
                            action: <Button variant="text" size="small" component={Link} to="/dashboard/tutorial" sx={{ ml: 1 }}>View Tutorial</Button>
                        },
                        { text: 'Smart Matching Process', secondary: 'The system automatically recognises and matches to the corresponding building model.' },
                        { text: 'Audit', secondary: 'After approval, your photo may become part of the official 3D model.' }
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
                        Participate immediately
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        component={Link}
                        to="/dashboard/tutorial"
                        sx={{ minWidth: 160 }}
                    >
                        View Example
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
export default ProductIntroduction;