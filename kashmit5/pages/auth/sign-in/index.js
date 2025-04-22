import React from "react";

import MainLayout from "../../../src/components/layout/MainLayout";
import { CustomContainer } from "../../../src/components/footer/Footer.style";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../../meta-data";
import { NoSsr } from "@mui/material";
import dynamic from "next/dynamic";
import SignIn from "../../../src/components/auth/sign-in";

const index = ({ configData }) => {
  // const SignIn = dynamic(() => import("../../../src/components/auth/sign-in"), {
  //   ssr: false,
  // });
  return (
    <>
      <CssBaseline />
      <MetaData title={`Sign In - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
          <NoSsr>
              <SignIn configData={configData} />
          </NoSsr>
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
