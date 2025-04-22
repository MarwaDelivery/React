import React from "react";
// import { DeliveryCaption, DeliveryTitle, StyledPaper } from "./CheckOut.style";
import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
// import DeliveryAddress from "./DeliveryAddress";
import { Paper } from "@mui/material";
import { CustomPaperBigCard } from "../../../styled-components/CustomStyles.style";
import { DeliveryCaption, DeliveryTitle } from "../CheckOut.style";
import DeliveryAddress from "../delivery-address";

const DeliveryDetails = (props) => {
  const {
    storeData,
    setOrderType,
    orderType,
    setAddress,
    address,
    configData,
    forprescription,
    setDeliveryTip,
    allAddress,
    setAllAddress,
    data,
    setData,
    dispatch,
    handleSuccess,
    handleLatLng,
    isRefetching,
    isLoading,
    refetch,
    zoneData
  } = props;
  const { t } = useTranslation();
  return (
    <CustomPaperBigCard>
      <DeliveryTitle>{t("DELIVERY DETAILS")}</DeliveryTitle>
      <FormControl>
        <DeliveryCaption const id="demo-row-radio-buttons-group-label">
          {t("Delivery Options")}
        </DeliveryCaption>
        {storeData && (
          <RadioGroup
            defaultValue="delivery"
            row
            onChange={(e) => {
              const value = e.target.value;
              if (value !== "delivery") {
                setDeliveryTip(0);
              }
              setOrderType(value);
            }}
          >
            {storeData?.delivery && (
              <FormControlLabel
                value="delivery"
                control={<Radio />}
                label={t("Home Delivery")}
              />
            )}
            {storeData?.take_away && forprescription !== "true" && (
              <FormControlLabel
                value="take_away"
                control={<Radio />}
                label={t("Take Away")}
              />
            )}
          </RadioGroup>
        )}
      </FormControl>
      {orderType === "delivery" && (
        <DeliveryAddress
          setAddress={setAddress}
          address={address}
          configData={configData}
          allAddress={allAddress}
          setAllAddress={setAllAddress}
          data={data}
          setData={setData}
          dispatch={dispatch}
          handleSuccess={handleSuccess}
          handleLatLng={handleLatLng}
          isRefetching={isRefetching}
          isLoading={isLoading}
          refetch={refetch}
          zoneData={zoneData}
        />
      )}
    </CustomPaperBigCard>
  );
};

DeliveryDetails.propTypes = {};

export default DeliveryDetails;
