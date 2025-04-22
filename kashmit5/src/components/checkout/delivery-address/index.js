import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { DeliveryCaption } from "../CheckOut.style";
import useGetAddressList from "../../../api-manage/hooks/react-query/address/useGetAddressList";
import AddressSelectionField from "./AddressSelectionField";
import AddressSelectionList from "./AddressSelectionList";
import { Skeleton, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUserLocation } from "redux/slices/configData";

export const getZoneWiseAddresses = (addresses, restaurantId) => {
  const newArray = [];
  addresses.forEach(
    (item) => item.zone_ids.includes(restaurantId) && newArray.push(item)
  );
  return newArray;
};
const DeliveryAddress = ({
  setAddress,
  address,
  hideAddressSelectionField,
  handleSize,
  renderOnNavbar,
  configData,
  storeZoneId,
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
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  
  return (
    <>
      <DeliveryCaption>{t("Delivery Addresses")}</DeliveryCaption>
      {isLoading && <Skeleton width="100%" height={150} />}
      {isRefetching && <Skeleton width="100%" height={150} />}
      {hideAddressSelectionField !== "true" && (
        <AddressSelectionField
          theme={theme}
          address={address}
          setAddress={setAddress}
          refetch={refetch}
          t={t}
          configData={configData}
        />
      )}
      {renderOnNavbar === "true" ? (
        <>
          <AddressSelectionList
            data={data}
            allAddress={allAddress}
            handleLatLng={handleLatLng}
            t={t}
            address={address}
            refetch={refetch}
            configData={configData}
            renderOnNavbar={renderOnNavbar}
          />
        </>
      ) : (
        <SimpleBar style={{ maxHeight: 200 }}>
          <AddressSelectionList
            data={data}
            allAddress={allAddress}
            handleLatLng={handleLatLng}
            t={t}
            address={address}
            isRefetching={isRefetching}
          />
        </SimpleBar>
      )}
    </>
  );
};
export default DeliveryAddress;
