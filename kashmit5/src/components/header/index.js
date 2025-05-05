import React, { useEffect, useState } from "react";
import { AppBarStyle } from "./NavBar.style";
import { Box, Card } from "@mui/material";
import { useRouter } from "next/router";
import TopNavBar from "../header/top-navbar/TopNavBar";
import SecondNavBar from "../header/second-navbar/SecondNavbar";

const HeaderComponent = ({ configData }) => {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showTopNav, setShowTopNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      setShowTopNav(position <= 1); // Show top nav when scrolled to top
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBarStyle>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1250,
        }}
      >
        {showTopNav && (
          <TopNavBar 
            configData={configData} 
            showTopNav={showTopNav} 
          />
        )}
        <SecondNavBar
          configData={configData}
          scrollPosition={scrollPosition}
        />
      </Box>
    </AppBarStyle>
  );
};

export default HeaderComponent;