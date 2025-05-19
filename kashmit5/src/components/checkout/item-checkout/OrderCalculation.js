import React, { useEffect, useState } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { CalculationGrid, TotalGrid } from "../CheckOut.style";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import CustomDivider from "../../CustomDivider";
import {
  getCalculatedTotal,
  getCouponDiscount,
  getDeliveryFees,
  getProductDiscount,
  getSubTotalPrice,
  getTaxableTotalPrice,
} from "../../../utils/CustomFunctions";
import { getAmountWithSign } from "../../../helper-functions/CardHelpers";
import { setTotalAmount } from "../../../redux/slices/cart";

const OrderCalculation = (props) => {
  const {
    cartList,
    storeData,
    couponDiscount,
    taxAmount,
    distanceData,
    total_order_amount,
    configData,
    orderType,
    couponInfo,
    deliveryTip,
    origin,
    destination,
    zoneData,
    setDeliveryFee,
    extraCharge,
    extraChargeLoading,
    setPayableAmount,
    payableAmount,
    paymentMethod,
    walletBalance,
    usePartialPayment,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  let couponType = "pele";
  const getDigitalPaymentPercentage = () => {
    if (paymentMethod === "cash_on_delivery" || paymentMethod === "wallet") {
      return 0;
    }
    if (paymentMethod === "paypal") {
      return configData?.paypal_perchantage;
    }
    if (
      paymentMethod === "OTP" ||
      paymentMethod === "KHBSZEP" ||
      paymentMethod === "MKBSZEP"
    ) {
      return configData?.bigfish_perchantage;
    }
    if (paymentMethod === "debit_card/credit_card") {
      return configData?.stripe_perchantage;
    }
  };

  const isFreeDelivery = () => {
    const distanceInKm =
      distanceData?.data?.rows?.[0]?.elements?.[0]?.distance?.value / 1000;

    const distanceFree =
      storeData?.free_delivery_set_by_admin === 1 &&
      storeData?.free_delivery_required_km_upto_status === 1 &&
      distanceInKm !== null &&
      distanceInKm <= storeData?.free_delivery_required_km_upto;

    const couponFree = couponDiscount?.coupon_type === "free_delivery";

    return distanceFree || couponFree;
  };

  const isFreeDeliveryByDistance = () => {
    const distanceInKm =
      distanceData?.data?.rows?.[0]?.elements?.[0]?.distance?.value / 1000;

    return (
      storeData?.free_delivery_set_by_admin === 1 &&
      storeData?.free_delivery_required_km_upto_status === 1 &&
      distanceInKm !== null &&
      distanceInKm <= storeData?.free_delivery_required_km_upto
    );
  };

  const handleDeliveryFee = () => {
    if (isFreeDelivery()) {
      setDeliveryFee(0);
      return <Typography fontWeight="bold">{t("Free")}</Typography>;
    }

    let price = getDeliveryFees(
      storeData,
      configData,
      cartList,
      distanceData?.data,
      couponDiscount,
      couponType,
      orderType,
      zoneData,
      origin,
      destination,
      extraCharge
    );
    console.log({ price });

    setDeliveryFee(price);
    if (price === 0) {
      return <Typography fontWeight="bold">{t("Free")}</Typography>;
    } else {
      return (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.5}
          width="100%"
        >
          <Typography fontWeight="bold">{"(+)"}</Typography>
          <Typography fontWeight="bold">
            {storeData && getAmountWithSign(price)}
          </Typography>
        </Stack>
      );
    }
  };
  const handleCouponDiscount = () => {
    let couponDiscountValue = getCouponDiscount(
      couponDiscount,
      storeData,
      cartList
    );

    if (couponDiscount && couponDiscount.coupon_type === "free_delivery") {
      return 0;
    } else {
      return getAmountWithSign(couponDiscountValue);
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    //dispatch(setCouponType(''))
  }, []);
  const serviceChange = (payableAmount * getDigitalPaymentPercentage()) / 100;
  const handleOrderAmount = () => {
    let totalAmount = getCalculatedTotal(
      cartList,
      couponDiscount,
      storeData,
      configData,
      distanceData,
      couponType,
      orderType,
      isFreeDelivery(),
      deliveryTip,
      zoneData,
      origin,
      destination,
      extraCharge
    );
    setPayableAmount(totalAmount);
    dispatch(setTotalAmount(totalAmount));
    return totalAmount + (serviceChange || 0);
  };
  console.log("freeeeee",isFreeDelivery())

  // let totalAfterPartials = handleOrderAmount();
  const discountedPrice = getProductDiscount(cartList, storeData);
  console.log({ discountedPrice })

  // useEffect(() => {
  //   totalAfterPartials = handleOrderAmount() - walletBalance;
  // }, [usePartialPayment]);
  const totalAmountAfterPartial = handleOrderAmount() - walletBalance;
  return (
    <>
      <CalculationGrid container item md={12} xs={12} spacing={1}>
        <Grid item md={8} xs={8}>
          {cartList.length > 1 ? t("Items Price") : t("Item Price")}
        </Grid>
        <Grid item md={4} xs={4} align="right">
          <Typography fontWeight="bold" align="right">
            {getAmountWithSign(getSubTotalPrice(cartList))}
          </Typography>
        </Grid>
        <Grid item md={8} xs={8}>
          {t("Discount")}
        </Grid>
        <Grid item md={4} xs={4} align="right">
          <Stack
            width="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={0.5}
          >
            <Typography fontWeight="bold">{"(-)"}</Typography>
            <Typography fontWeight="bold">
              {storeData && getAmountWithSign(discountedPrice)}
            </Typography>
          </Stack>
        </Grid>
        {couponDiscount && (
          <>
            <Grid item md={8} xs={8}>
              {t("Coupon Discount")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              {couponDiscount.coupon_type === "free_delivery" ? (
                <Typography fontWeight="bold">{t("Free Delivery")}</Typography>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  <Typography fontWeight="bold">{"(-)"}</Typography>
                  <Typography fontWeight="bold">
                    {storeData && cartList && handleCouponDiscount()}
                  </Typography>
                </Stack>
              )}
            </Grid>
          </>
        )}
        {storeData && storeData?.tax ? (
          <>
            <Grid item md={8} xs={8}>
              {t("TAX")} ({storeData?.tax}%{" "}
              {configData?.tax_included === 1 && t("Included")})
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                {configData?.tax_included === 0 && (
                  <Typography fontWeight="bold">{"(+)"}</Typography>
                )}
                <Typography fontWeight="bold">
                  {storeData &&
                    getAmountWithSign(
                      getTaxableTotalPrice(cartList, couponDiscount, storeData)
                    )}
                </Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {Number.parseInt(configData?.dm_tips_status) === 1 &&
          orderType === "delivery" && (
            <>
              <Grid item md={8} xs={8}>
                {t("Deliveryman tips")}
              </Grid>
              <Grid item md={4} xs={4} align="right">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={0.5}
                >
                  <Typography fontWeight="bold">{"(+)"}</Typography>
                  <Typography fontWeight="bold">
                    {getAmountWithSign(deliveryTip)}
                  </Typography>
                </Stack>
              </Grid>
            </>
          )}
        {serviceChange > 0 && (
          <>
            <Grid item md={8} xs={8}>
              {t("Service change")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography fontWeight="bold">{"(+)"}</Typography>
                <Typography fontWeight="bold">
                  {getAmountWithSign(serviceChange)}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}

        <Grid item md={8} xs={8}>
          {t("Delivery fee")}
        </Grid>
        <Grid item md={4} xs={4} align="right">
          {couponDiscount ? (
            couponDiscount?.coupon_type === "free_delivery" ? (
              <Typography fontWeight="bold">{t("Free")}</Typography>
            ) : (
              storeData && handleDeliveryFee()
            )
          ) : (
            storeData && handleDeliveryFee()
          )}
        </Grid>
        <CustomDivider />
        <TotalGrid container md={12} xs={12} mt="1rem">
          <Grid item md={8} xs={8} pl=".5rem">
            <Typography fontWeight="bold" color={theme.palette.primary.main}>
              {t("Total")}
            </Typography>
          </Grid>
          <Grid item md={4} xs={4} align="right">
            <Typography color={theme.palette.primary.main} align="right">
              {storeData && cartList && getAmountWithSign(handleOrderAmount())}
            </Typography>
          </Grid>
        </TotalGrid>
        {usePartialPayment && payableAmount > walletBalance ? (
          <>
            <Grid item md={8} xs={8} sx={{ textTransform: "capitalize" }}>
              {t("Paid by wallet")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>{"(-)"}</Typography>
                <Typography>
                  {getAmountWithSign(walletBalance, storeData?.zone_id)}
                </Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
        {usePartialPayment && payableAmount > walletBalance ? (
          <>
            <Grid item md={8} xs={8}>
              {t("Due Payment")}
            </Grid>
            <Grid item md={4} xs={4} align="right">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                <Typography>
                  {getAmountWithSign(
                    totalAmountAfterPartial,
                    storeData?.zone_id
                  )}
                </Typography>
              </Stack>
            </Grid>
          </>
        ) : null}
      </CalculationGrid>
    </>
  );
};

OrderCalculation.propTypes = {};

export default OrderCalculation;
