import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import { t } from "i18next";
import { useRouter } from "next/router";
import CollapsableMenu from "./CollapsableMenu";

import useGetLatestStore from "../../../../api-manage/hooks/react-query/store/useGetLatestStore";
import { useGetCategories } from "../../../../api-manage/hooks/react-query/all-category/all-categorys";
import useGetPopularStore from "../../../../api-manage/hooks/react-query/store/useGetPopularStore";
import { CustomChip } from "../../../../styled-components/CustomStyles.style";
import { useSelector } from "react-redux";
import { Scrollbar } from "../../../srollbar";
import ButtonsContainer from "./ButtonsContainer";
import { getStoresOrRestaurants } from "../../../../helper-functions/getStoresOrRestaurants";

const MobileTopMenu = ({
  handleRoute,
  toggleDrawer,
  setOpenDrawer,
  handleLogout,
  openModal,
  isLogoutLoading,
  setOpenModal,
}) => {
  const { wishLists } = useSelector((state) => state.wishList);
  const router = useRouter();
  let token = undefined;
  let location = undefined;
  if (typeof window !== undefined) {
    location = localStorage.getItem("location");
    token = localStorage.getItem("token");
  }

  const { data: categoriesData, refetch } = useGetCategories();
  const { data: latestStore, refetch: refetchStore } = useGetLatestStore();
  useEffect(() => {
    refetch();
    refetchStore();
    popularRefetch();
  }, []);

  const queryKey = "navbar-stores";
  const type = "all";
  const {
    data: popularData,
    refetch: popularRefetch,
    isLoading: popularIsLoading,
  } = useGetPopularStore(queryKey, type);
  const collapsableMenu = {
    cat: {
      text: "Categories",
      items: categoriesData?.data?.map((item) => item),
      path: "/category",
    },
    latest: {
      text: `Latest ${getStoresOrRestaurants()}`,
      items: latestStore?.map((i) => i),
      path: "/store",
    },
    popularStore: {
      text: `Popular ${getStoresOrRestaurants()}`,
      items: popularData?.map((i) => i),
      path: "/store",
    },
    profile: {
      text: "Profile",
    },
  };
  const getWishlistCount = () => {
    return wishLists?.item?.length + wishLists?.store?.length;
  };

  return (
    <Box
      sx={{ width: "auto" }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Scrollbar style={{ maxHeight: "500px" }}>
        <List component="nav" aria-labelledby="nested-list-subheader">
          <>
            <ListItemButton
              sx={{
                marginTop: "30px",
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <ListItemText
                primary={t("Home")}
                onClick={() => handleRoute("/home")}
              />
            </ListItemButton>
            {location && (
              <>
                <CollapsableMenu
                  value={collapsableMenu.cat}
                  setOpenDrawer={setOpenDrawer}
                  toggleDrawers={toggleDrawer}
                  pathName="/categories"
                />
                <CollapsableMenu
                  value={collapsableMenu.latest}
                  setOpenDrawer={setOpenDrawer}
                  toggleDrawers={toggleDrawer}
                  pathName="/store/popular"
                />
                <CollapsableMenu
                  value={collapsableMenu.popularStore}
                  setOpenDrawer={setOpenDrawer}
                  toggleDrawers={toggleDrawer}
                  pathName="/store/latest"
                />
              </>
            )}

            {token && (
              <>
                {router.pathname === "/" && (
                  <ListItemButton
                    sx={{
                      "&:hover": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.3),
                      },
                    }}
                  >
                    <ListItemText
                      primary={t("Favorites")}
                      onClick={() => handleRoute("wishlist")}
                    />
                    <CustomChip label={getWishlistCount()} color="secondary" />
                  </ListItemButton>
                )}
              </>
            )}
            <ListItemButton
              onClick={() => handleRoute("terms-and-conditions")}
              sx={{
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <ListItemText primary={t("Terms & Conditions")} />
            </ListItemButton>
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.3),
                },
              }}
            >
              <ListItemText
                primary={t("Privacy Policy")}
                onClick={() => handleRoute("privacy-policy")}
              />
            </ListItemButton>
          </>
        </List>
      </Scrollbar>
      <ButtonsContainer
        token={token}
        handleRoute={handleRoute}
        handleLogout={handleLogout}
        openModal={openModal}
        isLogoutLoading={isLogoutLoading}
        setOpenModal={setOpenModal}
      />
    </Box>
  );
};

export default MobileTopMenu;
