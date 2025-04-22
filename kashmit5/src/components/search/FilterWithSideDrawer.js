import React, { useState } from "react";
import { PrimaryButton } from "../Map/map.style";
import { Stack } from "@mui/system";
import FilterListIcon from "@mui/icons-material/FilterList";
import { CustomTypography } from "../landing-page/hero-section/HeroSection.style";
import { t } from "i18next";
import CustomSideDrawer from "../side-drawer/CustomSideDrawer";
import FilterCard from "./FilterCard";
import { setFilterDrawerOpenByDispatch } from "../../redux/slices/searchFilter";
import { useDispatch } from "react-redux";
import { Typography, useMediaQuery, useTheme } from "@mui/material";

const FilterWithSideDrawer = ({ handleFilter, handleClearAll, pageData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const searchedDataMinMax = {
    min_price: pageData?.min_price,
    max_price: pageData?.max_price,
  };

  const handleDrawerOpen = () => {
    setSideDrawerOpen(true);
    dispatch(setFilterDrawerOpenByDispatch(true));
  };
  const handleDrawerClose = () => {
    setSideDrawerOpen(false);
    dispatch(setFilterDrawerOpenByDispatch(false));
  };

  return (
    <>
      <PrimaryButton
        variant="outlined"
        width="auto"
        backgroundcolor="none"
        onClick={() => handleDrawerOpen()}
        sx={{ color: (theme) => theme.palette.neutral[1000] }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
        >
          <FilterListIcon color="primary" />
          {!isSmall && <Typography variant="h6"> {t("Filter")}</Typography>}
        </Stack>
      </PrimaryButton>
      <CustomSideDrawer
        open={sideDrawerOpen}
        onClose={() => handleDrawerClose()}
        anchor="right"
      >
        <FilterCard
          setSideDrawerOpen={setSideDrawerOpen}
          handleFilter={handleFilter}
          handleClearAll={handleClearAll}
          handleDrawerClose={handleDrawerClose}
          searchedDataMinMax={searchedDataMinMax}
        />
      </CustomSideDrawer>
    </>
  );
};

export default FilterWithSideDrawer;
