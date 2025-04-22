import React from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { Card, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import PaymentMethodCard from "./PaymentMethodCard";
import digitalPayment from "../../../public/static/digitalpayment.svg";
import cashOnDelivery from "../../../public/static/cash-on-delivery.svg";
import wallet from "../../../public/static/wallet.svg";
import { PrimaryButton } from "../Map/map.style";
import LoadingButton from "@mui/lab/LoadingButton";
import { digitalPaymentData } from "components/checkout/digitalPaymentData";
import CustomImageContainer from "components/CustomImageContainer";
import bigfish from "../../../public/static/bb.png";

const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
  paidBy,
  orderPlace,
  isLoading,
  zoneData,
  forprescription,
  configData,
  usePartialPayment,
  storeData,
}) => {
  const inZone= zoneData?.data?.zone_data?.filter((item) => item.id === storeData?.zone_id);
  console.log({inZone})
  return (
    <CustomPaperBigCard>
      <CustomStackFullWidth spacing={4}>
        <Stack align="center">
          <Typography variant="h6">{t("Payment Method")}</Typography>
        </Stack>
        <CustomStackFullWidth spacing={2}>
          {inZone[0]?.cash_on_delivery && (
            <PaymentMethodCard
              paymentType={t("Cash on delivery")}
              image={cashOnDelivery}
              type="cash_on_delivery"
              description={t("Faster and safer way to send money")}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              paidBy={paidBy}
            />
          )}
          {configData?.customer_wallet_status === 1 &&
            paidBy !== "receiver" &&
            forprescription !== "true" &&
            !usePartialPayment && (
              <PaymentMethodCard
                paymentType={t("Wallet")}
                image={wallet}
                type="wallet"
                description={t("Faster and safer way to send money")}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paidBy={paidBy}
              />
            )}
          {paidBy !== "receiver" && forprescription !== "true" && (
            <>
              {digitalPaymentData?.map((item) => (
                <PaymentMethodCard
                  key={item.name}
                  paymentType={t(item.name)}
                  image={item?.image}
                  type={item.value}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  paidBy={paidBy}
                />
              ))}
            </>
            // <PaymentMethodCard
            //   paymentType={t("Digital Payment")}
            //   image={digitalPayment}
            //   type="digital_payment"
            //   description={t("Faster and safer way to send money")}
            //   paymentMethod={paymentMethod}
            //   setPaymentMethod={setPaymentMethod}
            //   paidBy={paidBy}
            // />
          )}
          <Stack
            direction="row"
            justifyContent="center"
            gap={2}
            alignItems="center"
          >
            <Typography>{t("Payment partner BIG FISH")}</Typography>
            <CustomImageContainer
              src={bigfish.src}
              alt="bigfish"
              width="100px"
            />
          </Stack>
        </CustomStackFullWidth>
        {paidBy && (
          <CustomStackFullWidth>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              onClick={orderPlace}
              loading={isLoading}
            >
              {t("Confirm Parcel Request")}
            </LoadingButton>
            {/*<PrimaryButton fullwidth="true">*/}
            {/*  {t("Confirm Parcel Request")}*/}
            {/*</PrimaryButton>*/}
          </CustomStackFullWidth>
        )}
      </CustomStackFullWidth>
    </CustomPaperBigCard>
  );
};

export default PaymentMethod;
