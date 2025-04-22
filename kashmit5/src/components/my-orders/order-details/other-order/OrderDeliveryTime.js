import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { NoSsr, Stack, Typography } from "@mui/material";
import Image from "next/image";
import gif from "public/static/ongoing_animation.gif";
import gif2 from "public/static/pending.gif";
import gif3 from "public/static/preparing_food.gif";
import gif4 from "public/static/preparing_grocery.gif";
const OrderDeliveryTime = ({ trackData }) => {
  const dateTimeStringToDate = (dateString) => new Date(dateString); // Conversion function

  function differenceMaxTime(deliveryTime, scheduleAt, processingTime) {
    let maxTime = calculateMaxTime(deliveryTime, processingTime);
    if (scheduleAt) {
      const schedule = dateTimeStringToDate(scheduleAt);
      const scheduleMin = (schedule - new Date()) / (1000 * 60); // Convert ms to minutes
      if (scheduleMin > 0) {
        maxTime += scheduleMin;
      }
    }
    return maxTime;
  }

  function differenceInMinute(
    deliveryTime,
    orderTime,
    scheduleAt,
    processingTime
  ) {
    const maxTime = calculateMaxTime(deliveryTime, processingTime);
    const deliveryTime0 = new Date(
      dateTimeStringToDate(scheduleAt || orderTime).getTime() + maxTime * 60000
    ); // Convert minutes to ms
    return (deliveryTime0 - new Date()) / (1000 * 60); // Convert ms to minutes
  }

  function calculateMaxTime(deliveryTime, processingTime) {
    let maxTime = 0;
    if (deliveryTime && deliveryTime.length > 0) {
      try {
        let timeList = deliveryTime.split("-");
        let min = parseInt(timeList[0]);

        timeList = timeList[1].split(" ");
        let max = parseInt(timeList[0]);

        if (timeList[1] === "hour") {
          min = min * 60;
          max = max * 60;
        } else if (timeList[1] === "day") {
          min = min * 1440;
          max = max * 1440;
        }

        if (processingTime !== null && processingTime <= max - min) {
          max = processingTime + min;
        }

        maxTime = max;
      } catch (error) {
        // handle error
      }
    }
    return maxTime;
  }

  // Example usage

  const maxTime = differenceMaxTime(
    trackData?.store.delivery_time,
    trackData?.scheduleAt,
    trackData?.processing_time
  );
  const progress =
    maxTime -
    differenceInMinute(
      trackData?.store.delivery_time,
      trackData?.created_at,
      trackData?.schedule_at,
      trackData?.processing_time
    );
  const progressPercentage = (progress / maxTime) * 100;
  const remainingTime = (maxTime - progress).toFixed(0);
  const getGif = () => {
    if (trackData?.module_type === "food") {
      return (
        <Image
          src={gif3}
          alt="status image"
          height={150}
          width={150}
          objectFit="cover"
        />
      );
    }
    if (trackData?.module_type === "grocery") {
      return (
        <Image
          src={gif4}
          alt="status image"
          height={100}
          width={100}
          objectFit="cover"
        />
      );
    }
  };

  return (
    <>
      <NoSsr>
        <Box
          sx={{
            position: "relative",
            display: "inline-flex",
            marginTop: "1rem",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={remainingTime < 0 ? 100 : progressPercentage}
            style={{
              height: "130px",
              width: "130px",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: "20%",
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "80px",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              textAlign="center"
              fontWeight="700"
            >
              {remainingTime < 0
                ? "Your order will be delivered shortly"
                : `${remainingTime} min to delivery order`}
            </Typography>
          </Box>
        </Box>

        <Stack mt="10px">
          {trackData?.order_status !== "pending" &&
          trackData?.order_status !== "confirmed" &&
          trackData?.order_status !== "processing" ? (
            <Image
              src={gif}
              alt="my gif"
              height={100}
              width={100}
              objectFit="cover"
            />
          ) : (
            getGif()
          )}
        </Stack>
      </NoSsr>
    </>
  );
};

export default OrderDeliveryTime;
