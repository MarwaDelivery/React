import React, { useEffect, useState } from "react";
import {
  alpha,
  Button,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { PrimaryButton } from "../../Map/map.style";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import {
  addWishList,
  removeWishListItem,
} from "redux/slices/wishList";
import toast from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import moment from "moment";

const AddOrderToCart = (props) => {
  const { isInCart, product, t, addToCard, orderNow, router, isScheduled } =
    props;
  const [wishListCount, setWishListCount] = useState(
    product?.wishlist_count || 0
  );
  const theme = useTheme();
  const handleBuyNowClick = () => {
    addToCard?.("buy_now");
  };

  const { wishLists } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();
  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const isInWishList = (id) => {
    return !!wishLists?.item?.find((wishItem) => wishItem.id === id);
  };

  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const addToFavorite = (e) => {
    if (token) {
      addFavoriteMutation(product?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatch(addWishList(product));
            toast.success(response?.message);
            setWishListCount(wishListCount + 1);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };

  const onSuccessHandlerForDelete = (res) => {
    dispatch(removeWishListItem(product?.id));
    toast.success(res.message, {
      id: "wishlist",
    });
    setWishListCount(wishListCount - 1);
  };
  const { mutate } = useWishListDelete();
  const deleteWishlistItem = () => {
    mutate(product?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };
  useEffect(() => {}, [wishListCount]);
  return (
    <>
      {isScheduled ? (
        isScheduled === "true" ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <PrimaryButton
                fullWidth
                onClick={() => handleBuyNowClick()}
                sx={{
                  backgroundColor: theme.palette.customColor.buyButton,
                }}
              >
                {t("Buy Now")}
              </PrimaryButton>
            </Grid>
            <Grid item xs={8.6} sm={5} md={5}>
              {isInCart(product?.id) && (
                <PrimaryButton onClick={() => addToCard()}>
                  {t("Update to cart")}
                </PrimaryButton>
              )}
              {!isInCart(product?.id) && (
                <PrimaryButton onClick={() => addToCard()}>
                  {t("Add to Cart")}
                </PrimaryButton>
              )}
            </Grid>
            <Grid item xs={2} sm={2}>
              {!isInWishList(product?.id) && (
                <Button variant="outlined" onClick={addToFavorite}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FavoriteBorderOutlinedIcon />
                    <Typography>{wishListCount}</Typography>
                  </Stack>
                </Button>
              )}
              {isInWishList(product?.id) && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={deleteWishlistItem}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FavoriteIcon color="primary" />
                    <Typography>{wishListCount}</Typography>
                  </Stack>
                </Button>
              )}
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={8} sm={10}>
              <Stack
                spacing={0.5}
                alignItems="center"
                justifyContent="center"
                sx={{
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                  borderRadius: "8px",
                  paddingY: { xs: "5px", sm: ".5rem" },
                  paddingX: { xs: "5px", sm: ".5rem" },
                }}
              >
                <Typography variant="h6">{t("Not Available now")}</Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  flexWrap="wrap"
                  gap="5px"
                >
                  <Typography>{t("Available Will Be")}</Typography>
                  <Typography>{`${moment(product.available_time_starts, [
                    "HH:mm",
                  ]).format("hh:mm a")} - ${moment(
                    product.available_time_ends,
                    ["HH:mm"]
                  ).format("hh:mm a")}`}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={4} sm={2} justifySelf="center">
              {!isInWishList(product?.id) && (
                <Button variant="outlined" fullWidth onClick={addToFavorite}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FavoriteBorderOutlinedIcon />
                    {/*<Typography>{wishListCount}</Typography>*/}
                  </Stack>
                </Button>
              )}
              {isInWishList(product?.id) && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={deleteWishlistItem}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FavoriteIcon color="primary" />
                    {/*<Typography>{wishListCount}</Typography>*/}
                  </Stack>
                </Button>
              )}
            </Grid>
          </Grid>
        )
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <PrimaryButton
              fullWidth
              onClick={() => handleBuyNowClick()}
              sx={{
                backgroundColor: theme.palette.customColor.buyButton,
              }}
            >
              {t("Buy Now")}
            </PrimaryButton>
          </Grid>
          <Grid item xs={8.6} sm={5} md={5}>
            {isInCart(product?.id) && (
              <PrimaryButton onClick={() => addToCard()}>
                {t("Update to cart")}
              </PrimaryButton>
            )}
            {!isInCart(product?.id) && (
              <PrimaryButton onClick={() => addToCard()}>
                {t("Add to cart")}
              </PrimaryButton>
            )}
          </Grid>
          <Grid item xs={2} sm={2}>
            {!isInWishList(product?.id) && (
              <Button variant="outlined" fullWidth onClick={addToFavorite}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FavoriteBorderOutlinedIcon />
                  {/*<Typography>{wishListCount}</Typography>*/}
                </Stack>
              </Button>
            )}
            {isInWishList(product?.id) && (
              <Button variant="outlined" fullWidth onClick={deleteWishlistItem}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FavoriteIcon color="primary" />
                  {/*<Typography>{wishListCount}</Typography>*/}
                </Stack>
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};
export default AddOrderToCart;
