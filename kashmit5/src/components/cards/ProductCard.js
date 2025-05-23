import React, { useEffect, useReducer } from "react";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import { alpha, Card, CardMedia, Typography, useTheme } from "@mui/material";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import { styled } from "@mui/material/styles";
import CustomBadge from "./CustomBadge";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import { useRouter } from "next/router";
import FoodDetailModal from "../food-details/foodDetail-modal/FoodDetailModal";
import toast from "react-hot-toast";
import {
  ACTION,
  initialState,
  reducer,
} from "../product-details/product-details-section/states";
import { setCart } from "redux/slices/cart";

import { CustomOverLay } from "./Card.style";
import QuickView from "./QuickView";
import CustomModal from "../modal";
import CartClearModal from "../product-details/product-details-section/CartClearModal";
import ProductCardIncrementDecrement from "./ProductCardIncrementDecrement";
import { getModuleId } from "helper-functions/getModuleId";
import { HeartWrapper } from "../home/stores-with-filter/cards-grid/StoresInfoCard";
import CustomDialogConfirm from "../custom-dialog/confirm/CustomDialogConfirm";
import ProductsUnavailable from "./ProductsUnavailable";
import { isAvailable } from "utils/CustomFunctions";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import ModuleModal from "./ModuleModal";

export const CardWrapper = styled(Card)(
  ({ theme, cardheight, horizontalcard, wishlistcard }) => ({
    cursor: "pointer",
    maxWidth: horizontalcard === "true" ? "100%" : "320x",

    margin: wishlistcard === "true" ? "0rem" : "1rem",
    borderRadius: "10px",
    height: cardheight ? cardheight : "220px",
    "&:hover": {
      boxShadow: "5px 0px 20px rgba(0, 54, 85, 0.15)",
    },
    [theme.breakpoints.down("sm")]: {
      height: cardheight ? cardheight : "150px",
      maxWidth: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      height: cardheight ? cardheight : "330px",
      //paddingBottom: horizontalcard === "true" && "10px",
    },
    [theme.breakpoints.up("md")]: {
      height: cardheight ? cardheight : "370px",
    },
  })
);
const CustomCardMedia = styled(CardMedia)(({ theme, horizontalcard }) => ({
  position: "relative",
  overflow: "hidden",
  padding: "0",
  borderRadius: horizontalcard === "true" ? "0x 10px" : "10px 10px 0 0",
  height: horizontalcard === "true" ? "150px" : "180px",
  width: horizontalcard === "true" && "230px",

  backgroundColor:"white",
   // horizontalcard === "true" ? theme.palette.neutral[100] : "none",

  [theme.breakpoints.down("sm")]: {
    width: "300px",
    height: "160px",
  },
}));
export const CustomCardButton = styled(CustomButtonPrimary)(
  ({ theme, disabled }) => ({
    background: disabled
      ? alpha(theme.palette.secondary.light, 0.3)
      : theme.palette.secondary.light,
  })
);

