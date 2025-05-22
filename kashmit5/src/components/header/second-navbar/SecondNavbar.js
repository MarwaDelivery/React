import React, { useEffect, useRef, useState } from "react";
import {
  alpha,
  Box,
  IconButton,
  NoSsr,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import LogoSide from "../../logo/LogoSide";
import NavLinks from "./NavLinks";
import { t } from "i18next";
import CustomSignInButton from "./CustomSignInButton";

import ManageSearch from "./ManageSearch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/router";
import NavBarIcon from "./NavBarIcon";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useDispatch, useSelector } from "react-redux";
import AccountPopover from "./account-popover";
import CardView from "../../added-cart-view";
import CustomContainer from "../../container";
import { getCartListModuleWise } from "../../../helper-functions/getCartListModuleWise";
import ModuleWiseNav from "./ModuleWiseNav";
import DeliveryPlace from "components/home/DeliveryPlace";
import MobileAppInstallPopup from "components/mobile-app-popup/MobileAppInstallPopup";

const Cart = () => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const { cartList } = useSelector((state) => state?.cart);
  const handleIconClick = () => {
    setSideDrawerOpen(true);
  };

  console.log(cartList, "cartList");

  return (
    <>
      <NavBarIcon
        icon={<ShoppingCartOutlinedIcon />}
        label={t("Cart")}
        user="false"
        handleClick={handleIconClick}
        badgeCount={getCartListModuleWise(cartList)?.length}
      />
      {!!sideDrawerOpen && (
        <CardView
          sideDrawerOpen={sideDrawerOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          cartList={cartList}
        />
      )}
    </>
  );
};

const SecondNavBar = ({ configData, scrollPosition }) => {
  const theme = useTheme();
  const router = useRouter();
  const { selectedModule } = useSelector((state) => state.utilsData);
  const isSmall = useMediaQuery("(max-width:1180px)");
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [openPopover, setOpenPopover] = useState(false);
  const [moduleType, SetModuleType] = useState("");
  const { wishLists } = useSelector((state) => state.wishList);
  const [toggled, setToggled] = useState(false);

  const totalWishList = wishLists?.item?.length + wishLists?.store?.length;
  const anchorRef = useRef(null);
  let token = undefined;
  let location = undefined;
  let zoneId;

  useEffect(() => {
    SetModuleType(selectedModule?.module_type);
  }, [selectedModule]);

  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
    token = localStorage.getItem("token");
    zoneId = JSON.parse(localStorage.getItem("zoneid"));
  }

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };
  const handleWishlistClick = (pathName) => {
    router.push(`${pathName}`, undefined, { shallow: true });
  };
  return (
    <Box
      sx={{ width: "100%", backgroundColor: (scrollPosition !== 0 || toggled) && theme.palette.neutral[100] }}>
      {configData?.warning_or_request_text && (
        <Box
          sx={{
            backgroundColor: "#FFF3CD",
            color: "#856404",
            padding: "8px 0",
            overflow: "hidden",
            whiteSpace: "nowrap",
            position: "relative",
            fontWeight: "bold",
            fontSize: {
              xs: "13px",
              sm: "14px",
              md: "15px",
            },
            width: "100%",
            zIndex: 1000,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-block",
              paddingX: 2,
              minWidth: "100%", // Important to make it scroll fully
              animation: {
                xs: "marquee 12s linear infinite",
                sm: "marquee 18s linear infinite",
                md: "marquee 30s linear infinite",
              },
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {configData.warning_or_request_text}
          </Box>

          <style>
            {`
        @keyframes marquee {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}
          </style>
        </Box>
      )}

      <CustomContainer>
        <Toolbar
          disableGutters={true}
          sx={{
            backgroundColor:
              (scrollPosition !== 0 || toggled) && theme.palette.neutral[100],
            borderRadius: "0px 0px 15px 15px",
            paddingX: "0px",
            paddingY: { lg: "0px" },
            overflow: "hidden",            // 👈 ensures children respect border radius
            width: "100%",                  // 👈 prevent full width so curve is visible
            mx: "auto",                    // 👈 center it horizontally

          }}
          style={{ zIndex: 1251 }}
        >
          <NoSsr>
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              //spacing={2}
              sx={{
                paddingBottom: isSmall && "10px",
                paddingTop: isSmall && "10px",
                marginLeft: "0 !important",
              }}
            >
              <Stack direction="row" alignItems="center">
                {!isSmall && (
                  <LogoSide
                    width="110px"
                    height="50px"
                    configData={configData}
                    objectFit="contain"
                  />
                )}
                {!isSmall && location && (
                  <NavLinks t={t} zoneid="zoneid" moduleType={moduleType} />
                )}
              </Stack>

              {!isSmall && (
                <CustomStackFullWidth
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={2}
                >
                  <>
                    {router.pathname !== "/" && (
                      <ManageSearch
                        zoneid="1"
                        router="/"
                        token={token}
                        maxwidth="false"
                      />
                    )}
                  </>
                  {token && moduleType !== "parcel" && (
                    <NavBarIcon
                      icon={<ChatBubbleOutlineIcon />}
                      label={t("Chat")}
                      user="false"
                      handleClick={() => handleWishlistClick("/chatting")}
                    />
                  )}
                  {token && zoneId && moduleType !== "parcel" && (
                    <NavBarIcon
                      icon={<FavoriteBorderIcon />}
                      label={t("WishList")}
                      user="false"
                      handleClick={() => handleWishlistClick("/wishlist")}
                      badgeCount={totalWishList}
                    />
                  )}
                  {moduleType !== "parcel" && location && router.pathname !== "/" && <Cart />}
                  {token ? (
                    <IconButton
                      ref={anchorRef}
                      onClick={() => handleOpenPopover()}
                      sx={{
                        padding: "5px",
                        gap: "15px",
                      }}
                    >
                      <PersonOutlineOutlinedIcon
                        color="primary"
                        sx={{
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                        }}
                      />
                      <Typography
                        color={theme.palette.neutral[1000]}
                        textTransform="capitalize"
                      >
                        {profileInfo?.f_name}
                      </Typography>
                    </IconButton>
                  ) : (
                    <CustomSignInButton from={router.pathname.replace("/", "")} />
                  )}
                </CustomStackFullWidth>
              )}
              {isSmall && (
                <ModuleWiseNav
                  router={router}
                  configData={configData}
                  token={token}
                  setToggled={setToggled}
                />
              )}
              <AccountPopover
                anchorEl={anchorRef.current}
                onClose={() => setOpenPopover(false)}
                open={openPopover}
              />
            </CustomStackFullWidth>
          </NoSsr>
        </Toolbar>
      </CustomContainer>
      {isSmall && router.pathname === "/home" && <DeliveryPlace />}
    </Box>
  );
};

export default SecondNavBar;