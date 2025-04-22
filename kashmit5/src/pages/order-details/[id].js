import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
import MainLayout from "../../src/components/layout/MainLayout";
import React from "react";
import ParcelOrder from "../../src/components/my-orders/order-details/parcel-order/ParcelOrder";
import OtherOrder from "../../src/components/my-orders/order-details/other-order";
import { useRouter } from "next/router";
import OrderDetails from "../../src/components/my-orders/order-details";

const index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <MetaData title={`Order details - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <OrderDetails configData={configData} />
      </MainLayout>
    </>
  );
};

export default index;
export const getServerSideProps = async () => {
  // const config = await ConfigApi.config()
  // const landingPageData = await landingPageApi.getLandingPageImages()
  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const config = await configRes.json();
  return {
    props: {
      configData: config,
      // landingPageData: landingPageData,
    },
  };
};
