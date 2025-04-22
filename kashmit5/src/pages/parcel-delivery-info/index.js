import React from "react";
import MainLayout from "../../src/components/layout/MainLayout";
import PercelDelivery from "../../src/components/parcel/parcel-delivery-info-component/ParcelDelivary";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
import { NoSsr } from "@mui/material";

const Index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <MetaData
        title={`Parcel Deliver information - ${configData?.business_name}`}
      />
      <MainLayout configData={configData}>
        <NoSsr>
          <PercelDelivery configData={configData} />
        </NoSsr>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async () => {
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
    },
  };
};
