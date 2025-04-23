import React, { useEffect, useReducer, useState } from "react";
import {
  Button,
  Grid,
  Box,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetCategories } from "../../../api-manage/hooks/react-query/all-category/all-categorys";
import { Skeleton } from "@mui/material";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTheme } from "@emotion/react";

const initialState = {
  categories: [],
  isSelected: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setCategories":
      return {
        ...state,
        categories: action.payload,
      };
    case "setIsSelected":
      return {
        ...state,
        isSelected: action.payload,
      };
    default:
      return state;
  }
};

const ACTION = {
  setCategories: "setCategories",
  setIsSelected: "setIsSelected",
};

const Sidebar = (props) => {
  const {
    ownCategories,
    handleCategoryId,
    handleChangePrice,
    priceFilterRange,
    storesApiLoading,
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const theme = useTheme();
  const [minMax, setMinMax] = useState([0, 0]);

  const handleOnSuccess = (res) => {
    if (ownCategories?.length > 0 && res?.data?.length > 0) {
      const common = res?.data?.filter((item) =>
        ownCategories.some((oItem) => oItem === item?.id)
      );
      dispatch({ type: ACTION.setCategories, payload: common });
    }
  };

  const { refetch, isFetching } = useGetCategories(
    "",
    handleOnSuccess,
    "stores-categories"
  );

  useEffect(() => {
    refetch();
  }, []);

  const handleCategoriesClick = (id) => {
    dispatch({ type: ACTION.setIsSelected, payload: id });
    handleCategoryId?.(id);
  };

  const handleMinMax = (value) => {
    if (value[0] === 0) {
      value[0] = priceFilterRange?.[0]?.min_price;
    }
    setMinMax(value);
  };

  const handleFilter = () => {
    handleChangePrice(minMax);
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "white", borderRadius: "8px", mb: 2}}>
      <Grid container spacing={2} alignItems="center">
        {/* Categories Filter */}
        <Grid item xs={12} md={8}>
          <Typography fontWeight="bold" mb={1}>
            {t("Categories")}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1}}>
            <Button
              variant={state.isSelected === 0 ? "contained" : "outlined"}
              onClick={() => handleCategoriesClick(0)}
            >
              {t("All")}
            </Button>
            {state.categories.map((item) => (
              <Button
                key={item.id}
                variant={state.isSelected === item?.id ? "contained" : "outlined"}
                onClick={() => handleCategoriesClick(item?.id)}
              >
                {item?.name}
              </Button>
            ))}
          </Box>
        </Grid>

        {/* Price Filter */}
     {/*   <Grid item xs={12} md={4}>
          <Typography fontWeight="bold" mb={1}>
            {t("Price Range")}
          </Typography>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6} sm={4}>
              <TextField
                size="small"
                label={t("Min")}
                fullWidth
                value={minMax[0] === 0 ? "" : minMax[0]}
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    setMinMax((prev) => [e.target.value, prev[1]]);
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                size="small"
                label={t("Max")}
                fullWidth
                value={minMax[1] === 0 ? "" : minMax[1]}
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    setMinMax((prev) => [prev[0], e.target.value]);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <LoadingButton
                fullWidth
                variant="contained"
                loading={storesApiLoading}
                disabled={JSON.stringify(minMax) === JSON.stringify([0, 0])}
                onClick={handleFilter}
                sx={{ height: "100%" }}
              >
                <ArrowRightIcon />
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>*/}
      </Grid>
    </Box>
  );
};

export default Sidebar;
