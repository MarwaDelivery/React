import React, { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { IconButton, Paper, styled, Typography, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../../../CustomImageContainer";
import RatingStar from "../../../RatingStar";
import PlaceIconComponent from "../../../PlaceIconComponent";
import { textWithEllipsis } from "../../../../styled-components/TextWithEllipsis";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { useAddToWishlist } from "../../../../api-manage/hooks/react-query/wish-list/useAddWishList";
import {
  addWishListStore,
  removeWishListItem,
  removeWishListStore,
} from "../../../../redux/slices/wishList";
import toast from "react-hot-toast";
import { t } from "i18next";
import { not_logged_in_message } from "../../../../utils/toasterMessages";
import { useAddStoreToWishlist } from "../../../../api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListDelete } from "../../../../api-manage/hooks/react-query/wish-list/useWishListDelete";
import { useWishListStoreDelete } from "../../../../api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDialogConfirm from "../../../custom-dialog/confirm/CustomDialogConfirm";
import Link from "next/link";
import ClosedNow from "../../../closed-now";
import { getNumberWithConvertedDecimalPoint } from "../../../../utils/CustomFunctions";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { calculateDistanceInMeters } from "../../../../utils/geoUtils";
import coords from "components/landing-page/hero-section/HeroLocationForm";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import {
  getBasicDeliveryFee
} from "../../../../utils/CustomFunctions";
import useGetDistance from "api-manage/hooks/react-query/google-api/useGetDistance";
import i18n from "language/i18n";





const CardWrapper = styled(Paper)(({ theme }) => ({
  padding: "2rem 1rem",
  height: "100%",
  boxShadow: "0px 5px 15px -3px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    boxShadow: "10px 25px 45px -3px rgba(0, 0, 0, 0.1)",
  },
}));
const ImageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "135px",
  width: "100%",

  border: "3px solid",
  borderColor: theme.palette.secondary.light,
  position: "relative",
}));
export const HeartWrapper = styled(IconButton)(({ theme, top, right }) => ({
  zIndex: 1,
  width: "30px",
  height: "30px",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
  position: "absolute",
  top: top,
  textAlign: "center",
  right: right,

  color: theme.palette.pink.main,
}));

export const isDeliveryFree = (data) => {
  console.log(data);

  if (
    (data?.free_delivery_set_by_admin === 1 && data?.free_delivery_required_amount_status === 1) || (data?.free_delivery_set_by_admin === 1 && data?.
      free_delivery_required_km_upto_status
    )
  ) {
    return true;
  } else {
    return false;
  }
};
export const getDeliveryFeeStatus = (data, distance) => {
  // Only proceed if free delivery is enabled by admin
  if (data?.free_delivery_set_by_admin !== 1) return null;

  // Convert distance to km if provided
  const distanceInKm = distance ? distance / 1000 : null;

  // Check if within free delivery distance
  const withinDistance =
    data?.free_delivery_required_km_upto_status &&
    distanceInKm !== null &&
    distanceInKm <= data?.free_delivery_required_km_upto;

  // Check if has minimum amount requirement
  const hasMinAmountRequirement = data?.free_delivery_required_amount_status === 1;

  // Priority 1: If within distance, show free delivery
  if (withinDistance) {
    return t("0 HUF delivery fee"); // Return string directly
  }

  // Priority 2: If has min amount requirement (but not within distance)
  if (hasMinAmountRequirement) {
    // Special case: If required amount is 0, treat as free
    if (data?.free_delivery_required_amount === 0) {
      return t("0 HUF delivery fee"); // Return string directly
    }
    return t("delivery_fee_with_amount", {
      amount: data?.free_delivery_required_amount,
    });
    // Return string directly
  }

  // No free delivery conditions met
  return null;
};

/*export const isCoupon = (data) => {
  console.log({data});
  
  if (
   ( data?.free_delivery_set_by_admin === 1 && data?.free_delivery_required_amount_status===1) || (data?.free_delivery_set_by_admin === 1 && data?.
    free_delivery_required_km_upto_status
    )
  ) {
    return true;
  } else {
    return false;
  }
};*/

