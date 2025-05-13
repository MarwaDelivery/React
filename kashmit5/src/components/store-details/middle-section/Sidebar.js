import React, { useEffect, useReducer, useState } from "react";
import {
  Button,
  Box,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetCategories } from "../../../api-manage/hooks/react-query/all-category/all-categorys";
import { useTheme } from "@emotion/react";

const initialState = {
  categories: [],
  isSelected: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setCategories":
      return { ...state, categories: action.payload };
    case "setIsSelected":
      return { ...state, isSelected: action.payload };
    default:
      return state;
  }
};

const ACTION = {
  setCategories: "setCategories",
  setIsSelected: "setIsSelected",
};

const Sidebar = (props) => {
  const { ownCategories, handleScrollToCategory } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  
  const getMaxVisible = () => {
    if (isSmallScreen) {
      // For mobile - calculate based on container width and button min-width
      const containerWidth = document.querySelector('.categories-container')?.offsetWidth || 200;
      const buttonWidth = 100; // Minimum button width you want
      return Math.max(1, Math.floor(containerWidth / buttonWidth) - 1); // -1 to account for "More" button
    }
    return 5; // Default for larger screens
  };
  
  const MAX_VISIBLE = getMaxVisible();
  const handleOnSuccess = (res) => {
    if (ownCategories?.length > 0 && res?.data?.length > 0) {
      const common = res?.data?.filter((item) =>
        ownCategories.some((oItem) => oItem === item?.id)
      );
      dispatch({ type: ACTION.setCategories, payload: common });
    }
  };

  const { refetch } = useGetCategories("", handleOnSuccess, "stores-categories");

  useEffect(() => {
    refetch();
  }, []);

const handleCategoriesClick = (id) => {
  dispatch({ type: ACTION.setIsSelected, payload: id });
  handleScrollToCategory?.(id);
};


  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
<Box sx={{ 
  p: 2, 
  backgroundColor: "white", 
  borderRadius: "8px", 
  mb: 2 
}}>
  <Grid item xs={12} md={12} lg={12}>
    <Typography fontWeight="bold" mb={1}>
      {t("Categories")}
    </Typography>
    <Box sx={{
      display: "flex",
      flexWrap:"wrap",
      gap: 1, // Consistent spacing
      width: "100%",
      '& .MuiButton-root': {
        flex: "1 1 auto", // Grow and shrink as needed
        minWidth: { xs: "100px", sm: "120px" }, // Responsive min-width
        maxWidth: { xs: "100px", sm: "200px" }, // Responsive max-width
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller text on mobile
        p: { xs: "4px 8px", sm: "6px 12px" }, // Adjust padding
      }
    }}>
      <Button
        variant={state.isSelected === 0 ? "contained" : "outlined"}
        onClick={() => handleCategoriesClick(0)}
      >
        {t("All")}
      </Button>

      {state.categories.slice(0, MAX_VISIBLE).map((item) => (
        <Button
          key={item.id}
          variant={state.isSelected === item.id ? "contained" : "outlined"}
          onClick={() => handleCategoriesClick(item.id)}
        >
          {item.name}
        </Button>
      ))}

      {state.categories.length > MAX_VISIBLE && (
        <>
          <Button
            variant="outlined"
            onClick={handleMoreClick}
          >
            {t("More")} ({state.categories.length - MAX_VISIBLE})
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              dense: true,
            }}
          >
            {state.categories.slice(MAX_VISIBLE).map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  handleCategoriesClick(item.id);
                  handleClose();
                }}
                selected={state.isSelected === item.id}
              >
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  </Grid>
</Box>
  );
};  
export default Sidebar;