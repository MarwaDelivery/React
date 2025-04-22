import React, { useEffect, useState } from "react";

import { ButtonGroup, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import { StoreDetailsNavButton } from "styled-components/CustomStyles.style";

const useStyles = makeStyles((theme) => ({
  affected: {
    textAlign: "right",
  },
  unaffected: {
    flip: false,
    textAlign: "right",
  },
}));

const TabForAI = ({ setType, type }) => {
  const [language_direction, setlanguage_direction] = useState("ltr");
  useEffect(() => {
    if (localStorage.getItem("direction")) {
      setlanguage_direction(localStorage.getItem("direction"));
    }
  }, []);

  const { t } = useTranslation();

  const classes = useStyles();
  return (
    <Tabs
      orientation="horizontal"
      // variant="contained"
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
    >
      <ButtonGroup
        sx={{ borderTopLeftRadius: "30px" }}
        className={classes.unaffected}
      >
        <StoreDetailsNavButton
          background={type === "ai"}
          onClick={() => setType("ai")}
          sx={{ width: { xs: "60px", md: "60px" }, padding: "2px 2px" }}
        >
          {t("AI")}
        </StoreDetailsNavButton>
        <StoreDetailsNavButton
          language_direction={language_direction}
          background={type === "agent"}
          onClick={() => setType("agent")}
          sx={{ width: { xs: "60px", md: "60px" }, padding: "2px 2px" }}
          borderLeftBottom="15px"
          borderLeftTop="20px"
        >
          {t("Agent")}
        </StoreDetailsNavButton>
      </ButtonGroup>
    </Tabs>
  );
};

export default TabForAI;
