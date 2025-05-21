import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/system";
import { alpha, Typography, useTheme } from "@mui/material";
import ClosedNowOverlay from "./ClosedNowOverlay";
import TemporaryOfflineOverlay from "./TemporaryOfflineOverlay";

const ClosedNow = (props) => {
  const { active, open, borderRadius } = props;

  if (open === 0 && !active) {
    return <ClosedNowOverlay borderRadius={borderRadius} />;
  }
  else if (!active) {
    return <TemporaryOfflineOverlay borderRadius={borderRadius} />;
  } else if (open === 0) {
    return <ClosedNowOverlay borderRadius={borderRadius} />;
  }

  // if (active) {
  //   if (open === 0) {
  //     return <ClosedNowOverlay borderRadius={borderRadius} />;
  //   }
  // } else {
  //   return (
  //     <Stack
  //       sx={{
  //         position: "absolute",
  //         bottom: 0,
  //         top: 0,
  //         left: 0,
  //         width: "100%",
  //         background: (theme) => alpha(theme.palette.primary.overLay, 0.5),
  //         color: (theme) => theme.palette.neutral[100],
  //         padding: "10px",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         borderRadius: borderRadius ? borderRadius : "8px",
  //       }}
  //     >
  //       <Typography align="center" color={theme.palette.neutral[100]}>
  //         {t("Closed Now")}
  //       </Typography>
  //     </Stack>
  //   );
  // }
};

ClosedNow.propTypes = {};

export default ClosedNow;
