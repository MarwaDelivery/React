import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Container,
  NoSsr,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { CustomStackForLoaction, TopBarButton } from "../NavBar.style";
import ClickToCall from "./ClickToCall";
import ThemeSwitches from "./ThemeSwitches";
import CustomLanguage from "./CustomLanguage";
import AddressReselect from "./address-reselect/AddressReselect";

import LogoSide from "../../logo/LogoSide";
import DrawerMenu from "./drawer-menu/DrawerMenu";
import { useSelector } from "react-redux";
import CustomContainer from "../../container";

const TopNavBar = () => {
  const { configData, userLocation } = useSelector((state) => state.configData);
  const theme = useTheme();
  let location = undefined;
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
    zoneid = JSON.parse(localStorage.getItem("zoneid"));
  }
  const isSmall = useMediaQuery("(max-width:1180px)");

  return (
    <>
      <NoSsr>
        {!isSmall && (
          <CustomContainer>
            <Box
              sx={{
                display: isSmall ? "none" : "block",
                borderRadius: "0",
              }}
            >
              <Stack
                pY=".5rem"
                width="100%"
                height="40px"
                direction="row"
                justifyContent="space-between"
                sx={{
                  backgroundImage:
                    "linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))",
                 // backdropFilter: "blur(10px)",
                }}
              >
                <CustomStackForLoaction direction="row">
                  {location && <AddressReselect location={location} />}
                </CustomStackForLoaction>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="end"
                  alignItems="center"
                >
                  <ThemeSwitches />
               <ClickToCall>
                    <TopBarButton
                      size="small"
                     variant="text"
                     startIcon={
                       <LocalPhoneIcon
                          sx={{
                            ml: 1,
                            color: (theme) => theme.palette.neutral[1000],
                         }}
                       />
                     }
                   >
                    <Typography color={theme.palette.neutral[1000]}>
                   {configData?.phone} 
                    </Typography>
                  </TopBarButton> 
                 </ClickToCall> 
                  <CustomLanguage />
                </Stack>
              </Stack>
            </Box>
            {!location && (
              <Box
                sx={{
                  display: {
                    xs: "flex",
                    md: "none",
                    alignItems: "center",
                    gap: "10px",
                    flexDirection: "row",
                    justifyContent: " space-between ",
                  },
                  flexGrow: 1,
                }}
              >
                {/* <Logo src={logoSm.src} /> */}
                <Stack alignItems="center" justifyContent="center">
                  <LogoSide width="126px" configData={configData} />
                </Stack>
                <Stack>
                  <DrawerMenu />
                </Stack>
              </Box>
            )}
          </CustomContainer>
        )}
      </NoSsr>
    </>
  );
};

export default TopNavBar;