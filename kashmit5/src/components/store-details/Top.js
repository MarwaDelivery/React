import React, { useReducer, useState } from "react";
import {
  Grid,
  IconButton,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CustomImageContainer from "../CustomImageContainer";
import InfoIcon from "@mui/icons-material/Info";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { Box, Stack } from "@mui/system";
import H1 from "../typographies/H1";
import RatingStar from "../RatingStar";
import { useTranslation } from "react-i18next";
import PinDropIcon from "@mui/icons-material/PinDrop";
import TimerIcon from "@mui/icons-material/Timer";
import DiscountInfo from "./DiscountInfo";
import LocationViewOnMap from "../Map/location-view/LocationViewOnMap";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { useAddStoreToWishlist } from "../../api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import {
  addWishListStore,
  removeWishListStore,
} from "../../redux/slices/wishList";
import toast from "react-hot-toast";
import { not_logged_in_message } from "../../utils/toasterMessages";
import { useWishListStoreDelete } from "../../api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { RoundedIconButton } from "../product-details/product-details-section/ProductsThumbnailsSettings";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import FreeDeliveryTag from "./FreeDeliveryTag";
import ClosedNowScheduleWise from "../closed-now/ClosedNowScheduleWise";
import Link from "next/link";
import {
  cartItemsTotalAmount,
  getNumberWithConvertedDecimalPoint,
  isFreeDelivery,
} from "../../utils/CustomFunctions";
import { t } from "i18next";
import { isDeliveryFree } from "components/home/stores-with-filter/cards-grid/StoresInfoCard";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import CustomModal from "components/modal";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MailIcon from "@mui/icons-material/Mail";
import moment from "moment";
import ClickToCall from "components/header/top-navbar/ClickToCall";

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: "50%",
  width: "100%",
  height: "100px",
  border: "2px solid",
  aspectRatio: 1 / 1,
  borderColor: theme.palette.primary.light,
  [theme.breakpoints.down("lg")]: {
    height: "100px",
    maxWidth: "110px",
  },
  [theme.breakpoints.down("md")]: {
    //height: "120px",
    maxWidth: "110px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "65px",
    maxWidth: "85px",
  },
}));
const PrimaryWrapper = styled(Box)(({ theme, borderradius }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.whiteContainer.main,
  padding: "8px",
  borderRadius: borderradius,
  cursor: "pointer",
}));

