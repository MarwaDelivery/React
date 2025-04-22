import React from "react";
import PropTypes from "prop-types";
import { Button, Paper, Stack, styled, Typography } from "@mui/material";
import CustomImageContainer from "../../CustomImageContainer";
import appleicon from "../../../../public/static/footer/apple.svg";
import playstoreicon from "../../../../public/static/footer/playstore.svg";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import {useTheme} from "@emotion/react";
export const CustomButton = styled(Button)(({ theme }) => ({
  // width: "153px",
  height: "45px",
  borderRadius: "5px",
  cursor: "pointer",
  backgroundColor: theme.palette.footer.appDownloadButtonBg,
  "&:hover": {
    backgroundColor: theme.palette.footer.appDownloadButtonBgHover,
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: "150px",
    height: "40px",
  },
}));
const AppLinks = (props) => {
  const { configData, changeSingle } = props;
  const theme=useTheme()

  let language_direction;
  if (typeof window !== "undefined") {
    language_direction = window.localStorage.getItem("direction");
  }
  const goToApp = (href) => {
    window.open(href);
  };
  const { t } = useTranslation();
  const googlePlay = () => (
    <CustomButton
      onClick={() => goToApp(configData?.landing_page_links?.app_url_android)}
      variant="contained"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={0.5}
      >
        <CustomImageContainer
          src={playstoreicon.src}
          alt="GooglePlay"
          objectfit="contained"
          height="26px"
          width="26px"
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={0.5}
      >
        <CustomImageContainer
          src={appleicon.src}
          alt="GooglePlay"
          objectfit="contained"
          height="26px"
          width="26px"
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
      direction="row"
      spacing={2}
      sx={{ mt: 2 }}
      gap={language_direction === "rtl" && "10px"}
      justifyContent="center"
    >
      {Number.parseInt(
        configData?.landing_page_links?.app_url_android_status
      ) === 1 && googlePlay()}
      {Number.parseInt(configData?.landing_page_links?.app_url_ios_status) ===
        1 && appleStore()}
    </Stack>
  );
};

AppLinks.propTypes = {};

export default AppLinks;
