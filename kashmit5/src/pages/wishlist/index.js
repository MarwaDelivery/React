import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
import MainLayout from "../../src/components/layout/MainLayout";
import { NoSsr } from "@mui/material";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import UserLayout from "../../src/components/layout/UserLayout";
import Profile from "../../src/components/profile";
import Wishlists from "../../src/components/wishlist";
import ZoneGuard from "../../components/route-guard/ZoneGuard";

const Index = ({ configData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <CssBaseline />
      <MetaData title={`Wishlist - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <NoSsr>
          <AuthGuard from={router.pathname.replace("/", "")}>
            <ZoneGuard>
              <Wishlists configData={configData} t={t} />
            </ZoneGuard>
          </AuthGuard>
        </NoSsr>
      </MainLayout>
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
