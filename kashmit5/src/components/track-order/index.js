import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import useGetTrackOrderData from "../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import {
  Divider,
  Grid,
  Skeleton,
  Step,
  StepLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { HeadingBox } from "../my-orders/myorders.style";
import CustomFormatedDateTime from "../date/CustomFormatedDateTime";
import CustomFormatedTime from "../date/CustomFormatedTime";
import { useTranslation } from "react-i18next";
import DeliverymanInfo from "./DeliverymanInfo";
import DeliverymanShimmer from "./DeliverymanShimmer";
import MapComponent from "../Map/location-view/MapComponent";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { CustomStepperStyled, StepBox } from "./trackOrder.style";
import { useTheme } from "@emotion/react";
import OrderDeliveryTime from "components/my-orders/order-details/other-order/OrderDeliveryTime";
import Pusher from "pusher-js";

const TrackOrder = ({ configData }) => {
  const router = useRouter();
  const { id } = router.query;
  const [directions, setDirections] = useState(null);
  const { t } = useTranslation();
  const [actStep, setActStep] = useState(1);
  const intervalRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [dmanLat, setDmanLat] = useState(null);
  const [dmanLng, setDmanLng] = useState(null);
  const { refetch: refetchTrackOrder, data: trackOrderData } =
    useGetTrackOrderData(id);

  useEffect(() => {
    if (id) {
      refetchTrackOrder();
    }
  }, [id]);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const steps = [
    {
      label: "Order placed",
      time: trackOrderData?.pending,
    },
    {
      label: "Order Confirmed",
      time: trackOrderData?.confirmed,
    },
    {
      label: "Preparing Food",
      time: trackOrderData?.processing,
    },
    {
      label: "Food is on the way",
      time: trackOrderData?.picked_up,
    },
    {
      label: "Delivered",
      time: trackOrderData?.delivered,
    },
  ];
  useEffect(() => {
    if (trackOrderData?.order_status === "panding") {
      setActStep(1);
    } else if (trackOrderData?.order_status === "confirmed") {
      setActStep(2);
    } else if (
      trackOrderData?.order_status === "processing" ||
      trackOrderData?.order_status === "handover"
    ) {
      setActStep(3);
    } else if (trackOrderData?.order_status === "picked_up") {
      setActStep(4);
    } else if (trackOrderData?.order_status === "delivered") {
      setActStep(5);
    }
  }, [actStep, trackOrderData]);

  const generateAuthString = async (channelName, socketId, appSecret) => {
    const stringToSign = `${socketId}:${channelName}`;
    const signature = await generateSignature(stringToSign, appSecret);
    return signature;
  };

  // Helper function to generate HMAC-SHA256 signature
  const generateSignature = async (stringToSign, appSecret) => {
    if (typeof window !== "undefined" && window.crypto?.subtle) {
      // Browser with Web Crypto API support
      const encoder = new TextEncoder();
      const key = encoder.encode(appSecret);
      const data = encoder.encode(stringToSign);

      const importedKey = await window.crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBuffer = await window.crypto.subtle.sign(
        "HMAC",
        importedKey,
        data
      );
      const signatureArray = new Uint8Array(signatureBuffer);
      return Array.from(signatureArray)
        .map((b) => ("00" + b.toString(16)).slice(-2))
        .join("");
    } else {
      // Node.js or unsupported environment fallback
      const crypto = require("crypto");
      const hmac = crypto.createHmac("sha256", appSecret);
      hmac.update(stringToSign);
      return hmac.digest("hex");
    }
  };
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      encrypted: true,
      authorizer: (channel, options) => {
        return {
          authorize: async (socketId, callback) => {
            try {
              const fakeSignature = await generateAuthString(
                channel.name,
                socketId,
                process.env.NEXT_PUBLIC_PUSHER_SECRET
              );
              const authString = `${process.env.NEXT_PUBLIC_PUSHER_KEY}:${fakeSignature}`;
              callback(false, { auth: authString });
            } catch (error) {
              console.error("Error generating signature:", error);
              callback(true, { error: "Signature generation failed" });
            }
          },
        };
      },
    });
    const privateChannel = pusher.subscribe("private-deliveryman");
    // Listen for successful subscription
    privateChannel.bind("client-deliveryman", function (data) {
      if (
        trackOrderData &&
        trackOrderData?.delivery_man?.id === data?.locationInfo?.id
      ) {
        setMessages(data);
      }
    });
    // Cleanup on component unmount
    return () => {
      pusher.unsubscribe("private-deliveryman");
    };
  }, [trackOrderData]);

  useEffect(() => {
    // Ensure `messages` has `locationInfo` or fallback to `trackOrderData`
    if (messages?.locationInfo) {
      setDmanLat(messages.locationInfo.lat);
      setDmanLng(messages.locationInfo.lng);
    } else if (trackOrderData?.delivery_man) {
      setDmanLat(trackOrderData.delivery_man.lat);
      setDmanLng(trackOrderData.delivery_man.lng);
    }
  }, [messages, trackOrderData]);

  return (
    <CustomPaperBigCard>
      <Grid container item md={12} xs={12}>
        <Grid item md={12} xs={12} align="center">
          {trackOrderData ? (
            <HeadingBox>
              <CustomStackFullWidth justifyContent="center" alignItems="center">
                <Typography
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    fontSize: "36px",
                    fontWeight: "600",
                  }}
                >
                  #{trackOrderData?.id}
                </Typography>
                <CustomStackFullWidth
                  alignItems="center"
                  justifyContent="center"
                  direction="row"
                  spacing={0.5}
                >
                  <Typography>{t("Order placed at")}</Typography>
                  <Typography>
                    <CustomFormatedDateTime date={trackOrderData?.created_at} />
                  </Typography>
                </CustomStackFullWidth>
                <OrderDeliveryTime trackData={trackOrderData} />
              </CustomStackFullWidth>
            </HeadingBox>
          ) : (
            <CustomStackFullWidth alignItems="center">
              <Skeleton variant="text" width="20%" height="20px" />
              <Skeleton variant="text" width="20%" height="20px" />
            </CustomStackFullWidth>
          )}

          <Divider />
        </Grid>
        <Grid item md={12} xs={12}>
          <SimpleBar style={{ height: isSmall ? "250px" : "190px" }}>
            <StepBox>
              <CustomStepperStyled activeStep={actStep} alternativeLabel>
                {steps.map((labels, index) => (
                  <Step key={labels}>
                    <StepLabel>
                      <Typography>{t(labels.label)}</Typography>
                      {trackOrderData ? (
                        <Typography>
                          {labels.time !== null ? (
                            <CustomFormatedTime date={labels.time} />
                          ) : (
                            ""
                          )}
                        </Typography>
                      ) : (
                        <Skeleton variant="text" />
                      )}
                    </StepLabel>
                  </Step>
                ))}
              </CustomStepperStyled>
            </StepBox>
          </SimpleBar>
        </Grid>
        <Grid item md={12} xs={12}>
          <MapComponent
            latitude={trackOrderData?.delivery_address?.latitude}
            longitude={trackOrderData?.delivery_address?.longitude}
            deliveryManLat={
              trackOrderData?.delivery_man !== null
                ? dmanLat
                : trackOrderData?.store?.latitude
            }
            isStore={trackOrderData?.delivery_man === null}
            pusher
            deliveryManLng={
              trackOrderData?.delivery_man !== null
                ? dmanLng
                : trackOrderData?.store?.longitude
            }
            setDirections={setDirections}
          />
        </Grid>
        <Grid item md={12} xs={12} align="center" pt="2rem">
          {trackOrderData ? (
            trackOrderData?.delivery_man ? (
              <DeliverymanInfo
                data={trackOrderData}
                configData={configData}
                t={t}
                directions={directions}
              />
            ) : (
              <Typography>{t("Delivery man has not been assigned")}</Typography>
            )
          ) : (
            <DeliverymanShimmer />
          )}
        </Grid>
      </Grid>
    </CustomPaperBigCard>
  );
};

TrackOrder.propTypes = {};

export default TrackOrder;
