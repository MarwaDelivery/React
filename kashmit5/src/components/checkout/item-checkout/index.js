import React, { useEffect, useReducer, useState } from "react";
import { Button, Grid, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
  CustomTextField,
} from "../../../styled-components/CustomStyles.style";
import DeliveryDetails from "./DeliveryDetails";
import useGetStoreDetails from "../../../api-manage/hooks/react-query/store/useGetStoreDetails";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  generatePaymentUrl,
  getDayNumber,
  getFinalTotalPrice,
  getInfoFromZoneData,
  getProductDiscount,
  getTaxableTotalPrice,
  getVariation,
  handleDistance,
  isAvailable,
  isFoodAvailableBySchedule,
} from "../../../utils/CustomFunctions";
import { today, tomorrow } from "../../../utils/formatedDays";
import { GoogleApi } from "../../../api-manage/hooks/react-query/googleApi";
import { useMutation, useQuery } from "react-query";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-manage/api-error-response/ErrorResponses";
import { toast } from "react-hot-toast";
import Router from "next/router";
import { OrderApi } from "../../../api-manage/another-formated-api/orderApi";
import { ProfileApi } from "../../../api-manage/another-formated-api/profileApi";
import RestaurantScheduleTime from "./RestaurantScheduleTime";
import HaveCoupon from "./HaveCoupon";
import DeliveryManTip from "../DeliveryManTip";
import { CouponTitle, DeliveryCaption } from "../CheckOut.style";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import OrderSummaryDetails from "./OrderSummaryDetails";
import OrderCalculationShimmer from "./OrderCalculationShimmer";
import OrderCalculation from "./OrderCalculation";
import PaymentMethod from "../PaymentMethod";
import PlaceOrder from "./PlaceOrder";
import { baseUrl } from "../../../api-manage/MainApi";
import { cod_exceeds_message } from "../../../utils/toasterMessages";
import {
  setClearCart,
  setRemoveItemFromCart,
} from "../../../redux/slices/cart";
import { getCurrentModuleType } from "../../../helper-functions/getCurrentModuleType";
import SinglePrescriptionUpload from "../Prescription/SinglePrescriptionUpload";
import useGetVehicleCharge from "../../../api-manage/hooks/react-query/order-place/useGetVehicleCharge";
import { getStoresOrRestaurants } from "../../../helper-functions/getStoresOrRestaurants";
import moment from "moment/moment";
import reducer, { initialState } from "components/checkout/item-checkout/state";
import PartialPayment from "components/checkout/item-checkout/PartialPayment";
import AddNewAddress from "components/address/add-new-address";
import AddressSelectionField from "components/checkout/delivery-address/AddressSelectionField";
import CustomModal from "components/modal";
import AddressSelectionList from "components/checkout/delivery-address/AddressSelectionList";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import useGetAddressList from "api-manage/hooks/react-query/address/useGetAddressList";
import { setUserLocation } from "redux/slices/configData";
import { getZoneWiseAddresses } from "components/checkout/delivery-address";
import usePostDmNotification from "api-manage/hooks/react-query/order-place/usePostDmNotification";

