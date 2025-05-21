import React from "react";
import PropTypes from "prop-types";
import { Stack } from "@mui/system";
import { alpha, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

const ClosedNowOverlay = ({ borderRadius }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Stack
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        background: (theme) => alpha(theme.palette.primary.main, 0.5),
        color: (theme) => theme.palette.neutral[100],
        padding: "10px",
        height: "97%",
        bottom:"3%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: borderRadius || "1rem",
      }}
    >
      <Typography align="center" color={theme.palette.neutral[100]}>
        {t("Closed Now")}
      </Typography>
    </Stack>
  );
};

ClosedNowOverlay.propTypes = {};

export default ClosedNowOverlay;
