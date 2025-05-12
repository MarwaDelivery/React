import React, { useEffect, useRef, useState } from "react";
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
  console.log("Stores info",data)
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
  const {data, wishlistcard} = props;
  const [distanceToCustomer, setDistanceToCustomer] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentLatLng");
      if (stored) {
        try {
          const { lat, lng } = JSON.parse(stored);
          const storeLat = data?.latitude;
          const storeLng = data?.longitude;
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
  }, [data]);
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


  const id = data?.id ? data?.id : data?.slug;
  const { configData } = useSelector((state) => state.configData);
  const store_image_url = `${configData?.base_urls?.store_image_url}`;
  const moduleId = data?.module_id;
  let module_type = null;
  //const moduleId = JSON.parse(window.localStorage.getItem("module"))?.id;
  const deliveryStatus = getDeliveryFeeStatus(data, distanceToCustomer);

  if (moduleId == 2) {
    module_type = "grocery"
  }else if (moduleId == 3){
    module_type = "food"
  }else if (moduleId == 7){
    module_type = "parcel"
  } else{
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

  return (
    <Stack sx={{ position: "relative", height: "100%" }}>
      {/* Delivery Fee Badge */}
      {deliveryStatus && (
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
         {deliveryStatus}
        </Stack>
      )}
      {deliveryStatus === "free" && (
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
      )}

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
            <Typography
              textAlign="center"
              fontWeight="bold"
              sx={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }}
            >
              {data?.name}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0.5}
            >
              {/*getNumberWithConvertedDecimalPoint(data?.avg_rating, configData?.digit_after_decimal_point)*/}

              <RatingStar fontSize="16px" color="warning.dark" />
              <Typography fontWeight="bold">


                {data?.avg_rating?.toFixed(1)}
              </Typography>
            </Stack>
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="start"
            spacing={0.5}
            sx={{ mt: 1 }}
          >
            <Typography
              variant="body2"
              color={gray}
              sx={{
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }}
            >
              {data?.address}
            </Typography>
          </Stack>
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
