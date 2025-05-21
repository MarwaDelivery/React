import React from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/system";
import { useTranslation } from "react-i18next";

const TemporaryOfflineOverlay = ({ borderRadius }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Stack
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: (theme) => alpha(theme.palette.error.main, 0.6),
        color: (theme) => theme.palette.neutral[100],
        padding: "10px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: borderRadius || ".5rem",
        zIndex: 99,
      }}
    >
      <Typography
        align="center"
        color={theme.palette.neutral[100]}
        fontWeight="bold"
      >
        {t("Temporarily Offline")}
      </Typography>
    </Stack>
  );
};

export default TemporaryOfflineOverlay;
