import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Container,
  Grid,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import bgImg from "../../../../public/landingpage/heroimage.svg";
// import { CustomContainer } from "../../footer/Footer.style";
import {
  CustomHeroBackground,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import { ComponentTwoContainer } from "../ComponentTwo";
import HeroTitleSection from "./HeroTitleSection";
import HeroMapSection from "./HeroMapSection";
import HeroLocationForm from "./HeroLocationForm";
import CustomContainer from "../../container";
import bgImage from "../../../../public/landingpage/com2Bg-svg.png";

export const ColorContainer = styled(Box)(({ theme }) => ({
  background: `url(${bgImage.src}) no-repeat center center / cover, linear-gradient(180deg, rgba(3, 157, 85, 0.05) 0%, rgb(92 169 108 / 31%) 100%)`,
}));

const HeroSection = ({ configData, landingPageData, handleOrderNow }) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <ColorContainer
        paddingTop={{ xs: "6.5rem", md: "9rem" }}
        paddingBottom={{ xs: "3.563rem", md: "5rem" }}
      >
        <CustomContainer>
          <Grid
            container
            alignItems="flex-start"
            justifyContent="center"
            spacing={5}
          >
            <Grid item xs={12} sm={12} md={12} lg={5} textAlign="center">
              <HeroTitleSection
                configData={configData}
                landingPageData={landingPageData}
                handleOrderNow={handleOrderNow}
              />
            </Grid>
            <HeroMapSection configData={configData} />
          </Grid>
        </CustomContainer>
      </ColorContainer>
      {isXSmall && <HeroLocationForm />}
    </>
  );
};

export default HeroSection;
