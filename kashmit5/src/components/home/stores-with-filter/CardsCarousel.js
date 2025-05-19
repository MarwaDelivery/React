import React from "react";
import { Box } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import StoresInfoCard from "./cards-grid/StoresInfoCard";

const CardsCarousel = ({ data }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // show 4 cards at once
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200, // below 1200px width
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box
      sx={{
        "& .slick-track": {
          marginLeft: "0 !important",
          marginRight: "0 !important",
        },
        "& .slick-slide": {
          padding: "0 10px", // gap between slides
        },
      }}
    >
      <Slider {...settings}>
        {data.map((item, index) => (
          <Box key={index}>
            <StoresInfoCard data={item} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CardsCarousel;
