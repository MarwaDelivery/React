import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
import MainLayout from "../../src/components/layout/MainLayout";
import dynamic from "next/dynamic";
const index = ({ configData }) => {
  const TrackOrder = dynamic(() => import("../../src/components/track-order"), {
    ssr: false,
  });
  return (
    <>
      <CssBaseline />
      <MetaData title={`Track your order - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <TrackOrder configData={configData} />
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
