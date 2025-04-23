import React from "react";
import PropTypes from "prop-types";
import { Button, Stack, Typography, styled, useTheme } from "@mui/material";
import CustomImageContainer from "../../CustomImageContainer";
import appleicon from "../../../../public/static/footer/apple.svg";
import playstoreicon from "../../../../public/static/footer/playstore.svg";
import { useTranslation } from "react-i18next";

export const CustomButton = styled(Button)(({ theme }) => ({
  height: "48px",
  minWidth: "145px",
  borderRadius: "6px",
  backgroundColor: theme.palette.footer.appDownloadButtonBg,
  textTransform: "none",
  padding: "0 17px", // Ensuring proper padding
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // Ensures content is properly spaced
  "&:hover": {
    backgroundColor: theme.palette.footer.appDownloadButtonBgHover,
  },
  [theme.breakpoints.down("md")]: {
    width: "100%",
    maxWidth: "250px",
    height: "48px", // Keeps the button height consistent
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: "250px", // Limit max-width for large screens to prevent overlap
  },
}));

const AppLinks = ({ configData }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const goToApp = (href) => {
    window.open(href);
  };

  const googlePlay = () => (
    <CustomButton
      onClick={() => goToApp(configData?.landing_page_links?.app_url_android)}
      variant="contained"
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <CustomImageContainer
          src={playstoreicon.src}
          alt="GooglePlay"
          objectfit="contain"
          height="24px"
          width="24px"
        />
        <Stack alignItems="flex-start" justifyContent="center">
          <Typography sx={{ fontSize: "11px", color: "customColor.textGray" }}>
            {t("GET IT ON")}
          </Typography>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }} color={theme.palette.whiteContainer.main}>
            Google Play
          </Typography>
        </Stack>
      </Stack>
    </CustomButton>
  );

  const appleStore = () => (
    <CustomButton
      onClick={() => goToApp(configData?.landing_page_links?.app_url_ios)}
      variant="contained"
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <CustomImageContainer
          src={appleicon.src}
          alt="AppStore"
          objectfit="contain"
          height="24px"
          width="24px"
        />
        <Stack alignItems="flex-start" justifyContent="center">
          <Typography sx={{ fontSize: "11px", color: "customColor.textGray" }}>
            {t("Download ON")}
          </Typography>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }} color={theme.palette.whiteContainer.main}>
            {t("App Store")}
          </Typography>
        </Stack>
      </Stack>
    </CustomButton>
  );

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems="center"
      sx={{ mt: 2, mb: 4 }} // Added margin-bottom to ensure spacing from footer content
      justifyContent="center"
    >
      {Number.parseInt(configData?.landing_page_links?.app_url_android_status) === 1 && googlePlay()}
      {Number.parseInt(configData?.landing_page_links?.app_url_ios_status) === 1 && appleStore()}
    </Stack>
  );
};

AppLinks.propTypes = {
  configData: PropTypes.object.isRequired,
};

export default AppLinks;
