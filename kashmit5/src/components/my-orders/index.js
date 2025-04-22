import React, { useEffect, useState } from "react";
import { CustomContainer } from "../footer/Footer.style";
import NavigationButtons from "./NavigationButtons";
import { useTranslation } from "react-i18next";
import useGetMyOrdersList from "../../api-manage/hooks/react-query/order/useGetMyOrdersList";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomBoxFullWidth,
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { Grid, useMediaQuery } from "@mui/material";
import { Skeleton } from "@mui/material";
import CustomEmptyResult from "../custom-empty-result";
import nodata from "./assets/nodata.png";
import Order from "./order";
import CustomPagination from "../custom-pagination";
import { data_limit } from "../../api-manage/ApiRoutes";
import { setOrderType } from "../../redux/slices/utils";
import { useTheme } from "@mui/material/styles";
import useGetTrackOrderData from "../../api-manage/hooks/react-query/order/useGetTrackOrderData";
const CustomShimmerCard = () => {
  return (
    <CustomBoxFullWidth>
      <Grid container spacing={3}>
        {[...Array(6)].map((item, index) => {
          return (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Skeleton variant="rectangular" width="100%" height="10rem" />
            </Grid>
          );
        })}
      </Grid>
    </CustomBoxFullWidth>
  );
};

const MyOrders = (props) => {
  const theme = useTheme();
  const { configData } = props;
  const { t } = useTranslation();
  const { orderType } = useSelector((state) => state.utilsData);
  const [offset, setOffSet] = useState(1);
  const dispatch = useDispatch();
  const orderTypeValue = orderType === 0 ? "running-orders" : "list";
  const { data, refetch, isFetching } = useGetMyOrdersList({
    orderType: orderTypeValue,
    offset: offset,
  });

  useEffect(() => {
    refetch();

    dispatch(setOrderType(orderType === 0 ? 0 : 1));
  }, [orderType, offset]);
  const isXs = useMediaQuery("(max-width:700px)");
  return (
    <CustomStackFullWidth spacing={2} mt="3rem" sx={{ minHeight: "80vh" }}>
      <NavigationButtons t={t} setOffset={setOffSet} />
      <CustomPaperBigCard backgroundcolor={theme.palette.background.custom2}>
        <CustomStackFullWidth spacing={3}>
          {data?.orders?.length === 0 && (
            <CustomEmptyResult image={nodata} label="No Orders Found" />
          )}
          {isFetching ? (
            <CustomShimmerCard />
          ) : (
            <Grid container spacing={2}>
              {data &&
                data?.orders?.length > 0 &&
                data?.orders?.map((order) => (
                  <Grid
                    item
                    xs={12}
                    sm={isXs ? 12 : 6}
                    md={6}
                    lg={6}
                    key={order?.id}
                  >
                    <Order
                      order={order}
                      t={t}
                      configData={configData}
                      dispatch={dispatch}
                    />
                  </Grid>
                ))}
            </Grid>
          )}
          {data && (
            <CustomPagination
              total_size={data?.total_size}
              page_limit={data_limit}
              offset={offset}
              setOffset={setOffSet}
            />
          )}
        </CustomStackFullWidth>
      </CustomPaperBigCard>
    </CustomStackFullWidth>
  );
};

export default MyOrders;
