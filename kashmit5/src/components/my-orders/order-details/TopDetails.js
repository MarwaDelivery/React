import React from "react";
import Image from "next/image";
import { Skeleton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { HeadingBox } from "../myorders.style";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { CustomTypography } from "../../landing-page/hero-section/HeroSection.style";
import CustomFormatedDateTime from "../../date/CustomFormatedDateTime";
import gif from "../../../../public/static/ongoing_animation.gif";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import OrderDeliveryTime from "components/my-orders/order-details/other-order/OrderDeliveryTime";
const TopDetails = ({ data, trackData, isLoading }) => {
  const { t } = useTranslation();

  return (
    <HeadingBox>
      <CustomStackFullWidth alignItems="center" justifyContent="center">
        {data ? (
          <Typography
            sx={{
              color: "primary.main",
              fontSize: "36px",
              fontWeight: "600",
            }}
          >
            {t("Order")} #{" "}
            {data?.[0]?.order_id ? data?.[0]?.order_id : data?.id}
          </Typography>
        ) : (
          <Skeleton variant="text" width="200px" height="50px" />
        )}
        {data ? (
          <CustomTypography
            sx={{ color: (theme) => theme.palette.neutral[400] }}
          >
            {t("Order placed")} :{" "}
            <CustomFormatedDateTime date={data?.[0]?.created_at} />
          </CustomTypography>
        ) : (
          <Skeleton variant="text" width="240px" height="20px" />
        )}
        {trackData?.data?.scheduled === 1 && (
          <CustomTypography>
            {t("Order scheduled")} :
            <CustomFormatedDateTime date={trackData?.data?.schedule_at} />
          </CustomTypography>
        )}
        {!isLoading && trackData?.data?.module?.module_type !== "parcel" && (
          <OrderDeliveryTime trackData={trackData} />
        )}

        {/*<Typography>hello</Typography>*/}
      </CustomStackFullWidth>
    </HeadingBox>
  );
};

export default TopDetails;