const StoresInfoCard = (props) => {
  const { data, wishlistcard } = props;
  const [distanceToCustomer, setDistanceToCustomer] = useState(null);

  const [customerCoords, setCustomerCoords] = useState(null);
  const storeCoords = {
    lat: data?.latitude,
    lng: data?.longitude,
  };

  const {
    data: distanceData,
    refetch: refetchDistance,
    isLoading,
    isError,
  } = useGetDistance(customerCoords, storeCoords); // ✅ top-level hook usage

  const userLang = i18n.language

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentLatLng");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCustomerCoords(parsed); // ✅ triggers refetch via useEffect below
        } catch (error) {
          console.error("Failed to parse currentLatLng:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (
      customerCoords?.lat &&
      customerCoords?.lng &&
      storeCoords?.lat &&
      storeCoords?.lng
    ) {
      refetchDistance(); // ✅ triggers API call
    }
  }, [customerCoords, storeCoords.lat, storeCoords.lng, refetchDistance]);



  // Convert and display distance
  const apiDistanceInKm = useMemo(() => {
    if (distanceData?.rows?.[0]?.elements?.[0]?.distance?.value) {
      return distanceData?.rows?.[0]?.elements?.[0]?.distance?.value / 1000;
    }
    return null;
  }, [distanceData]);
  /*useEffect(() => {
     if (typeof window !== "undefined") {
       const stored = localStorage.getItem("currentLatLng");
       if (stored) {
         try {
           const { lat, lng } = JSON.parse(stored);
           const storeLat = data?.latitude;
           const storeLng = data?.longitude;
           const customerCoords = JSON.parse(stored); // { lat, lng }
           const storeCoords = {
             lat: data?.latitude,
             lng: data?.longitude
           };
           //console.log("StoreLat", storeLat);
           //console.log("StoreLng", storeLng);
           //console.log("customerlat", lat);
           //console.log("customerlng", lng);
 
           if (
             lat != null &&
             lng != null &&
             storeLat != null &&
             storeLng != null
           ) {
             const distance = calculateDistanceInMeters(
               lat,
               lng,
               storeLat,
               storeLng
             );
             setDistanceToCustomer(distance);
             //console.log("distance",distance)
           }
         } catch (error) {
           console.error("Failed to parse currentLatLng from localStorage:", error);
         }
       }
     }
   }, [data]);*/
  /* useEffect(() => {
     const customerLat = latitude;
     const customerLng = longitude;
     const storeLat = data?.latitude;
     const storeLng = data?.longitude;
     console.log("StoreLat",storeLat)
     console.log("StoreLng",storeLng)
     console.log("customerlat",customerLat)
     if (
       customerLat != null &&
       customerLng != null &&
       storeLat != null &&
       storeLng != null
     ) {
       const distance = calculateDistanceInMeters(
         customerLat,
         customerLng,
         storeLat,
         storeLng
       );
       setDistanceToCustomer(distance); // Set the calculated distance
     }
   }, [data]);
   */


  useEffect(() => {
    if (
      distanceData?.rows?.[0]?.elements?.[0]?.distance?.value != null
    ) {
      const distance = distanceData.rows[0].elements[0].distance.value;
      setDistanceToCustomer(distance);
    }
  }, [distanceData]);


  const id = data?.id ? data?.id : data?.slug;
  const { configData } = useSelector((state) => state.configData);
  const store_image_url = `${configData?.base_urls?.store_image_url}`;
  const moduleId = data?.module_id;
  let module_type = null;
  //const moduleId = JSON.parse(window.localStorage.getItem("module"))?.id;
  let deliveryStatus = null;

 if (userLang === "hu" && data.free_delivery_description_hu != null) {
  deliveryStatus = data.free_delivery_description_hu;
} else if (data.free_delivery_description != null) {
  deliveryStatus = data.free_delivery_description;
} else {
  deliveryStatus = getDeliveryFeeStatus(data, distanceToCustomer);
}

  if (moduleId == 2) {
    module_type = "grocery"
  } else if (moduleId == 3) {
    module_type = "food"
  } else if (moduleId == 7) {
    module_type = "parcel"
  } else {
    return null;
  };



  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const gray = theme.palette.neutral[400];
  const { wishLists } = useSelector((state) => state.wishList);

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();

  const addToFavorite = () => {
    if (token) {
      addFavoriteMutation(id, {
        onSuccess: (response) => {
          if (response) {
            dispatch(addWishListStore(data));
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const isInList = (id) => {
    return !!wishLists?.store?.find((wishStore) => wishStore.id === id);
  };
  const onSuccessHandlerForDelete = (res) => {
    dispatch(removeWishListStore(id));
    toast.success(res.message, {
      id: "wishlist",
    });
  };
  const { mutate } = useWishListStoreDelete();
  const deleteWishlistStore = (id) => {
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };
  const converted = distanceData?.rows?.[0]?.elements?.[0]?.distance?.value / 1000;


  const basicDeliveryFee = useMemo(() => {
    if (converted != null && data) {
      return getBasicDeliveryFee(
        data,
        configData,
        converted,
        0,
        null,
        "take_away",
        null,
        null,
        null,
        0,
        null

      );
    }
    return null;
  }, [converted, data]);


  let deliveryfees = null;

  if (basicDeliveryFee >= 0) {
    deliveryfees = getNumberWithConvertedDecimalPoint(basicDeliveryFee);
  }
  return (
    <Stack sx={{ position: "relative", height: "100%" }}>
      {/* Delivery Fee Badge */}
      {deliveryStatus && (
        <Stack
          sx={{
            position: "absolute",
            top: "4%",
            left: "0.3%",
            backgroundColor: theme.palette.primary.main,
            padding: "5px",
            zIndex: "99",
            borderRadius: "5px",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {deliveryStatus}
        </Stack>
      )}
      {data.schedule_order && (data.open === 0 || data.active == false) && (
        <Stack
          sx={{
            position: "absolute",
            top: "52%",
            left: "0.3%",
            backgroundColor: theme.palette.secondary.main,
            padding: "5px 8px",
            zIndex: "99",
            borderRadius: "5px",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {t("Schedule Order")}
        </Stack>
      )}

      {/*{deliveryStatus === "free" && (
        <Stack
          sx={{
            position: "absolute",
            top: "4%",
            backgroundColor: theme.palette.primary.main,
            padding: "5px",
            zIndex: "99",
            borderRadius: "5px",
            color: "white",
            fontSize: "12px", 
            fontWeight: "bold",
          }}
        >
          {t("0 HUF delivery fee")}

        </Stack>
      )}*/}

      {/*      /*{isCoupon(data) && (
        <Stack
          sx={{
            position: "absolute",
            top: "20%",
            backgroundColor: theme.palette.primary.main,
            padding: "5px",
            zIndex: "99",
            borderRadius: "5px",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {t("0 HUF delivery fee")}
        </Stack>
      )}*/ }

      {wishlistcard === "true" ? (
        <HeartWrapper onClick={() => setOpenModal(true)} top="4%" right="5%">
          <DeleteIcon style={{ color: theme.palette.error.light }} />
        </HeartWrapper>
      ) : (
        <>
          {!isInList(id) && (
            <HeartWrapper onClick={addToFavorite} top="4%" right="5%">
              <FavoriteBorderIcon />
            </HeartWrapper>
          )}
          {isInList(id) && (
            <HeartWrapper
              onClick={() => deleteWishlistStore(id)}
              top="4%"
              right="5%"
            >
              <FavoriteIcon />
            </HeartWrapper>
          )}
        </>
      )}
      <Link
        href={{
          pathname: "/store/[id]",
          query: {
            id: `${id}`,
            module_id: `${moduleId}`,
            distance: data?.distance,
            zone_id: data?.zone_id,
            moduleType: `${module_type}`,
          },
        }}
      >
        <Box
          sx={{
            background: theme.palette.neutral[100],
            borderRadius: "10px",
            padding: "1px",
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justifyContent="center"
            spacing={0.5}
            sx={{
              height: "100%",
            }}
          >
            <Box sx={{ position: "relative", width: "100%" }}>
              <CustomImageContainer
                src={`https://panel.marwa.hu/storage/app/public/store/cover/${data?.cover_photo}`}
                alt={data?.name}

                height="180px"
                width="100%"
                objectfit="cover"
                borderRadius={`10px`}
              />
              <ClosedNow
                active={data?.active}
                open={data?.open}
                borderRadius="2%"
              />
            </Box>
          </CustomStackFullWidth>
          <Box
            margin="10px"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Box sx={{ p: 1, width: "100%" }}>
              {/* Store Name */}
              <Typography fontWeight={600} fontSize="16px" textAlign="left">
                {data?.name}
              </Typography>

              {/* Store Address */}
              <Typography
                variant="body2"
                color={gray}
                sx={{
                  textAlign: "left",
                  mt: "2px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {data?.address}
              </Typography>

              {/* Dashed Divider */}
              <Box
                sx={{
                  borderBottom: "1px dashed",
                  borderColor: gray,
                  width: "100%",
                  my: 0.5,
                }}
              />

              {/* Delivery Fee, Time, Rating */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                {/* Fee */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <DeliveryDiningIcon sx={{ fontSize: 16, color: gray }} />
                  <Typography variant="caption" color={gray}>
                    {deliveryfees || "0"}  HUF
                  </Typography>
                </Stack>

                {/* Time */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTimeIcon sx={{ fontSize: 16, color: gray }} />
                  <Typography variant="caption" color={gray}>
                    {data?.delivery_time || "N/A"}
                  </Typography>
                </Stack>

                {/* Rating */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <RatingStar fontSize="14px" color="warning.dark" />
                  <Typography variant="caption" fontWeight="bold">
                    {data?.avg_rating?.toFixed(1) || "N/A"}
                  </Typography>
                </Stack>
              </Stack>
            </Box>


          </Box>
        </Box>
      </Link>
      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to  delete this item?")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => deleteWishlistStore(id)}
      />
    </Stack>
  );
};

StoresInfoCard.propTypes = {};

export default StoresInfoCard;
