import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import ModuleWiseLayout from "../../src/components/module-wise-layout";
import MyOrders from "../../src/components/my-orders";
import MetaData from "../meta-data";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import { useRouter } from "next/router";
import ReviewPage from "../../src/components/review";

const Index = ({ configData }) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <MetaData title={`Review - ${configData?.business_name}`} />
      <CssBaseline />
      <AuthGuard from={router.pathname.replace("/", "")}>
        <MainLayout configData={configData}>
          <ReviewPage id={id} />
        </MainLayout>
      </AuthGuard>
    </>
  );
};

export default Index;
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
