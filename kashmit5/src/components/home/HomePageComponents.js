//Old Code

import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import Banners from "./banners";
import FeaturedCategories from "./featured-categories";
import NewArrivalStores from "./new-arrival-stores";
import PopularItemsNearby from "./popular-items-nearby";
import RunningCampaigns from "./running-campaigns";
import BestReviewedItems from "./best-reviewed-items";
import StoresWithFilter from "./stores-with-filter";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import { setWishList } from "redux/slices/wishList";
import PushNotificationLayout from "../PushNotificationLayout";
import { Grid, styled, useMediaQuery } from "@mui/material";
import ManageSearch from "../header/second-navbar/ManageSearch";
import DeliveryPlace from "./DeliveryPlace";
import { Box, Stack } from "@mui/system";
import useGetCategoryLists from "api-manage/hooks/react-query/category-list/useGetCategoryLists";
import useGetCategoryListspopular from "api-manage/hooks/react-query/category-list-popular/useGetCategoryListspopular";
import { useGetSpecialCategoryListOne, useGetSpecialCategoryListTwo, useGetSpecialCategoryListThree } from "api-manage/hooks/categories-lists/useGetCategoriesList";
import CategoryStore from "./CategoryStore/CategoryStore";
import CategoryStorePopular from "./CategoryStorePopular/CategoryStorePopular";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

export const HomeComponentsWrapper = styled(Stack)(({ theme }) => ({
  width: "100%",
  gap: "8px",
}));

