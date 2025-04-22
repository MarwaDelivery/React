import React from "react";
import { CustomHeader } from "../../src/api-manage/Headers";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
import MainLayout from "../../src/components/layout/MainLayout";
import { NoSsr } from "@mui/material";
import AuthGuard from "../../src/components/route-guard/AuthGuard";
import Wishlists from "../../src/components/wishlist";
import HelpAndSupport from "../../src/components/help-and-support";
import { useTranslation } from "react-i18next";

const Index = ({ configData }) => {
  const { t } = useTranslation();
  return (
    <>
      <CssBaseline />
      <MetaData title={`Help and support - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <HelpAndSupport configData={configData} t={t} />
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
      headers: CustomHeader,
    }
  );
  const config = await configRes.json();
  return {
    props: {
      configData: config,
    },
  };
};
