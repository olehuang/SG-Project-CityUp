import React, { useState } from "react";
import {IconButton, Box, Typography} from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Photo {
    id: string;
    src: string;
    title: string;
    uploader: string;
    uploadTime: string;
}

const PhotoCarousel=({ photos }: { photos: Photo[] }) => {
    const sliderRef = React.useRef<Slider>(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false, //
    };

    return (<Box sx={{ position: 'relative', width: '100%', maxWidth: 600, margin: 'auto' }}>
        <Slider ref={sliderRef} {...settings}>
            {photos.map(photo => (
                <Box key={photo.id}>
                    <img
                        src={photo.src}
                        alt={photo.title}
                        style={{width: '100%', borderRadius: 8}}
                    />
                    <Typography variant="body2" sx={{mt: 1}}>
                        Uploaded by {photo.uploader} on {photo.uploadTime}
                    </Typography>
                </Box>
        ))}
    </Slider>

        {/* 左箭头 */}
        <IconButton
            onClick={() => sliderRef.current?.slickPrev()}
            sx={styles.leftArrow}
        >
            <ArrowBackIosNewIcon />
        </IconButton>

        {/* 右箭头 */}
        <IconButton
            onClick={() => sliderRef.current?.slickNext()}
            sx={styles.rightArrow}
        >
            <ArrowForwardIosIcon />
        </IconButton>
    </Box>)


}
const styles = {
    leftArrow: {
        position: 'absolute',
        top: '50%',
        left: 10,
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: 'white',
        '&:hover': {backgroundColor: 'rgba(0,0,0,0.6)'},
    },
    rightArrow:{
        position: 'absolute',
        top: '50%',
        right: 10,
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: 'white',
        '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
    }
}
export default  PhotoCarousel;