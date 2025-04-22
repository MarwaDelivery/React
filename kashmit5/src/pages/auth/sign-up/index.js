import React from "react";
import SignIn from "../../../src/components/auth/sign-in";
import MainLayout from "../../../src/components/layout/MainLayout";
import { CustomContainer } from "../../../src/components/footer/Footer.style";

import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../../meta-data";
import dynamic from "next/dynamic";

const index = ({ configData }) => {
  const SignUp = dynamic(
    () => import("../../../src/components/auth/sign-up/SignUp"),
    {
      ssr: false,
    }
  );
  return (
    <>
      <CssBaseline />
      <MetaData title={`Sign Up - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <SignUp />
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
