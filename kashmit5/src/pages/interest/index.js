import React from "react";
import ZoneGuard from "../../src/components/route-guard/ZoneGuard";
import Home from "../home";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import ModuleWiseLayout from "../../src/components/module-wise-layout";
import InterestOptions from "../../src/components/interest/InterestOptions";

const Index = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <MainLayout configData={configData}>
        <InterestOptions configData={configData} />
      </MainLayout>
    </>
  );
};

export default Index;
Index.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;
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
