import React from "react";
import { Box, Button, styled, useMediaQuery, useTheme } from "@mui/material";
import bg1 from "../assets/bg1.svg";
import bg2 from "../assets/bg2.svg";
import { useTranslation } from "react-i18next";
import CustomContainer from "../../container";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import LargerScreen from "./LargerScreen";
import SmallerScreen from "./SmallerScreen";

const Wrapper = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(112.54deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 245, 202, 0.1) 33.19%, rgba(28, 255, 149, 0.1) 66.37%, rgba(255, 255, 255, 0.1) 99.56%)",
  width: "100%",
  position: "relative",
  backgroundImage: `url(${bg1.src}), url(${bg2.src})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top 10px left 10px,top 10px right 10px ",
}));
export const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: "10px",
  maxWidth: "400px",
  background: `linear-gradient(132.58deg, ${theme.palette.primary.customType1} 0%, #039D55 51.01%)`,
  color: theme.palette.whiteContainer.main,
}));

const AppDownloadSection = ({ configData, landingPageData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const primaryColor = theme.palette.primary.dark;
  const { t } = useTranslation();
  const goToApp = (s) => {
    window.open(s);
  };
  return (
    <Box>
      <Wrapper>
        <CustomContainer>
          <CustomStackFullWidth>
            {isSmall ? (
              <SmallerScreen
                configData={configData}
                landingPageData={landingPageData}
                goToApp={goToApp}
              />
            ) : (
              <LargerScreen
                configData={configData}
                landingPageData={landingPageData}
                goToApp={goToApp}
              />
            )}
          </CustomStackFullWidth>
        </CustomContainer>
      </Wrapper>
    </Box>
  );
};

AppDownloadSection.propTypes = {};

export default AppDownloadSection;
