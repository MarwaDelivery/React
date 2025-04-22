import React from "react";
import MainLayout from "../../src/components/layout/MainLayout";
import { CustomContainer } from "../../src/components/footer/Footer.style";
import OrderSuccessPage from "../../src/components/order-success-page";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
const index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <MetaData title={`Order - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <OrderSuccessPage configData={configData} />
      </MainLayout>
    </>
  );
};

index.propTypes = {};

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
