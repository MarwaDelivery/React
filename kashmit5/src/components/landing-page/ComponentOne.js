import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomImageContainer from "../CustomImageContainer";
import comp1 from "../../../public/static/landing-page/comp1.svg";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import { useGeolocated } from "react-geolocated";
import MapModal from "../Map/MapModal";
import { useRouter } from "next/router";
import { t } from "i18next";
import CustomContainer from "../container";
export const CustomButton = styled(Button)(({ theme, boxshadow }) => ({
  backgroundColor: theme.palette.primary.main,
  width: "167.81px",
  height: "51px",
  borderRadius: "30px",
  boxShadow: "0px 4px 60px rgba(3, 157, 85, 0.2)",
}));
const ComponentOne = ({ landingPageData, configData, handleOrderNow }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <CustomContainer paddingTop={{ xs: "2rem", md: "0rem" }}>
        <Grid maxWidth="80% !important"
        marginLeft="10% !important"
          container
          alignItems="center"
       
          justifyContent="space-between"
          spacing={{ xs: 1, md: 4 }}
          flexDirection={{ xs: "column-reverse", md: "row" }}
        >
          <Grid item xs={12} sm={12} md={5} >
            <CustomStackFullWidth
              spacing={5}
              paddingBottom={{ xs: "2rem", sm: "2rem", md: "0px" }}
            >
              <CustomStackFullWidth>
                <Typography variant="h4" color="primary.main">
                  {configData?.business_name}
                </Typography>
                <Typography variant="h4">
                  {
                    landingPageData?.delivery_service_section
                      ?.delivery_service_section_title
                  }
                </Typography>
              </CustomStackFullWidth>
              <Typography
                fontSize={{ xs: "14px", md: "18px" }}
                fontWeight="400"
              >
                {
                  landingPageData?.delivery_service_section
                    ?.delivery_service_section_description
                }
              </Typography>
              <CustomButton variant="contained">
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.4}
                  onClick={() => handleOrderNow?.()}
                >
                  <Typography variant="h6" color="whiteContainer.main">
                    {t("Explore Now")}
                  </Typography>
                  <ArrowRightAltIcon
                    sx={{ color: (theme) => theme.palette.whiteContainer.main }}
                  />
                </Stack>
              </CustomButton>
            </CustomStackFullWidth>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Stack
              paddingTop=".2rem"
              width="100%"
              // justifyContent="space-between"
              alignItems={{ xs: "center", md: "end" }}
              paddingBottom=".2rem"
            >
              {configData ? (
                <CustomImageContainer
                  src={`${configData?.base_urls?.react_landing_page_images}/${landingPageData?.delivery_service_section?.delivery_service_section_image}`}
                  alt="truck"
                  height={isSmall ? "250px" : "500px"}
                  width={isSmall ? "250px" : "500px"}
                  objectfit="contain"
                />
              ) : (
                <Skeleton
                  height={isSmall ? "280px" : "480px"}
                  width={isSmall ? "280px" : "480px"}
                  variant="rectangular"
                />
              )}
            </Stack>
          </Grid>
        </Grid>
      </CustomContainer>
    </>
  );
};

ComponentOne.propTypes = {};

export default ComponentOne;

// height="550px"
// width="550px"
