import React, { useTransition } from "react";
import PropTypes from "prop-types";
import { StyledFooterTop } from "../Footer.style";
import { Grid, InputBase, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import Subscribe from "./Subscribe";

const FooterTop = (props) => {
  const { t } = useTranslation();

  return (
    <StyledFooterTop>
      <CustomStackFullWidth
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Stack>
          <Typography variant="h6" color="whiteContainer.main">
            {t("Lets Connect !")}
          </Typography>
          <Typography color="whiteContainer.main">
            {t("Stay upto date with restaurants and foods around you")}
          </Typography>
        </Stack>
        <Stack>
          <Subscribe />
        </Stack>
      </CustomStackFullWidth>
    </StyledFooterTop>
  );
};

FooterTop.propTypes = {};

export default FooterTop;
