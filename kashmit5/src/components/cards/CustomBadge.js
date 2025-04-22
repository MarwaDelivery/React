import React from "react";
import PropTypes from "prop-types";
import { Badge, styled } from "@mui/material";
const CustomBadgeWrapepr = styled(Badge)(({ theme }) => ({
  color: theme.palette.whiteContainer.main,
  backgroundColor: theme.palette.error.light,
  position: "absolute",
  top: "0",
  left: "0",
  zIndex: "1",
  fontSize: "15px",
  fontWeight: "500",
  lineHeight: "24px",
  padding: "4px 13px",
  borderRadius: "10px 0 15px 0",
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
  },
}));

const CustomBadge = (props) => {
  const { text } = props;
  return <CustomBadgeWrapepr>{text}</CustomBadgeWrapepr>;
};

CustomBadge.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CustomBadge;