const HomePageComponents = ({ configData, isDiscovery }) => {
  const currentModuleType = getCurrentModuleType();
  const {
    data: categoryLists,
    isSuccess,
    isFetching,
    refetch: categoryListRefetch,
  } = useGetCategoryLists();

  const {
    data: categoryListsPopular,
    refetch: categoryListPopularRefetch,
  } = useGetCategoryListspopular();

  const { data: listOne, isLoading, error } = useGetSpecialCategoryListOne();
  const { data: listTwo } = useGetSpecialCategoryListTwo();
  const { data: listThree } = useGetSpecialCategoryListThree();







  useEffect(() => {
    categoryListRefetch();
    categoryListPopularRefetch();
  }, [currentModuleType]);

  const [wishListsData, setWishListsData] = useState();
  const matches = useMediaQuery("(max-width:1180px)");
  const router = useRouter();
  const dispatch = useDispatch();
  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }
  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const onSuccessHandler = (response) => {
    setWishListsData(response);
    dispatch(setWishList(response));
  };
  const { refetch } = useWishListGet(onSuccessHandler);
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, []);
  useEffect(() => {
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return (
    <PushNotificationLayout>
      {matches && (
        <>
          <CustomStackFullWidth
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <ManageSearch
              zoneid={zoneid}
              token={token}
              router={router}
              maxwidth="false"
            />
          </CustomStackFullWidth>
        </>
      )}
      <Box width="92%" marginLeft="4%">
        <Grid container spacing={1}>
          {/*<Grid item xs={12}>
              //<Banners />
          </Grid>*/}
          {!isDiscovery && <Grid item maxWidth="90% !important" marginLeft="5% !important" xs={12} sx={{ marginTop: "10px" }}>
            <FeaturedCategories configData={configData} />
          </Grid>}
          {isDiscovery && (
            <>
              <Grid item xs={12}>
                <Banners />
              </Grid>
              {listOne?.length > 0 &&
                listOne?.map((item, index) => (
                  <Grid key={index} item xs={12}>
                    <CategoryStorePopular
                      isFetchingg={isFetching}
                      isSuccesss={isSuccess}
                      item={item}
                    />
                  </Grid>
                ))}
              {/* <Grid item xs={12}>
                <NewArrivalStores />
              </Grid>*/}

              {listTwo?.length > 0 &&
                listTwo?.map((item, index) => (
                  <Grid key={index} item xs={12}>
                    <CategoryStorePopular
                      isFetching={isFetching}
                      isSuccess={isSuccess}
                      item={item}
                    />
                  </Grid>
                ))}
              {listThree?.length > 0 &&
                listThree?.map((item, index) => (
                  <Grid key={index} item xs={12}>
                    <CategoryStorePopular
                      isFetching={isFetching}
                      isSuccess={isSuccess}
                      item={item}
                    />
                  </Grid>
                ))}
            </>
          )}



          {/*  <Grid item xs={12}>
            <PopularItemsNearby />
          </Grid>   */}
          {/*   {categoryListsPopular?.length > 0 &&
            categoryListsPopular?.map((item, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <CategoryStorePopular
                    isFetchingg={isFetching}
                    isSuccesss={isSuccess}
                    item={item}
                  />
                </Grid>
              );
            })}  */}
          <Grid item xs={12}>
            <RunningCampaigns />
          </Grid>
          <Grid item xs={12}>
            {/*<NewArrivalStores /> */}
          </Grid>
          {/*  {categoryLists?.length > 0 &&
            categoryLists?.map((item, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <CategoryStore
                    isFetching={isFetching}
                    isSuccess={isSuccess}
                    item={item}
                  />
                </Grid>
              );
            })}
               <Grid item xs={12}>
            <BestReviewedItems />
          </Grid>  */}
          {/* Here is All resturants filter   */}
          {!isDiscovery && (<Grid item xs={12}>
            <StoresWithFilter />
          </Grid>)}
        </Grid>
      </Box>
      <CustomStackFullWidth></CustomStackFullWidth>
    </PushNotificationLayout>
  );
};

export default HomePageComponents;

/*

import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import Banners from "./banners";
import FeaturedCategories from "./featured-categories";
import NewArrivalStores from "./new-arrival-stores";
import RunningCampaigns from "./running-campaigns";
import StoresWithFilter from "./stores-with-filter";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import { setWishList } from "redux/slices/wishList";
import PushNotificationLayout from "../PushNotificationLayout";
import { Grid, styled, useMediaQuery } from "@mui/material";
import ManageSearch from "../header/second-navbar/ManageSearch";
import DeliveryPlace from "./DeliveryPlace";
import { Box, Stack } from "@mui/system";
import useGetCategoryLists from "api-manage/hooks/react-query/category-list/useGetCategoryLists";
import useGetCategoryListspopular from "api-manage/hooks/react-query/category-list-popular/useGetCategoryListspopular";
import CategoryStore from "./CategoryStore/CategoryStore";
import CategoryStorePopular from "./CategoryStorePopular/CategoryStorePopular";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

export const HomeComponentsWrapper = styled(Stack)(({ theme }) => ({
  width: "100%",
  gap: "8px",
}));

const HomePageComponents = ({ configData, isDiscovery = false }) => {
  const currentModuleType = getCurrentModuleType();
  const {
    data: categoryLists,
    isSuccess,
    isFetching,
    refetch: categoryListRefetch,
  } = useGetCategoryLists();

  const {
    data: categoryListsPopular,
    refetch: categoryListPopularRefetch,
  } = useGetCategoryListspopular();

  useEffect(() => {
    categoryListRefetch();
    categoryListPopularRefetch();
  }, [currentModuleType]);

  const [wishListsData, setWishListsData] = useState();
  const matches = useMediaQuery("(max-width:1180px)");
  const router = useRouter();
  const dispatch = useDispatch();
  let zoneid, token;

  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
    token = localStorage.getItem("token");
  }

  const onSuccessHandler = (response) => {
    setWishListsData(response);
    dispatch(setWishList(response));
  };

  const { refetch } = useWishListGet(onSuccessHandler);

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <PushNotificationLayout>
      {matches && (
        <CustomStackFullWidth
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <DeliveryPlace />
          <ManageSearch
            zoneid={zoneid}
            token={token}
            router={router}
            maxwidth="false"
          />
        </CustomStackFullWidth>
      )}

      <Box width="92%" marginLeft="4%">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Banners />
          </Grid>

          <Grid item xs={12} sx={{ marginTop: "10px", marginLeft: "5%", maxWidth: "90% !important" }}>
            <FeaturedCategories configData={configData} />
          </Grid>

          {isDiscovery ? (
            <>
              {categoryListsPopular?.length > 0 &&
                categoryListsPopular.map((item, index) => (
                  <Grid key={index} item xs={12}>
                    <CategoryStorePopular
                      isFetchingg={isFetching}
                      isSuccesss={isSuccess}
                      item={item}
                    />
                  </Grid>
                ))}

              <Grid item xs={12}>
                <NewArrivalStores />
              </Grid>

              {categoryLists?.length > 0 &&
                categoryLists.map((item, index) => (
                  <Grid key={index} item xs={12}>
                    <CategoryStore
                      isFetching={isFetching}
                      isSuccess={isSuccess}
                      item={item}
                    />
                  </Grid>
                ))}
            </>
          ) : (
            <Grid item xs={12}>
              <StoresWithFilter />
            </Grid>
          )}

          <Grid item xs={12}>
            <RunningCampaigns />
          </Grid>
        </Grid>
      </Box>
    </PushNotificationLayout>
  );
};

export default HomePageComponents;
*/