const ItemCheckout = (props) => {
  const { configData, router, page, cartList, campaignItemList, totalAmount } =
    props;
  const [orderType, setOrderType] = useState("delivery");
  const [address, setAddress] = useState(undefined);
  const { couponInfo } = useSelector((state) => state.profileInfo);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [numberOfDay, setDayNumber] = useState(getDayNumber(today));
  const [couponDiscount, setCouponDiscount] = useState(null);
  const [scheduleAt, setScheduleAt] = useState("now");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total_order_amount, setTotalOrderAmount] = useState(0);
  const [enabled, setEnabled] = useState(cartList?.length ? true : false);
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isImageSelected, setIsImageSelected] = useState([]);
  const [payableAmount, setPayableAmount] = useState(null);
  const [allAddress, setAllAddress] = useState();
  const [isCouponVisible, setIsCouponVisible] = useState(true);
  const [data, setData] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");
  const dispatch = useDispatch();
  const theme = useTheme();
  const [state, reducerDispatch] = useReducer(reducer, initialState);
  const { refetch: dm_refetch } = usePostDmNotification(orderId);

  useEffect(() => {
    if (orderId) {
      dm_refetch();
    }
  }, [orderId]);

  console.log({isCouponVisible});
  

  useEffect(() => {
    reducerDispatch({
      type: "SET_ADDITIONAL_ADDRESS",
      payload: {
        streetNumber: address?.road,
        house: address?.house,
        floor: address?.floor,
        doorbell: address?.door_bell,
      },
    });
  }, [address]);

  const { t } = useTranslation();
  const currentModuleType = getCurrentModuleType();
  const storeId =
    page === "campaign"
      ? campaignItemList?.[0]?.store_id
      : cartList?.[0]?.store_id;
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
  const { data: zoneData } = useQuery(
    ["zoneId", location],
    async () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
    }
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        localStorage.setItem("zoneid", zoneData?.data?.zone_id);
        const isCOD = zoneData?.data?.zone_data?.some(
          (item) => item.cash_on_delivery
        );
        if (isCOD) {
          setPaymentMethod("cash_on_delivery");
        } else {
          setPaymentMethod("digital_payment");
        }
      }
    }
  }, [zoneData]);
  const { data: distanceData, refetch: refetchDistance } = useQuery(
    ["get-distance", storeData, address],
    () => GoogleApi.distanceApi(storeData, address),
    {
      onError: onErrorResponse,
    }
  );
  const tempDistance = handleDistance(
    distanceData?.data?.rows?.[0]?.elements,
    { latitude: storeData?.latitude, longitude: storeData?.longitude },
    address
  );

  const {
    data: extraCharge,
    isLoading: extraChargeLoading,
    refetch: extraChargeRefetch,
  } = useGetVehicleCharge({ tempDistance });
  useEffect(() => {
    if (distanceData) {
      extraChargeRefetch();
    }
  }, [distanceData]);
  const handleChange = (event) => {
    setDayNumber(event.target.value);
  };
  //order post api
  const { mutate: orderMutation, isLoading: orderLoading } = useMutation(
    "order-place",
    OrderApi.placeOrder
  );
  const userOnSuccessHandler = (res) => {
    // dispatch(setUser(res.data))
    // dispatch(setWalletAmount(res?.data?.wallet_balance))
  };
  const { isLoading: customerLoading, data: customerData } = useQuery(
    ["profile-info"],
    ProfileApi.profileInfo,
    {
      onSuccess: userOnSuccessHandler,
      onError: onSingleErrorResponse,
    }
  );
  useEffect(() => {}, [customerData]);
  console.log({customerData})

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
  useEffect(() => {
    storeData && address && refetchDistance();
  }, [storeData]);

  useEffect(() => {
    const taxAmount = getTaxableTotalPrice(
      cartList,
      couponDiscount,
      storeData?.tax,
      storeData
    );
    setTaxAmount(taxAmount);
  }, [cartList, couponDiscount, storeData]);
  useEffect(() => {
    const total_order_amount = getFinalTotalPrice(
      cartList,
      couponDiscount,
      taxAmount,
      storeData
    );
    setTotalOrderAmount(total_order_amount);
  }, [cartList, couponDiscount, taxAmount]);


  console.log({storeData})
  const handleValuesFromCartItems = (variationValues) => {
    let value = [];
    if (variationValues?.length > 0) {
      variationValues?.forEach((item) => {
        if (item?.isSelected) {
          value.push(item.label);
        }
      });
    } else {
      value.push(variationValues[0].label);
    }
    return value;
  };
  const handleProductList = (productList, totalQty) => {
    return productList?.map((cart) => {
      return {
        add_on_ids:
          cart?.selectedAddons?.length > 0
            ? cart?.selectedAddons?.map((add) => {
                return add.id;
              })
            : [],
        add_on_qtys:
          cart?.selectedAddons?.length > 0
            ? cart?.selectedAddons?.map((add) => {
                totalQty += add.quantity;
                return totalQty;
              })
            : [],
        add_ons:
          cart?.selectedAddons?.length > 0
            ? cart?.selectedAddons?.map((add) => {
                return {
                  id: add.id,
                  name: add.name,
                  price: add.price,
                };
              })
            : [],
        item_id: cart?.available_date_starts ? null : cart?.id,
        item_campaign_id: cart?.available_date_starts ? cart?.id : null,

        price: cart?.price,
        quantity: cart?.quantity,
        variant:
          cart?.module_type === "food" ? getVariation(cart?.variation) : [],
        //new variation form needs to added here
        variation:
          cart?.module_type === "food"
            ? cart?.food_variations?.length > 0
              ? cart?.food_variations?.map((variation) => {
                  return {
                    name: variation.name,
                    values: {
                      label: handleValuesFromCartItems(variation.values),
                    },
                  };
                })
              : []
            : cart?.selectedOption?.length > 0
            ? cart?.selectedOption
            : [],
      };
    });
  };
  const handleOrderMutationObject = (carts, productList) => {
    const originData = {
      latitude: storeData?.latitude,
      longitude: storeData?.longitude,
    };
    const isDigital =
      paymentMethod !== "cash_on_delivery" &&
      paymentMethod !== "wallet" &&
      paymentMethod !== ""
        ? "digital_payment"
        : paymentMethod;
    if (getCurrentModuleType() === "pharmacy") {
      const formData = new FormData();
      formData.append("cart", JSON.stringify(carts));
      if (scheduleAt !== "now") {
        formData.append("schedule_at", scheduleAt);
      }

      formData.append("payment_method", isDigital);
      formData.append("order_type", orderType);

      formData.append("store_id", storeData?.id);
      if (couponDiscount?.code) {
        formData.append("coupon_code", couponDiscount?.code);
      }

      formData.append("coupon_discount_amount", couponDiscount?.discount);
      formData.append("coupon_discount_title", couponDiscount?.title);

      formData.append("discount_amount", getProductDiscount(productList));
      formData.append(
        "distance",
        handleDistance(
          distanceData?.data?.rows?.[0]?.elements,
          originData,
          address
        )
      );
      formData.append("order_amount", totalAmount);
      formData.append("dm_tips", deliveryTip);

      formData.append("address", address?.address);
      formData.append("address_type", address?.address_type);
      formData.append("lat", address?.lat);
      formData.append("latitude", address?.latitude);
      formData.append("partial_payment", state.usePartialPayment);
      formData.append("lng", address?.lng);
      formData.append("longitude", address?.longitude);
      if (isImageSelected?.length > 0) {
        isImageSelected?.forEach((item) =>
          formData.append("order_attachment", item)
        );
      }
      return formData;
    } else {
      return {
        cart: JSON.stringify(carts),
        ...address,
        schedule_at: scheduleAt === "now" ? null : scheduleAt,
        // order_time: scheduleAt,
        partial_payment: state.usePartialPayment,
        payment_method: isDigital,
        order_type: orderType,
        store_id: storeData?.id,
        coupon_code: couponDiscount?.code,
        coupon_discount_amount: couponDiscount?.discount,
        coupon_discount_title: couponDiscount?.title,
        discount_amount: getProductDiscount(productList),
        distance: handleDistance(
          distanceData?.data?.rows?.[0]?.elements,
          originData,
          address
        ),
        order_amount: 100,
        dm_tips: deliveryTip,
        order_note: additionalNote,
      };
    }
  };
  const handlePlaceOrder = () => {
    const itemsList = page === "campaign" ? campaignItemList : cartList;
    const isAvailable = storeData?.schedule_order
      ? isFoodAvailableBySchedule(itemsList, scheduleAt)
      : true;
    if (isAvailable) {
      const walletAmount = customerData?.data?.wallet_balance;
      let productList = page === "campaign" ? campaignItemList : cartList;
      if (paymentMethod === "wallet") {
        if (Number(walletAmount) < Number(totalAmount)) {
          toast.error(t("Wallet balance is below total amount."), {
            id: "wallet",
            position: "bottom-right",
          });
        } else {
          let totalQty = 0;
          let carts = handleProductList(productList, totalQty);
          const handleSuccessSecond = (response) => {
            if (response?.data) {
              if (paymentMethod === "digital_payment") {
                setOrderId(response?.data?.order_id);
                toast.success(response?.data?.message);
                const newBaseUrl = baseUrl;
                const callBackUrl = `${window.location.origin}/order?order_id=${response?.data?.order_id}&total=${response?.data?.total_ammount}`;
                const url = `${newBaseUrl}/payment-mobile?order_id=${response?.data?.order_id}&customer_id=${customerData?.data?.id}&callback=${callBackUrl}`;
                localStorage.setItem("totalAmount", totalAmount);
                dispatch(setClearCart());
                Router.push(url, undefined, { shallow: true });
              } else if (paymentMethod === "wallet") {
                toast.success(response?.data?.message);
                setOrderId(response?.data?.order_id);
                setOrderSuccess(true);
              } else {
                if (response.status === 203) {
                  toast.error(response.data.errors[0].message);
                }
                //setOrderSuccess(true)
              }
            }
          };
          if (carts?.length > 0) {
            let order = handleOrderMutationObject(carts, productList);
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
          }
        }
      } else {
        let totalQty = 0;
        let carts = handleProductList(productList, totalQty);
        const handleSuccess = (response) => {
          if (response?.data) {
            toast.success(response?.data?.message, {
              id: paymentMethod,
            });
            setOrderId(response?.data?.order_id);
            if (paymentMethod !== "cash_on_delivery") {
              const paymentUrl = generatePaymentUrl(
                response?.data?.order_id,
                paymentMethod,
                response?.data?.total_ammount,
                customerData?.data?.id
              );
              const callBackUrl = `${window.location.origin}/order?order_id=${response?.data?.order_id}&total=${response?.data?.total_ammount}`;
              const url = `${paymentUrl}&callback=${callBackUrl}`;
              localStorage.setItem("totalAmount", totalAmount);
              dispatch(setClearCart());
              Router.push(url, undefined, { shallow: true });
            } else {
              setOrderSuccess(true);
            }
          }
        };
        if (carts?.length > 0) {
          let order = handleOrderMutationObject(carts, productList);
          orderMutation(order, {
            onSuccess: handleSuccess,
            onError: (error) => {
              error?.response?.data?.errors?.forEach((item) =>
                toast.error(item.message, {
                  position: "bottom-right",
                })
              );
            },
          });
        }
      }
    } else {
      toast.error(
        t(
          "One or more item is not available for the chosen preferable schedule time."
        )
      );
    }
  };

  const isStoreOpen = () => {
    // storeData?.schedule_order
  };
  const storeCloseToast = () =>
    toast.error(
      t(`${getStoresOrRestaurants().slice(0, -1)} is closed. Try again later.`)
    );
  //totalAmount
  const handlePlaceOrderBasedOnAvailability = () => {
    //cod -> cash on delivery
    const codLimit =
      getInfoFromZoneData(zoneData)?.pivot?.maximum_cod_order_amount;
    if (orderType === "take_away") {
      handlePlaceOrder();
    } else {
      if (codLimit) {
        if (totalAmount <= codLimit) {
          handlePlaceOrder();
        } else {
          toast.error(t(cod_exceeds_message), {
            duration: 5000,
          });
        }
      } else {
        handlePlaceOrder();
      }
    }
  };
  const placeOrder = () => {
    if (state.confirmAddress) {
      if (storeData?.active) {
        //checking restaurant or shop open or not
        if (storeData?.schedules.length > 0) {
          const todayInNumber = moment().weekday();
          let isOpen = false;
          let filteredSchedules = storeData?.schedules.filter(
            (item) => item.day === todayInNumber
          );
          let isAvailableNow = [];
          filteredSchedules.forEach((item) => {
            if (isAvailable(item?.opening_time, item?.closing_time)) {
              isAvailableNow.push(item);
            }
          });
          if (isAvailableNow.length > 0) {
            isOpen = true;
          } else {
            isOpen = false;
          }
          if (isOpen) {
            handlePlaceOrderBasedOnAvailability();
          }
        } else {
          storeCloseToast();
        }
      } else {
        storeCloseToast();
      }
    } else {
      reducerDispatch({ type: "SET_OPEN_CONFIRM_MODEL", payload: true });
    }
  };
  const couponRemove = () => {};
  useEffect(() => {
    orderSuccess && handleOrderSuccess();
  }, [orderSuccess]);
  const handleOrderSuccess = () => {
    if (page === "buy_now") {
      dispatch(setRemoveItemFromCart(cartList?.[0]));
    }
    localStorage.setItem("totalAmount", totalAmount);
    Router.push("/order", undefined, { shallow: true });
  };
  const handleImageUpload = (value) => {
    setIsImageSelected([value]);
  };

  const handlePartialPayment = () => {
    if (payableAmount > customerData?.data?.wallet_balance) {
      reducerDispatch({ type: "SET_USE_PARTIAL_PAYMENT", payload: true });
      reducerDispatch({ type: "SET_PAYMENT_METHOD", payload: "" });
      //reducerDispatch(setOfflineMethod(""));
    } else {
      setPaymentMethod("wallet");
      reducerDispatch({ type: "SET_SWITCH_TO_WALLET", payload: true });
      //reducerDispatch(setOfflineMethod(""));
    }
  };

  const removePartialPayment = () => {
    if (payableAmount > customerData?.data?.wallet_balance) {
      reducerDispatch({ type: "SET_USE_PARTIAL_PAYMENT", payload: false });
      setPaymentMethod("");
      //reducerDispatch(setOfflineMethod(""));
    } else {
      setPaymentMethod("");
      reducerDispatch({ type: "SET_SWITCH_TO_WALLET", payload: false });
      //reducerDispatch(setOfflineMethod(""));
    }
  };

  const handlePartialPaymentCheck = () => {
    if (configData?.partial_payment_status === 1) {
      if (couponDiscount && state.usePartialPayment) {
        if (
          payableAmount > customerData?.data?.wallet_balance &&
          !state.usePartialPayment
        ) {
          reducerDispatch({ type: "SET_OPEN_PARTIAL_MODEL", payload: true });
        } else {
          if (
            state.usePartialPayment &&
            customerData?.data?.wallet_balance > payableAmount
          ) {
            reducerDispatch({ type: "SET_OPEN_MODAL", payload: true });
          }
        }
      } else if (
        (deliveryTip > 0 && state.usePartialPayment) ||
        state.switchToWallet
      ) {
        if (payableAmount > customerData?.data?.wallet_balance) {
          reducerDispatch({ type: "SET_OPEN_PARTIAL_MODEL", payload: true });
        } else {
          if (
            state.usePartialPayment &&
            customerData?.data?.wallet_balance > payableAmount
          ) {
            reducerDispatch({ type: "SET_OPEN_MODAL", payload: true });
          }
        }
      } else if (orderType && state.usePartialPayment) {
        if (
          payableAmount > customerData?.data?.wallet_balance &&
          !state.usePartialPayment
        ) {
          reducerDispatch({ type: "SET_OPEN_PARTIAL_MODEL", payload: true });
        } else {
          if (
            state.usePartialPayment &&
            customerData?.data?.wallet_balance > payableAmount
          ) {
            reducerDispatch({ type: "SET_OPEN_MODAL", payload: true });
          }
        }
      }
    }
  };

  useEffect(() => {
    handlePartialPaymentCheck();
  }, [payableAmount]);

  const handleClose = () => {
    reducerDispatch({ type: "SET_OPEN_CONFIRM_MODEL", payload: false });
  };
  const handleConfirmAddress = () => {
    reducerDispatch({ type: "SET__CONFIRM_ADDRESS", payload: true });
    reducerDispatch({ type: "SET_OPEN_CONFIRM_MODEL", payload: false });
  };

  const handleStreetChange = (e) => {
    setAddress({
      ...address,
      road: e.target.value,
    });
    reducerDispatch({
      type: "SET_ADDITIONAL_ADDRESS",
      payload: {
        ...state,
        additionalAddress: {
          ...state.additionalAddress,
          streetNumber: e.target.value,
        },
      },
    });
  };
  const handleHouseChange = (e) => {
    setAddress({
      ...address,
      house: e.target.value,
    });
    reducerDispatch({
      type: "SET_ADDITIONAL_ADDRESS",
      payload: {
        ...state,
        additionalAddress: {
          ...state.additionalAddress,
          house: e.target.value,
        },
      },
    });
  };
  const handleFloorChange = (e) => {
    setAddress({
      ...address,
      floor: e.target.value,
    });
    reducerDispatch({
      type: "SET_ADDITIONAL_ADDRESS",
      payload: {
        ...state,
        additionalAddress: {
          ...state.additionalAddress,
          floor: e.target.value,
        },
      },
    });
  };
  const handleDoorChange = (e) => {
    setAddress({
      ...address,
      doorbell: e.target.value,
    });
    reducerDispatch({
      type: "SET_ADDITIONAL_ADDRESS",
      payload: {
        ...state,
        additionalAddress: {
          ...state.additionalAddress,
          door_bell: e.target.value,
        },
      },
    });
  };

  const mainAddress = {
    ...address,
  };
  const handleSuccess = (addressData) => {
    if (storeData?.zone_id) {
      const newObj = {
        ...addressData,
        addresses: getZoneWiseAddresses(
          addressData.addresses,
          storeData?.zone_id
        ),
      };
      setData(newObj);
    } else {
      setData(addressData);
    }
  };
  const {
    refetch: addressRefetch,
    isRefetching,
    isLoading,
  } = useGetAddressList(handleSuccess);

  useEffect(() => {
    addressRefetch();
  }, []);

  let zoneid = undefined;
  if (typeof window !== "undefined") {
    zoneid = localStorage.getItem("zoneid");
  }

  console.log({storeData});
 
  useEffect(() => {
    if (data?.addresses) {    
      setAllAddress([mainAddress, ...(data.addresses || [])]);
    }
  }, [data]);

  const handleLatLng = (values) => {
    setAddress({ ...values, lat: values.latitude, lng: values.longitude });
    dispatch(setUserLocation(values?.address));
    //localStorage.setItem("location", values.address);
    localStorage.setItem(
      "currentLatLng",
      JSON.stringify({ lat: values.latitude, lng: values.longitude })
    );
  };

  const isItemCouponApply = (cartList) => {
    return cartList?.every((item) => item?.is_apply_coupon === 1);
  };
  useEffect(() => {
    if(( storeData?.free_delivery && (storeData?.coupon_and_free_delivery_both === 0 || configData?.coupon_and_free_delivery_both === 0))){
      setIsCouponVisible(false);
    }else{
      setIsCouponVisible(true);
    }
   
  }, [
    deliveryFee,
    configData?.coupon_and_free_delivery_both,
    storeData?.coupon_and_free_delivery_both,
    cartList,
  ]);


  console.log({storeData});
  
  return (
    <Grid container spacing={3} mb="2rem">
      <Grid item xs={12} md={7}>
        <Stack spacing={3}>
          <DeliveryDetails
            storeData={storeData}
            setOrderType={setOrderType}
            orderType={orderType}
            setAddress={setAddress}
            address={address}
            configData={configData}
            setDeliveryTip={setDeliveryTip}
            allAddress={allAddress}
            setAllAddress={setAllAddress}
            data={data}
            setData={setData}
            dispatch={dispatch}
            handleSuccess={handleSuccess}
            handleLatLng={handleLatLng}
            isRefetching={isRefetching}
            isLoading={isLoading}
            refetch={addressRefetch}
            zoneData={zoneData}
          />
          <RestaurantScheduleTime
            storeData={storeData}
            handleChange={handleChange}
            today={today}
            tomorrow={tomorrow}
            numberOfDay={numberOfDay}
            configData={configData}
            setScheduleAt={setScheduleAt}
          />
          {storeData  && isCouponVisible && (
            <HaveCoupon
              store_id={storeData?.id}
              setCouponDiscount={setCouponDiscount}
              counponRemove={couponRemove}
              couponDiscount={couponDiscount}
              totalAmount={totalAmount}
              deliveryFee={deliveryFee}
              deliveryTip={deliveryTip}
            />
          )}

          {Number.parseInt(configData?.dm_tips_status) === 1 &&
            orderType === "delivery" && (
              <CustomPaperBigCard>
                <DeliveryManTip
                  deliveryTip={deliveryTip}
                  setDeliveryTip={setDeliveryTip}
                />
              </CustomPaperBigCard>
            )}
          <CustomPaperBigCard>
            <DeliveryCaption
              paddingTop="10px"
              const
              id="demo-row-radio-buttons-group-label"
            >
              {t("Additional Note")}
            </DeliveryCaption>
            <CustomTextField
              multiline
              rows={4}
              placeholder={t("Additional note for store")}
              label={t("Note")}
              value={additionalNote}
              fullWidth
              onChange={(e) => setAdditionalNote(e.target.value)}
            />
          </CustomPaperBigCard>
        </Stack>
      </Grid>
      <Grid item xs={12} md={5} height="auto">
        <CustomStackFullWidth spacing={3}>
          <CustomPaperBigCard height="auto">
            <Stack
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <CouponTitle variant="h6">{t("Order Summary")}</CouponTitle>
              <SimpleBar style={{ maxHeight: "500px", width: "100%" }}>
                <OrderSummaryDetails
                  page={page}
                  configData={configData}
                  cartList={cartList}
                  t={t}
                  campaignItemList={campaignItemList}
                />
              </SimpleBar>
              {distanceData && storeData ? (
                <OrderCalculation
                  cartList={page === "campaign" ? campaignItemList : cartList}
                  storeData={storeData}
                  couponDiscount={couponDiscount}
                  taxAmount={taxAmount}
                  distanceData={distanceData}
                  total_order_amount={total_order_amount}
                  configData={configData}
                  couponInfo={couponInfo}
                  orderType={orderType}
                  deliveryTip={deliveryTip}
                  origin={{
                    latitude: storeData?.latitude,
                    longitude: storeData?.longitude,
                  }}
                  destination={address}
                  zoneData={zoneData}
                  extraCharge={extraCharge && extraCharge}
                  setDeliveryFee={setDeliveryFee}
                  extraChargeLoading={extraChargeLoading}
                  setPayableAmount={setPayableAmount}
                  payableAmount={payableAmount}
                  paymentMethod={paymentMethod}
                  walletBalance={customerData?.data?.wallet_balance}
                  usePartialPayment={state.usePartialPayment}
                />
              ) : (
                extraChargeLoading && <OrderCalculationShimmer />
              )}
            </Stack>
          </CustomPaperBigCard>
          {currentModuleType === "pharmacy" && (
            <CustomPaperBigCard>
              <SinglePrescriptionUpload
                t={t}
                handleImageUpload={handleImageUpload}
              />
            </CustomPaperBigCard>
          )}
        </CustomStackFullWidth>
      </Grid>
      <Grid item md={7} xs={12}>
        {configData?.customer_wallet_status === 1 &&
          customerData?.data?.wallet_balance > 0 &&
          payableAmount > customerData?.data?.wallet_balance &&
          configData?.partial_payment_status === 1 && (
            <PartialPayment
              remainingBalance={
                customerData?.data?.wallet_balance - payableAmount
              }
              handlePartialPayment={handlePartialPayment}
              usePartialPayment={state.usePartialPayment}
              walletBalance={customerData?.data?.wallet_balance}
              paymentMethod={paymentMethod}
              switchToWallet={state.switchToWallet}
              removePartialPayment={removePartialPayment}
              payableAmount={payableAmount}
            />
          )}
      </Grid>
      <Grid item md={7} xs={12}>
        {zoneData && (
          <PaymentMethod
            setPaymentMethod={setPaymentMethod}
            paymentMethod={paymentMethod}
            zoneData={zoneData}
            configData={configData}
            usePartialPayment={state.usePartialPayment}
            storeData={storeData}
          />
        )}
      </Grid>
      <Grid item md={12} xs={12}>
        <PlaceOrder
          comfirmAddress={state.confirmAddress}
          placeOrder={placeOrder}
          orderLoading={orderLoading}
          zoneData={zoneData}
        />
      </Grid>

      <CustomModal
        openModal={state.confirmAddressModal}
        handleClose={handleClose}
      >
        <Box sx={{ padding: "1rem", maxWidth: "500px", width: "100%" }}>
          <Typography fontWeight="600" textAlign="center" mb="10px">
            {t("Confirm delivery information")}
          </Typography>
          <AddressSelectionField
            theme={theme}
            address={address}
            refetch={refetch}
            t={t}
            configData={configData}
            setAddress={setAddress}
            isConfirm
          />
          <Typography mt=".6rem" fontSize="1rem" fontWeight="500">
            {t("Save address")}
          </Typography>
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
          <CustomStackFullWidth sx={{ marginTop: "16px", gap: "10px" }}>
            <CustomTextField
              type="text"
              label={t("Street Number")}
              onChange={(e) => handleStreetChange(e)}
              value={state.additionalAddress.streetNumber}
            />

            <CustomTextField
              type="text"
              label={t("House")}
              // touched={addAddressFormik.touched.house}
              // errors={addAddressFormik.errors.house}
              // fieldProps={addAddressFormik.getFieldProps("house")}
              // onChangeHandler={houseHandler}
              onChange={(e) => handleHouseChange(e)}
              value={state.additionalAddress.house}
            />

            <CustomTextField
              type="text"
              label={t("Floor")}
              // touched={addAddressFormik.touched.floor}
              // errors={addAddressFormik.errors.floor}
              // fieldProps={addAddressFormik.getFieldProps("floor")}
              // onChangeHandler={floorHandler}
              onChange={(e) => handleFloorChange(e)}
              value={state.additionalAddress.floor}
            />
            <CustomTextField
              type="text"
              label={t("Door Bell")}
              // touched={addAddressFormik.touched.floor}
              // errors={addAddressFormik.errors.floor}
              // fieldProps={addAddressFormik.getFieldProps("floor")}
              // onChangeHandler={floorHandler}
              onChange={(e) => handleDoorChange(e)}
              value={state.additionalAddress.door_bell}
            />
          </CustomStackFullWidth>

          <Stack mt="1rem">
            <Button onClick={handleConfirmAddress} variant="contained">
              {t("Confirm Address")}
            </Button>
          </Stack>
        </Box>
      </CustomModal>
    </Grid>
  );
};

ItemCheckout.propTypes = {};

export default ItemCheckout;
