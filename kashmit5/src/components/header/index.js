import React, { useEffect, useState } from "react";
import { AppBarStyle } from "./NavBar.style";

import { Box, Card } from "@mui/material";
import { useRouter } from "next/router";
import TopNavBar from "../header/top-navbar/TopNavBar";
import SecondNavBar from "../header/second-navbar/SecondNavbar";

const HeaderComponent = ({ configData }) => {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBarStyle>
      {router.pathname === "/" ? (
        <Box
          sx={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
          }}
        >
          <TopNavBar configData={configData} />
          <SecondNavBar
            configData={configData}
            scrollPosition={scrollPosition}
          />
        </Box>
      ) : (
        <>
          <Card
            sx={{
              boxShadow: "none",
              borderBottom: (theme) =>
                `1px solid ${theme.palette.neutral[300]}`,
            }}
          >
            <TopNavBar configData={configData} />
          </Card>
          <SecondNavBar configData={configData} />
        </>
      )}
    </AppBarStyle>
  );
};

export default HeaderComponent;
