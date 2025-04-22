import React from "react";
import PropTypes from "prop-types";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import SocialLinks from "./SocialLinks";
import RouteLinks from "./RouteLinks";
import SomeInfo from "./SomeInfo";
import { useTranslation } from "react-i18next";
import AppLinks from "./AppLinks";
import LogoSide from "../../logo/LogoSide";
import ractangle from "../../../../public/static/footer/Rectangle.svg";
import phone from "../../../../public/static/footer/phone.svg";
import magnifying from "../../../../public/static/footer/magnifying.svg";
import CustomImageContainer from "../../CustomImageContainer";

const FooterMiddle = (props) => {
  const { configData } = props;
  const { t } = useTranslation();
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  let token;
  const businessLogo = `${configData?.base_urls?.business_logo_url}/${configData?.logo}`;
  return (
    <CustomStackFullWidth>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 1, md: 4 }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={3.5}
          align={isSmall ? "center" : "undefined"}
        >
          <CustomStackFullWidth
            spacing={2}
            alignItems={{ xs: "center", sm: "flex-start" }}
            justifyContent="flex-start"
          >
            <CustomImageContainer
                src={businessLogo}
                alt={`${configData?.business_name}`}
                width="auto"
                height="50px"
                objectfit='contain'
            />

            <>
              <SocialLinks configData={configData} />
              <AppLinks configData={configData} changeSingle />
            </>
          </CustomStackFullWidth>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={2.5}
          align={isSmall ? "center" : "undefined"}
        >
          <RouteLinks token={token} configData={configData} />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SomeInfo
            image={ractangle}
            alt="rantangle"
            title="Send us mails"
            info={configData?.email}
            t={t}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SomeInfo
            image={phone}
            alt="Phone"
            title="Contact us"
            info={configData?.phone}
            t={t}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <SomeInfo
            image={magnifying}
            alt="magnifying"
            title="Find us here"
            info={configData?.address}
            t={t}
          />
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

FooterMiddle.propTypes = {};

export default FooterMiddle;