const ProductCard = (props) => {
  const {
    item,
    cardheight,
    horizontalcard,
    changed_bg,
    wishlistcard,
    deleteWishlistItem,
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);
  const [openModal, setOpenModal] = React.useState(false);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { configData } = useSelector((state) => state.configData);
  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const router = useRouter();
  const theme = useTheme();
  const reduxDispatch = useDispatch();
  const { cartList: aliasCartList } = useSelector((state) => state?.cart);
  const cartList = getCartListModuleWise(aliasCartList);
  const { t } = useTranslation();
  const p_off = t("% off");
  const off = t("Off");
  useEffect(() => {}, [state.clearCartModal]);

  const handleClearCartModalOpen = () =>
    dispatch({ type: ACTION.setClearCartModal, payload: true });
  const handleCloseForClearCart = (value) => {
    if (value === "add-item") {
      reduxDispatch(
        setCart({
          ...state.modalData[0],
          selectedOption: [],
        })
      );
      dispatch({ type: ACTION.setClearCartModal, payload: false });
    } else {
      dispatch({ type: ACTION.setClearCartModal, payload: false });
    }
  };
  const handleBadge = () => {
    if (Number.parseInt(item?.store_discount) === 0) {
      if (Number.parseInt(item?.discount) > 0) {
        if (item?.discount_type === "percent") {
          return <CustomBadge text={`-${item?.discount}${p_off}`} />;
        } else {
          return (
            <CustomBadge text={`-${getAmountWithSign(item?.discount)} ${off}`} />
          );
        }
      }
    } else {
      if (Number.parseInt(item?.store_discount) > 0) {
        return <CustomBadge text={`-${item?.store_discount}${p_off}`} />;
      }
    }
  };
  const handleClick = () => {
    if (item?.module_type === "food") {
      dispatch({ type: ACTION.setOpenModal, payload: true });
    } else {
      router.push(
        {
          pathname: "/product/[id]",
          query: {
            id: `${item?.slug ? item?.slug : item?.id}`,
            module_id: item?.module_id,
          },
        },
       
      );
    }
  };
  const handleClose = () => {
    dispatch({ type: ACTION.setOpenModal, payload: false });
  };
  console.log({item});
  

  useEffect(() => {
    if (item) {
      dispatch({
        type: ACTION.setModalData,
        payload: {
          ...item,
          quantity: 1,
          price: item?.price,
          totalPrice: item?.price,
        },
      });
    }
  }, [item]);
  const isInCart = cartList?.find((things) => things.id === item?.id);

  const addToCartHandler = () => {
    if (cartList.length > 0) {
      const isStoreExist = cartList.find(
        (item) => item?.store_id === state?.modalData[0]?.store_id
      );

      // getDiscountedAmount(
      //     state?.modalData[0]?.price,
      //     state?.modalData[0]?.discount,
      //     state?.modalData[0]?.discount_type,
      //     state?.modalData[0]?.store_discount,
      //     state?.modalData[0]?.quantity
      // )
      if (isStoreExist) {
        if (!isInCart) {
          reduxDispatch(
            setCart({
              ...state.modalData[0],
              totalPrice: state?.modalData[0]?.price,
              selectedOption: [],
            })
          );
          toast.success(t("Item added to cart"));
        }
      } else {
        if (cartList.length !== 0) {
          handleClearCartModalOpen();
        }
      }
    } else {
      if (!isInCart) {
        reduxDispatch(
          setCart({
            ...state.modalData[0],
            totalPrice: state?.modalData[0]?.price,
            selectedOption: [],
          })
        );
        toast.success(t("Item added to cart"));
      }
    }
  };

  const addToCart = (e) => {
    if (item?.module_type === "food") {
      if (item?.food_variations.length > 0) {
        dispatch({ type: ACTION.setOpenModal, payload: true });
      } else {
        e.stopPropagation();
        addToCartHandler();
      }
    } else {
      if (item?.variations.length > 0) {
        router.push(
          {
            pathname: "/product/[id]",
            query: {
              id: `${item?.slug ? item?.slug : item?.id}`,
              module_id: `${getModuleId()}`,
            },
          },
         
        );
      } else {
        e.stopPropagation();
        addToCartHandler();
      }
    }
  };

  const quickViewHandleClick = (e) => {
    e.stopPropagation();
    dispatch({ type: ACTION.setOpenModal, payload: true });
  };
  const handleDisableButton = () => {
    if (getCurrentModuleType() !== "food") {
      if (item?.stock === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        !isAvailable(item?.available_time_starts, item?.available_time_ends)
      ) {
        if (item?.schedule_order) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  };

  return (
    <Stack sx={{ position: "relative" }} >
      {state.openModal && getCurrentModuleType() === "food" ? (
        <FoodDetailModal
          product={item}
          //imageBaseUrl={imageBaseUrl}
          open={state.openModal}
          handleModalClose={handleClose}
          setOpen={(value) =>
            dispatch({ type: ACTION.setOpenModal, payload: value })
          }
        />
      ) : (
        <ModuleModal
          open={state.openModal}
          handleModalClose={handleClose}
          configData={configData}
          productDetailsData={item}
        />
      )}
      {wishlistcard === "true" && (
        <HeartWrapper onClick={() => setOpenModal(true)} top="5px" right="10px">
          <DeleteIcon style={{ color: theme.palette.error.light }} />
        </HeartWrapper>
      )}
      <CardWrapper
        cardheight={cardheight}
        horizontalcard={horizontalcard}
        wishlistcard={wishlistcard}
        onClick={() => handleClick()}
        onMouseEnter={() =>
          dispatch({ type: ACTION.setIsTransformed, payload: true })
        }
        onMouseLeave={() =>
          dispatch({ type: ACTION.setIsTransformed, payload: false })
        }
      >
        <CustomStackFullWidth
          direction={{
            xs: "row",
            sm: horizontalcard === "true" ? "row" : "column",
          }}
          justifyContent="space-between"
          height="100%"
          sx={{
            backgroundColor:"white",
             // horizontalcard === "true" &&
             // changed_bg === "true" &&
             // "primary.semiLight",
            position: "relative",
          }}
        >
          
          <CustomCardMedia horizontalcard={horizontalcard}>
            {handleBadge()}
            <CustomImageContainer
              src={`${imageBaseUrl}/${item?.image}`}
              alt={item?.title}
              height="100%"
              width="100%"
              obejctfit="cover" 
            />
            {item?.module?.module_type === "food" && (
              <ProductsUnavailable product={item} />
            )}
            <CustomOverLay hover={state.isTransformed}>
              <QuickView
                quickViewHandleClick={quickViewHandleClick}
                item={item}
                isTransformed={state.isTransformed}
              />
            </CustomOverLay>
          </CustomCardMedia>
          <CustomStackFullWidth
            justifyContent="space-between"
            height="160px !important"
            backgroundColor="white"
            /* sx={{
              background: (theme) =>
                getCurrentModuleType() === "food"
                  ? theme.palette.foodCardColor
                  : horizontalcard === "true" && changed_bg === "true"
                  ? "primary.semiLight"
                  : horizontalcard === "false" && changed_bg === "true"
                  ? theme.palette.primary.semiLight
                  : theme.palette.background.custom3,
            }} */
          >
            <Box
            backgroundColor="white"
              sx={{
                padding: {
                  xs: "10px 5px 8px 15px",
                  sm:
                    horizontalcard === "true"
                      ? "6px 8px 10px 20px"
                      : "12px 10px 10px 20px",
                },
              }}
            >
              
     
              <Typography
                variant={horizontalcard === "true" ? "subtitle2" : "h6"}
                marginBottom="4px"
                height="20px !important"
                sx={{
                  color: (theme) => theme.palette.neutral[500],
                  fontSize: { xs: "13px", sm: "inherit" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: horizontalcard === "true" ? "1" : "2",
                  WebkitBoxOrient: "vertical",
                  height: { xs: "20px", sm: "20px" },
                }}
              >
                {item?.name}
              </Typography>
              <Typography
                variant="body2"
                fontSize="10.8523px"
                marginBottom="6px"
                height="30px"
                overflow= "hidden"
                sx={{
              //    color: (theme) => theme.palette.neutral[500],
                }}
              >
                {item?.description}
              </Typography>
              <Typography
                variant="h5"
                //display="flex"
                 textAlign="right !important"
                sx={{
                  fontSize: { xs: "13px", sm: "18px" },
                  color: (theme) => theme.palette.neutral[500],
                }}
              >
                {getDiscountedAmount(
                  item?.price,
                  item?.discount,
                  item?.discount_type,
                  item?.store_discount,
                  item?.quantity
                ) === item?.price ? (
                  getAmountWithSign(
                    getDiscountedAmount(
                      item?.price,
                      item?.discount,
                      item?.discount_type,
                      item?.store_discount,
                      item?.quantity
                    )
                  )
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      marginRight="5px"
                      fontWeight="500"
                      textAlign="right !important"
                      sx={{
                        fontSize: {
                          xs: "13px",
                          sm: "16px",
                        },
                        color: (theme) => theme.palette.neutral[500],
                      }}
                    >
                      <del>{getAmountWithSign(item?.price)}</del>
                    </Typography>
                    {getAmountWithSign(
                      getDiscountedAmount(
                        item?.price,
                        item?.discount,
                        item?.discount_type,
                        item?.store_discount,
                        item?.quantity
                      )
                    )}
                  </>
                )}
              </Typography>
              
           
          
            </Box>
            <Box
            backgroundColor="white"
              sx={{
                padding: {
                  xs: "10px 5px 8px 15px",
                  sm: "12px 10px 10px 20px",
                },
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop:"-15px",
              }}
            >
              {!isInCart && (
                <CustomCardButton
                  disabled={handleDisableButton() && router.query.moduleType !== "food"}
                  onClick={(e) => addToCart(e)}
                  sx={{
                    padding: "5.5px 19px",
                    fontSize: { xs: "10px", sm: "inherit" },
                  }}
                >
                  {router.query.moduleType === "food" || getCurrentModuleType() === "food" ? (
                    t("Add to Cart")
                  ) : item && item?.stock > 0 ? (
                    t("Add to Cart")
                  ) : (
                    <Typography color={alpha(theme.palette.neutral[1000], 0.7)}>
                      {t("Out of Stock")}
                    </Typography>
                  )}
                </CustomCardButton>
              )}
              {isInCart && (
                <ProductCardIncrementDecrement
                  isInCart={isInCart}
                  modalData={state.modalData[0]}
                />
              )}
            </Box>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </CardWrapper>

      <CustomModal openModal={state.clearCartModal} handleClose={handleClose}>
        <CartClearModal
          handleClose={handleCloseForClearCart}
          dispatchRedux={reduxDispatch}
          addToCard={addToCartHandler}
        />
      </CustomModal>
      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to  delete this item?")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => deleteWishlistItem(item?.id)}
      />
    </Stack>
  );
};

ProductCard.propTypes = {};

export default ProductCard;
  