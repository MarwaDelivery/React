import React from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";

const CustomContainer = (props) => {
  const { children } = props;
  return <Container maxWidth="lg">{children}</Container>;
};

export default CustomContainer;
