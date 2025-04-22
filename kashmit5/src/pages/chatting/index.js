import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
import MainLayout from "../../src/components/layout/MainLayout";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Chatting from "../../src/components/chat/Chatting";

const Index = ({ configData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <CssBaseline />
      <MetaData title={`Chat - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <AuthGuard from={router.pathname.replace("/", "")}>
          <Chatting configData={configData} />
        </AuthGuard>
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
