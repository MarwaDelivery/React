import React, { useEffect, useState } from "react";
import {
  Grid,
  TextareaAutosize,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DeliveryDetails from "../item-checkout/DeliveryDetails";
import { Stack } from "@mui/system";
import useGetStoreDetails from "../../../api-manage/hooks/react-query/store/useGetStoreDetails";
import { useSelector } from "react-redux";
import PaymentMethod from "../PaymentMethod";
import { useMutation, useQuery } from "react-query";
import { GoogleApi } from "../../../api-manage/hooks/react-query/googleApi";
import PlaceOrder from "../item-checkout/PlaceOrder";
import { onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import { CouponTitle } from "../CheckOut.style";
import {
  CustomPaperBigCard,
  CustomTextArea,
  CustomTextField,
} from "../../../styled-components/CustomStyles.style";
import { t } from "i18next";
import OrderCalculation from "../item-checkout/OrderCalculation";
import OrderCalculationShimmer from "../item-checkout/OrderCalculationShimmer";
import PrescriptionOrderCalculation from "../../Prescription/PrescriptionOrderCalculation";
import PrescriptionUpload from "../../Prescription/PrescriptionUpload";
import {
  getProductDiscount,
  handleDistance,
} from "../../../utils/CustomFunctions";
import { OrderApi } from "../../../api-manage/another-formated-api/orderApi";
import { toast } from "react-hot-toast";
import Router, { useRouter } from "next/router";
import { prescription_image_error_text } from "../../../utils/toasterMessages";

const PrescriptionCheckout = ({ storeId }) => {
  const router = useRouter();
  const matches = useMediaQuery("(max-width:1180px)");
  const [orderType, setOrderType] = useState("delivery");
  const [address, setAddress] = useState(undefined);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [prescriptionImages, setPrescriptionImages] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [note, setNote] = useState("");
  const { configData } = useSelector((state) => state.configData);
  const { data: storeData, refetch } = useGetStoreDetails(storeId);
  useEffect(() => {
    refetch();
  }, [storeId]);
  useEffect(() => {
    const currentLatLng = JSON.parse(localStorage.getItem("currentLatLng"));
    const location = localStorage.getItem("location");
    setAddress({
      ...currentLatLng,
      latitude: currentLatLng?.lat,
      longitude: currentLatLng?.lng,
      address: location,
      address_type: "Selected Address",
    });
    refetch();
  }, []);

  const currentLatLng = JSON.parse(
    window.localStorage.getItem("currentLatLng")
  );
  const handleChange = (e) => {
    setNote(e.target.value);
  };

  const { data: zoneData } = useQuery(
    ["zoneId", location],
    async () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
    }
  );
  const { data: distanceData, refetch: refetchDistance } = useQuery(
    ["get-distance", storeData, address],
    () => GoogleApi.distanceApi(storeData, address),
    {
      onError: onErrorResponse,
    }
  );
  useEffect(() => {
    storeData && address && refetchDistance();
  }, [storeData]);
  const { mutate: orderMutation, isLoading: orderLoading } = useMutation(
    "order-place",
    OrderApi.prescriptionPlaceOrder
  );

  const handleOrderMutationObject = () => {
    const originData = {
      latitude: storeData?.latitude,
      longitude: storeData?.longitude,
    };
    return {
      ...address,
      // order_time: scheduleAt,
      payment_method: paymentMethod,
      order_type: orderType,
      store_id: storeData?.id,
      distance: handleDistance(
        distanceData?.data?.rows?.[0]?.elements,
        originData,
        address
      ),
      prescriptionImages: prescriptionImages,
      order_note: note,
    };
  };

  const handlePlaceOrder = () => {
    const handleSuccessSecond = (res) => {
      if (res?.data) {
        toast.success(res?.data?.message);

        router.push("/order", undefined, { shallow: true });
      }
    };
    let order = handleOrderMutationObject();
    orderMutation(order, {
      onSuccess: handleSuccessSecond,
      onError: (error) => {
        error?.response?.data?.errors?.forEach((item) =>
          toast.error(item.message, {
            position: "bottom-right",
          })
        );
      },
    });
  };
  const placeOrder = () => {
    if (prescriptionImages.length > 0) {
      handlePlaceOrder();
    } else {
      toast.error(prescription_image_error_text);
    }
  };
  // if (orderSuccess) {
  //   router.push("/order");
  // }

  return (
    <Grid container spacing={3} mb="2rem">
      <Grid item xs={12} md={matches ? 12 : 7}>
        <Stack spacing={3}>
          <PrescriptionUpload
            prescriptionImages={prescriptionImages}
            setPrescriptionImages={setPrescriptionImages}
          />
          <DeliveryDetails
            storeData={storeData}
            setOrderType={setOrderType}
            orderType={orderType}
            setAddress={setAddress}
            address={address}
            configData={configData}
            forprescription="true"
          />
        </Stack>
      </Grid>

      <Grid item xs={12} md={matches ? 12 : 5} height="auto">
        <CustomPaperBigCard height="auto">
          <Stack spacing={3} justifyContent="space-between" alignItems="center">
            <CouponTitle variant="h6">{t("Order Summary")}</CouponTitle>
            {distanceData && storeData ? (
              <PrescriptionOrderCalculation
                storeData={storeData}
                distanceData={distanceData}
                configData={configData}
                orderType={orderType}
                origin={{
                  latitude: storeData?.latitude,
                  longitude: storeData?.longitude,
                }}
                destination={address}
                zoneData={zoneData}
                totalOrderAmount={0}
              />
            ) : (
              <OrderCalculationShimmer />
            )}
          </Stack>
        </CustomPaperBigCard>
      </Grid>
      <Grid item md={matches ? 12 : 7} xs={12}>
        <CustomPaperBigCard>
          <Stack align="center">
            <Typography variant="h6">{t("Additional Note")}</Typography>
          </Stack>
          <CustomTextArea
            aria-label="empty textarea"
            placeholder={t("Additional Note")}
            style={{ width: "100%", minHeight: "50px", marginTop: "20px" }}
            onChange={(e) => handleChange(e)}
          />
        </CustomPaperBigCard>
      </Grid>
      <Grid item md={matches ? 12 : 7} xs={12}>
        {zoneData && (
          <PaymentMethod
            setPaymentMethod={setPaymentMethod}
            paymentMethod={paymentMethod}
            zoneData={zoneData}
            forprescription="true"
          />
        )}
      </Grid>

      <Grid item md={12} xs={12}>
        <PlaceOrder
          placeOrder={placeOrder}
          orderLoading={orderLoading}
          zoneData={zoneData}
        />
      </Grid>
    </Grid>
  );
};

export default PrescriptionCheckout;