const initialState = {
  viewMap: false,
  moreView: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "setViewMap":
      return {
        ...state,
        viewMap: action.payload,
      };
    case "setMoreView":
      return {
        ...state,
        moreView: action.payload,
      };
    default:
      return state;
  }
};
const Top = (props) => {
  const { bannerCover, storeDetails, configData, logo } = props;
  const router = useRouter();
  const { distance } = router.query;
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const dispatchRedux = useDispatch();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const ACTION = {
    setViewMap: "setViewMap",
    setMoreView: "setMoreView",
  };

  const openMapHandler = () => {
    dispatch({ type: ACTION.setViewMap, payload: true });
  };
  const openMapHandlerMore = () => {
    dispatch({ type: ACTION.setMoreView, payload: true });
  };

  const handleClose = () => {
    dispatch({ type: ACTION.setMoreView, payload: false });
  };
  const { wishLists } = useSelector((state) => state.wishList);

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const addToFavorite = () => {
    if (token) {
      addFavoriteMutation(storeDetails?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatchRedux(addWishListStore(storeDetails));
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const isInWishList = (id) => {
    return !!wishLists?.store?.find(
      (wishStore) => wishStore.id === storeDetails?.id
    );
  };
  const onSuccessHandlerForDelete = (res) => {
    dispatchRedux(removeWishListStore(storeDetails?.id));
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

  const getToday = () => {
    const today = new Date();
    const dayOfWeekNumber = today.getDay();
    return storeDetails?.schedules?.filter(
      (schedule) => schedule?.day === dayOfWeekNumber
    );
  };
  const closingTimes = getToday()?.map((entry) => entry?.closing_time);
  const maxClosingTime = moment.max(
    closingTimes.map((time) => moment(time, "HH:mm:ss"))
  );
  const formattedMaxClosingTime = maxClosingTime.format("HH:mm:ss");

  const groupedSchedule = storeDetails?.schedules?.reduce((acc, curr) => {
    const { day, opening_time, closing_time } = curr;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push({ opening_time, closing_time });
    return acc;
  }, {});

  const finalSchedule = [];
  for (let i = 0; i <= 6; i++) {
    const day = i;
    if (groupedSchedule[day]) {
      const schedule = groupedSchedule[day].map(
        ({ opening_time, closing_time }) => ({
          opening_time: moment(opening_time, "HH:mm:ss").format("hh:mm A"),
          closing_time: moment(closing_time, "HH:mm:ss").format("hh:mm A"),
        })
      );
      finalSchedule.push({ day, schedule });
    } else {
      finalSchedule.push({
        day: i,
        schedule: [{ opening_time: "day off" }],
      });
    }
  }

  const getDayName = (day) => {
    switch (day) {
      case 0: {
        return "Sunday";
      }
      case 1: {
        return "Monday";
      }
      case 2: {
        return "Tuesday";
      }
      case 3: {
        return "Wednesday";
      }
      case 4: {
        return "Thursday";
      }
      case 5: {
        return "Friday";
      }
      case 6: {
        return "Saturday";
      }
      default: {
        return "";
      }
    }
  };

  const isFree = () => {
    if (
      (storeDetails?.self_delivery_system && storeDetails?.free_delivery) ||
      storeDetails?.free_delivery_set_by_admin === 1
    ) {
      return true;
    }
  };
  const { cartList } = useSelector((state) => state.cart);
  const total = cartItemsTotalAmount(cartList);

  return (
    <>
      <Grid container spacing={2} width="90%" marginLeft="5%">
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          align="center"
          sx={{ position: "relative" }}
        >
          {isDeliveryFree({
            ...storeDetails,
            distance: distance,
          }) && (
            <Stack
              sx={{
                position: "absolute",
                top: 30,
                backgroundColor: theme.palette.primary.main,
                padding: "5px",
                zIndex: "99",
                borderRadius: "5px",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                left: 30,
              }}
            >
              {t("Free Delivery")}
            </Stack>
          )}
          <CustomImageContainer
            src={bannerCover}
            width="100%"
            height={
              storeDetails?.discount ? "290px" : isSmall ? "220px" : "250px"
            }
            objectFit="contained"
            borderRadius="10px"
          />
          <Stack
            alignItems="flex-start"
            paddingRight={{
              xs: "5px",
              sm: "0px",
              position: "absolute",
              top: 20,
              right: 10,
            }}
          >
            {!isInWishList(storeDetails?.id) && (
              <RoundedIconButton onClick={addToFavorite}>
                <FavoriteBorderIcon color="primary" />
              </RoundedIconButton>
            )}
            {isInWishList(storeDetails?.id) && (
              <RoundedIconButton
                onClick={() => deleteWishlistStore(storeDetails?.id)}
              >
                <FavoriteIcon color="primary" />
              </RoundedIconButton>
            )}
          </Stack>
          {storeDetails?.free_delivery && <FreeDeliveryTag />}
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <CustomBoxFullWidth
            sx={{
              backgroundColor: "background.custom",
              p: "15px",
              minHeight: storeDetails?.discount
                ? "100%"
                : isSmall
                ? "fit-content"
                : "250px",
              borderRadius: "15px",
            }}
          >
            <CustomStackFullWidth spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={3} sm={2.5} md={3} lg={2.5} align="center">
                  <ImageWrapper>
                    <CustomImageContainer
                      src={logo}
                      width="100%"
                      height="100%"
                      objectFit="contained"
                      borderRadius="50%"
                    />
                    <ClosedNowScheduleWise
                      active={storeDetails?.active}
                      schedules={storeDetails?.schedules}
                      borderRadius="50%"
                    />
                  </ImageWrapper>
                </Grid>
                <Grid item xs={9} sm={8.5} md={9} lg={9.5}>
                  <CustomStackFullWidth spacing={2}>
                    <CustomStackFullWidth
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Stack alignItems="flex-start" flexGrow={2}>
                        <H1 text={storeDetails?.name} textAlign="flex-start" />
                        <Typography color="customColor.textGray">
                          {storeDetails?.address}
                        </Typography>
                        <Link
                          href={`/review/${
                            storeDetails?.id
                              ? storeDetails?.id
                              : storeDetails?.slug
                          }`}
                          passHref
                        >
                          <Stack
                            direction="row"
                            alignItems="flex-start"
                            spacing={0.5}
                          >
                            <RatingStar fontSize="18px" color="warning.dark" />
                            <Typography fontWeight="bold">
                              {getNumberWithConvertedDecimalPoint(
                                storeDetails?.avg_rating,
                                configData?.digit_after_decimal_point
                              )}
                            </Typography>
                            <Typography>
                              ({storeDetails?.rating_count})
                            </Typography>
                          </Stack>
                        </Link>
                      </Stack>
                      <PrimaryWrapper
                        borderradius="8px"
                        onClick={() => openMapHandler()}
                      >
                        <Stack alignItems="center" justifyContent="center">
                          <PinDropIcon />
                          <Typography
                            sx={{
                              display: {
                                xs: "none",
                                sm: "inherit",
                              },
                            }}
                          >
                            {t("Location")}
                          </Typography>
                        </Stack>
                      </PrimaryWrapper>
                    </CustomStackFullWidth>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap="16px"
                      flexWrap={"wrap"}
                    >
                      <Stack alignItems="flex-start">
                        <Typography
                          textAlign="center"
                          variant="h5"
                          color="primary.main"
                          sx={{
                            fontSize: {
                              xs: "16px",
                              sm: "18px",
                              md: "18px",
                            },
                          }}
                        >
                          {storeDetails?.delivery_time}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.3}
                        >
                          <TimerIcon />
                          <Typography
                            sx={{
                              fontSize: "13px",
                            }}
                          >
                            {t("Delivery Time")}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack alignItems="flex-start">
                        <Typography
                          variant="h5"
                          color="primary.main"
                          sx={{
                            fontSize: {
                              xs: "16px",
                              sm: "18px",
                              md: "18px",
                            },
                          }}
                        >
                          {getAmountWithSign(storeDetails?.minimum_order)}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          {t("Minimum Order Value")}
                        </Typography>
                      </Stack>

                      {isFree() ? (
                        <Stack alignItems="flex-start">
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <DeliveryDiningIcon />
                            {isFreeDelivery(storeDetails, total, distance) && (
                              <InfoIcon
                                onClick={() => {
                                  setShowInfoModal(true);
                                }}
                                sx={{
                                  color: (theme) => theme.palette.primary.main,
                                  cursor: "pointer",
                                }}
                              />
                            )}
                          </Stack>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.3}
                          >
                            <Typography
                              sx={{
                                fontSize: "13px",
                              }}
                            >
                              {t("Free Delivery")}
                            </Typography>
                          </Stack>
                        </Stack>
                      ) : // <Stack
                      //   direction="row"
                      //   alignItems="center"
                      //   spacing={0.3}
                      // >
                      //   <DeliveryDiningIcon />
                      //   <Typography>{t("Free Delivery")}</Typography>
                      // </Stack>
                      null}
                      <Stack alignItems="flex-start">
                        {/*<Typography*/}
                        {/*  textAlign="center"*/}
                        {/*  variant="h5"*/}
                        {/*  color="primary.main"*/}
                        {/*  sx={{*/}
                        {/*    fontSize: { xs: "16px", sm: "18px", md: "18px" },*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  {storeDetails?.delivery_time}*/}
                        {/*</Typography>*/}
                      </Stack>
                      <Stack
                        alignItems="flex-start"
                        sx={{ cursor: "pointer" }}
                        onClick={openMapHandlerMore}
                      >
                        <InfoIcon
                          sx={{
                            color: (theme) => theme.palette.primary.main,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "13px",
                          }}
                        >
                          {t("More Info")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CustomStackFullWidth>
                </Grid>
              </Grid>
              {storeDetails?.discount && (
                <DiscountInfo discount={storeDetails?.discount} />
              )}
            </CustomStackFullWidth>
          </CustomBoxFullWidth>
        </Grid>
      </Grid>

      {showInfoModal && (
        <CustomModal
          openModal={showInfoModal}
          handleClose={() => setShowInfoModal(false)}
        >
          <Box
            sx={{
              backgroundColor: "white",
              padding: "1rem",
            }}
          >
            <Typography fontWeight="600" align="left">
              {t("Free Delivery")}
            </Typography>
            <Typography>
              {t("Any of the following conditions will get you free delivery:")}
            </Typography>
            <Typography>
              {t(
                `-Max distance coverage area ${
                  storeDetails?.free_delivery_required_km_upto
                } km (You are away from ${(distance / 1000).toFixed(1)}km)`
              )}
            </Typography>
            <Typography>
              {t(
                `-Minimum order amount is ${getAmountWithSign(
                  storeDetails?.free_delivery_required_amount
                )}`
              )}
            </Typography>
          </Box>
        </CustomModal>
      )}

      {state.moreView && (
        <CustomModal openModal={state.moreView} handleClose={handleClose}>
          <Paper
            sx={{
              position: "relative",
              width: {
                xs: "300px",
                sm: "450px",
                md: "550px",
                lg: "600px",
              },
              p: "1.5rem",
            }}
          >
            <IconButton
              onClick={() => handleClose()}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </IconButton>

            <CustomStackFullWidth spacing={1}>
              <Typography
                textAlign="center"
                fontSize="16px"
                fontWeight="600"
                color={theme.palette.primary.main}
              >
                {storeDetails?.name}
              </Typography>
              <CustomStackFullWidth
                direction="row"
                justifyContent="center"
                spacing={2}
              >
                <ClickToCall>
                  <Stack direction="row" spacing={1}>
                    <LocalPhoneIcon
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        fontSize: "20px",
                      }}
                    />
                    <Typography>{storeDetails?.phone}</Typography>
                  </Stack>
                </ClickToCall>
                <Stack direction="row" spacing={1}>
                  <MailIcon
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      fontSize: "20px",
                    }}
                  />
                  <Typography>{storeDetails?.email}</Typography>
                </Stack>
              </CustomStackFullWidth>
              <Stack spacing={1}>
                <Typography fontSize="14px" fontWeight="500">
                  {t("Weekly schedule")}
                </Typography>
                {/*<CustomDivider />*/}
                {finalSchedule?.map((item, index) => (
                  <Stack
                    spacing={1}
                    key={index}
                    // direction="row"
                    // alignItems="center"
                  >
                    <Typography
                      fontSize={{
                        xs: "12px",
                        sm: "13px",
                        md: "14px",
                      }}
                      fontWeight="700"
                      color={theme.palette.neutral[700]}
                      // minWidth="85px"
                    >
                      {t(getDayName(item?.day))} :
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      {item?.schedule?.map((itemTime, index) => (
                        <Stack
                          padding="5px 10px"
                          borderRadius="5px"
                          border="1px solid grey"
                          key={index}
                        >
                          {itemTime?.closing_time ? (
                            <Typography
                              fontSize={{
                                xs: "12px",
                                sm: "13px",
                                md: "14px",
                              }}
                              fontWeight="400"
                              color={theme.palette.neutral[500]}
                              marginTop="5px"
                            >
                              {itemTime?.opening_time} -{" "}
                              {itemTime?.closing_time}{" "}
                              {item?.schedule.length > 1 &&
                                item?.schedule.length - 1 !== index &&
                                ","}
                            </Typography>
                          ) : (
                            <Typography
                              fontSize={{
                                xs: "12px",
                                sm: "13px",
                                md: "14px",
                              }}
                              fontWeight="400"
                              color={theme.palette.neutral[500]}
                              marginTop="5px"
                              textTransform="capitalize"
                            >
                              {itemTime?.opening_time}
                            </Typography>
                          )}
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CustomStackFullWidth>
          </Paper>
        </CustomModal>
      )}

      {state.viewMap && (
        <LocationViewOnMap
          open={state.viewMap}
          handleClose={() =>
            dispatch({ type: ACTION.setViewMap, payload: false })
          }
          latitude={storeDetails?.latitude}
          longitude={storeDetails?.longitude}
          address={storeDetails?.address}
        />
      )}
    </>
  );
};

Top.propTypes = {};

export default Top;
