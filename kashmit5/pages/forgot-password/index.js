import React from "react";
import ForgotPassword from "../../src/components/auth/ForgotPassword/ForgotPassword";
import MetaData from "../meta-data";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";

const index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <MetaData title={`Forgot password - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <ForgotPassword />
      </MainLayout>
    </>
  );
};

export default index;
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
