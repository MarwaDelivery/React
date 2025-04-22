import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  alpha,
  Grid,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import sideImage from "./assets/coupon.png";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import toast from "react-hot-toast";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomCopyWithTooltip from "../custom-copy-with-tooltip";

const CustomPaper = styled(Paper)(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.primary.main,
  borderRadius: "10px",
  textAlign: "center",
  height: "100%",
}));
const ImageWrapper = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.primary.main, 0.2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
  height: "100%",
  position: "relative",
  minHeight: "170px",
  [theme.breakpoints.down("sm")]: {
    height: "150px",
  },
}));

const Coupon = (props) => {
  const { coupon } = props;
  const { t } = useTranslation();
  const [copy, setCopy] = useState(false);
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const couponType = (coupon) => {
    if (coupon?.coupon_type === "store_wise") {
      return (
        <>
          {coupon?.coupon_type.replaceAll("_", " ")}
          <br />
          {coupon?.store?.name}
        </>
      );
    }
    if (coupon?.coupon_type === "zone_wise") {
      return (
        <>
          {t("Only for some specific zones")}{" "}
          {coupon?.store && `(${coupon?.store?.name})`}
        </>
      );
    }
    if (coupon?.coupon_type === "free_delivery") {
      return (
        <>
          {t("Free delivery")} {coupon?.store && `(${coupon?.store?.name})`}
        </>
      );
    }
    if (coupon?.coupon_type === "first_order") {
      return (
        <>
          {t("Only for First Order")}{" "}
          {coupon?.store && `(${coupon?.store?.name})`}
        </>
      );
    }
    if (coupon?.coupon_type === "default") {
      return (
        <>
          {coupon?.coupon_type} {coupon?.store && `(${coupon?.store?.name})`}
        </>
      );
    }
  };

  const handleCopy = (coupon_code) => {
    setCopy(true);
    navigator.clipboard.writeText(coupon_code);
    toast(() => (
      <span>
        {t("Coupon code")}
        <b style={{ marginLeft: "4px", marginRight: "4px" }}>{coupon_code}</b>
        {t("has been copied")}
      </span>
    ));
  };

  return (
    <CustomPaper>
      <Grid container>
        <Grid item md={5} xs={4}>
          <ImageWrapper>
            <img
              src={sideImage.src}
              alt={coupon?.discount}
              width={isXSmall ? "80px" : "100%"}
              height={isXSmall ? "80px" : "100%"}
            />
            <Typography fontWeight="bold">
              {coupon?.coupon_type === "free_delivery"
                ? t("Free Delivery")
                : coupon?.discount_type === "percent"
                ? `${coupon?.discount} %`
                : getAmountWithSign(coupon?.discount)}
              {coupon?.coupon_type === "free_delivery" ? "" : t("Off")}
            </Typography>
          </ImageWrapper>
        </Grid>
        <Grid item md={6} xs={7}>
          <CustomStackFullWidth
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography fontWeight="700" textTransform="uppercase">
              {coupon.code} ({coupon.title})
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: (theme) => theme.palette.neutral[400],
              }}
            >
              {t("Expired on")} : {coupon.expire_date}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              flexWrap="wrap"
              justifyContent="center"
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  color: (theme) => theme.palette.neutral[400],
                }}
              >
                {t("Min")} {t("Purchase")} :{" "}
                <b>{getAmountWithSign(coupon?.min_purchase)}</b>
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: (theme) => theme.palette.neutral[400],
                }}
              >
                {t("Max")} {t("Discount")} :{" "}
                <b>{getAmountWithSign(coupon?.max_discount)}</b>
              </Typography>
            </Stack>
            <Typography
              fontSize="13px"
              color="#9B9B9B"
              fontWeight="700"
              textTransform="capitalize"
            >
              {t("Type")} : {couponType(coupon)}
            </Typography>
          </CustomStackFullWidth>
        </Grid>
        <Grid item md={1} xs={1}>
          <CustomCopyWithTooltip t={t} value={coupon?.code} />
        </Grid>
      </Grid>
    </CustomPaper>
  );
};

Coupon.propTypes = {};

export default Coupon;
