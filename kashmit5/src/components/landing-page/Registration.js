import React from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Grid, Typography, useTheme } from "@mui/material";
import Subtitle1 from "../typographies/Subtitle1";
import H1 from "../typographies/H1";
import { CustomButtonPrimary } from "../../styled-components/CustomButtons.style";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import CustomContainer from "../container";
import bg2 from "../../../public/landingpage/join.png";
import bg1 from "../../../public/landingpage/join2.png";
import bgImage from "../../../public/landingpage/com2Bg.svg";
import { t } from "i18next";
import { color } from "@mui/system";

const TopText = ({ configData }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const { t } = useTranslation();

  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      <Typography textAlign="center" variant="h1">
        {t("Reach more customers and grow your business goals with Marwa")}
        <span style={{ color: primary, margin: "0px 8px" }}>
         {/*  {configData?.business_name} */}
        </span>
      </Typography>
      <Subtitle1
        text={t(
          "Join our online marketplace revolution and boost your income."
        )}
      />
    </CustomStackFullWidth>
  );
};

const Card = ({ headingText, subtitleText, redirectLink }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const redirectHandler = () => {
    router.push(redirectLink, undefined, { shallow: true });
  };
  return (
    <CustomStackFullWidth
      alignItems="left"
      justifyContent="left"
      padding="30px"
      spacing={2}
      textAlign="left !important"
      sx={{
        
        backgroundImage: `url(${bg2.src})`,
      
        backgroundSize: {
          xs: "cover", // For extra small screens (mobiles)
          sm: "contain", // For small screens (tablets)
          md: "cover", // For medium screens (laptops)
          lg: "cover", // For large screens (desktops)
        },
        
        backgroundPosition: "center",
        height: "50vh",
        width: "100%",
        //py: "3.125rem",
        //px: "1rem",
        borderRadius: "30px",
        //height: "500px",
      //  marginLeft:"5% !important",
     //  marginRight:"5% !important",
       // marginRight:"200px !important",
        //marginTop:"10px !important",
        //marginBottom:"10px !important",
        //background: `url(${bg2.src}) no-repeat center center / cover, rgba(3, 157, 85, 0.05)  `,
        //backgroundColor: "rgba(3, 157, 85, 0.05)",
        // backgroundImage: `url(${bg1.src})`,
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
        // objectFit: "contain",
      //  margin: {
        //  xs: "8px",  // Small devices (phones)
          //sm: "16px", // Medium devices (tablets)
          //md: "24px", // Larger devices (laptops)
          //lg: "32px", // Large devices (desktops)
          //xl: "40px", // Extra large devices
      }}
    >
        <H1 fontSize="40px !important" textAlign="left !important" text={headingText} />
        <Typography textAlign="left" fontSize="20px !important">{subtitleText}</Typography>
      <CustomButtonPrimary  onClick={redirectHandler}>
        {t("Register")}
      </CustomButtonPrimary>
    </CustomStackFullWidth>
    
  );
};
const Card1 = ({ headingText, subtitleText, redirectLink }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const redirectHandler = () => {
    router.push(redirectLink, undefined, { shallow: true });
  };
  return (
    <CustomStackFullWidth
      alignItems="left"
      justifyContent="left"
      spacing={2}
       padding="30px"
      textAlign="left !important"
      sx={{
        backgroundImage: `url(${bg1.src})`,
        backgroundSize: {
          xs: "cover", // For extra small screens (mobiles)
          sm: "contain", // For small screens (tablets)
          md: "cover", // For medium screens (laptops)
          lg: "cover", // For large screens (desktops)
        },
        backgroundPosition: "center",
        height: "50vh",
        width: "100%",
        
        //backgroundColor: "rgba(3, 157, 85, 0.05)",
        //py: "3.125rem",
        //px: "1rem",
        borderRadius: "30px",
        //height: "500px",
        //marginLeft:"5% !important",
       // marginRight:"200px !important",
        //marginTop:"10px !important",
        //marginBottom:"10px !important",
        // backgroundImage: `url(${bg1.src})`,
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
        // objectFit: "contain",
        //background: `url(${bg1.src}) no-repeat center center / cover, rgba(3, 157, 85, 0.05)  `,
       // margin: {
         // xs: "8px",  // Small devices (phones)
         // sm: "16px", // Medium devices (tablets)
         // md: "24px", // Larger devices (laptops)
         // lg: "32px", // Large devices (desktops)
         // xl: "40px", // Extra large devices      
      }}
    >
      <H1 fontSize="40px !important" textAlign="left !important" text={headingText} />
      <Typography textAlign="left" fontSize="20px !important">{subtitleText}</Typography>
      <CustomButtonPrimary onClick={redirectHandler}>
        {t("Register")}
      </CustomButtonPrimary>
    </CustomStackFullWidth>
    
  );
};

const CenterCards = ({ configData }) => {
  const text1 = t("We assist in growing your business by connecting you with thousands of potential customers");
  const text2 = t("to start your business");
  return (
    <CustomStackFullWidth
      direction={{ xs: "column", sm: "row" }}
      spacing={4}
      width="80% !important"
      marginLeft="10% !important"
      justifyContent="space-between"
      alignItems="stretch"
      color="white"
    >
      {configData?.toggle_dm_registration && (
        <Card
          headingText="Expand your customer base"
        //  subtitleText={`${text1} ${configData?.business_name} ${text2}`}
          subtitleText={`${text1}`}
          redirectLink={`${process.env.NEXT_PUBLIC_BASE_URL}/store/apply`}
        />
      )}

       {configData?.toggle_dm_registration && (
        <Card1
   
          headingText="Join as a courier partner"
          subtitleText={t("Start earning by delivering to local customers. Enjoy the flexibility to set your own hours and deliver on your terms")}
          redirectLink={`${process.env.NEXT_PUBLIC_BASE_URL}/deliveryman/apply`}
        />
      )} 
    </CustomStackFullWidth>
  );
};

const Registration = ({ configData }) => {
  return (
    <CustomContainer>
      <CustomStackFullWidth py="3.125rem" spacing={5} height="100%">
        <TopText configData={configData} />
        <CenterCards  configData={configData} />
      </CustomStackFullWidth>
    </CustomContainer>
  );
};

Registration.propTypes = {};

export default Registration;
