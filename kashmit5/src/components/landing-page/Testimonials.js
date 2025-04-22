/* eslint-disable @next/next/no-img-element */
import { styled, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";

import NextIcon from "../icons/NextIcon";
import PrevIcon from "../icons/PrevIcon";
import useGetTestimonial from "../../api-manage/hooks/react-query/testimonial/useGetTestimonial";
import { useSelector } from "react-redux";
import CustomContainer from "../container";

const PrevWrapper = styled(Box)(({ theme }) => ({
  zIndex: 1,
  [theme.breakpoints.down("lg")]: {
    left: -5,
  },
  [theme.breakpoints.down("sm")]: {
    left: -10,
  },
}));
const NextWrapper = styled(Box)(({ theme }) => ({
  zIndex: 1,
  [theme.breakpoints.down("lg")]: {
    right: -5,
  },
  [theme.breakpoints.down("sm")]: {
    right: -5,
  },
}));
const Next = ({ onClick, className }) => {
  return (
    <NextWrapper
      className={`client-nav client-next ${className}`}
      onClick={onClick}
    >
      <NextIcon />
    </NextWrapper>
  );
};
const Prev = ({ onClick, className }) => {
  return (
    <PrevWrapper
      className={`client-nav client-prev ${className}`}
      onClick={onClick}
    >
      <PrevIcon />
    </PrevWrapper>
  );
};
const Testimonials = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { configData } = useSelector((state) => state.configData);

  const primary = theme.palette.primary.main;
  const [onClient, setOnClient] = useState(false);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [indexState, setIndexState] = useState({
    oldSlide: 0,
    activeSlide: 0,
    activeSlide2: 0,
  });
  const { data, refetch } = useGetTestimonial();
  useEffect(() => {
    refetch();
  }, []);
  const setting = {
    dots: false,
    arrow: true,
    infinite: true,
    slidesToShow: 3,
    focusOnSelect: true,
    className: "center",
    centerMode: true,
    centerPadding: "164px",
    beforeChange: (current, next) =>
      setIndexState({ oldSlide: current, activeSlide: next }),
    afterChange: (current) => setIndexState({ activeSlide2: current }),
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          centerPadding: "64px",
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          centerPadding: "0",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          initialSlide: 2,
          centerPadding: "0",
        },
      },
    ],
    prevArrow: <Prev />,
    nextArrow: <Next />,
  };
  return (
    <>
      { data && data?.length> 0 &&
        <CustomContainer>
          <CustomStackFullWidth py={{ xs: "1.35rem", md: "3.35rem" }} spacing={4}>
            <Typography width="60%" marginLeft="20%"  textAlign="center" variant="h4">
              {t("We")} <span style={{ color: primary }}>{t("satisfied")}</span>{" "}
              {t("some Customer & Restaurant Owners")}
            </Typography>
          </CustomStackFullWidth>
          <CustomStackFullWidth
              pb={{ xs: "0px", md: "45px" }}
              sx={{
                margin: "0 auto",
                textAlign: "center",
              }}
          >
            <Box  width="60%" marginLeft="20%" sx={{ display: "block", position: "relative" }}>
              <Box sx={{ gap: "35px" }}>
                <Box className="slider-wrapper">
                  <Slider asNavFor={nav2} ref={(e) => setNav1(e)} {...setting}>
                    {data?.map((item, i) => (
                        <TestimonialSlideImage
                            img={item?.img}
                            key={i}
                            indexState={indexState}
                            currentIndex={i}
                        />
                    ))}
                  </Slider>
                </Box>
                <Slider asNavFor={nav1} ref={(e) => setNav2(e)}>
                  {data.map((item, i) => (
                      <TestimonialSlideText {...item} key={i} />
                  ))}
                </Slider>
              </Box>
            </Box>
          </CustomStackFullWidth>
        </CustomContainer>
      }

    </>
  );
};
export const TestimonialSlideImage = (props) => {
  const { img, indexState, currentIndex } = props;
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  return (
    <>
      <Stack
        p="4px"
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "140px",
          aspectRatio: "1",
          margin: "0 auto",
        }}
        className="slide-item"
      >
        <Typography
          sx={{
            position: "absolute",
            inset: "0",
            background: currentIndex === indexState?.activeSlide2 && primary,
            width: "100%",
            height: "100%",
            aspectRatio: "1",
            borderRadius: "50%",
          }}
        />

        <CustomImageContainer
          src={`${configData?.base_urls?.landing_page_image_url}/${img}`}
          alt=""
          width="100%"
          objectFit="cover"
          borderRadius="50%"
          aspectRatio="1"
        />
      </Stack>
    </>
  );
};

export const TestimonialSlideText = (props) => {
  const theme = useTheme();
  const { name, position, detail, activeState, index } = props;

  return (
    <Box
      className={`slide-item ${
        index > activeState
          ? "next-slide"
          : index == activeState
          ? "active"
          : "prev-slide"
      }`}
      sx={{ marginTop: "30px" }}
    >
      <Stack className="content" spacing={3}>
        {detail && (
          <Typography
            fontSize={{ xs: "14px", md: "18px" }}
            fontWeight="500"
            color={theme.palette.primary.main}
            lineHeight="2"
          >
            “{detail}”
          </Typography>
        )}
        <Stack spacing={1}>
          {name && (
            <Typography variant="h6" fontWeight="600">
              {name}
            </Typography>
          )}
          {position && (
            <Typography
              className="designation"
              color={theme.palette.neutral[600]}
            >
              {position}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
Testimonials.propTypes = {};

export default Testimonials;
