import React from "react";
import PropTypes from "prop-types";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import AppLinks from "../footer/footer-middle/AppLinks";
import { Typography } from "@mui/material";

const DownloadApps = ({ configData }) => {
  const { t } = useTranslation();
  return (
    <CustomStackFullWidth alignItems="center" backgroundImage="none !important" justifyContent="center">
      <Typography textAlign="center" variant="h5">
        {t("Download app to enjoy more!")}
      </Typography>

      <Typography
        textAlign="center"
        color="customColor.textGray"
        sx={{ mt: 1 }}
      >
        {t("Download our app from google play & app store.")}
      </Typography>
      <AppLinks configData={configData} />
    </CustomStackFullWidth>
  );
};

DownloadApps.propTypes = {};

export default DownloadApps;
