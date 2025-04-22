import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import ModuleWiseLayout from "../../src/components/module-wise-layout";
import Router from "next/router";
import { setConfigData } from "../../src/redux/slices/configData";
import ZoneGuard from "../../src/components/route-guard/ZoneGuard";
import MetaData from "../meta-data";

const Home = ({ configData }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (configData) {
      if (configData.length === 0) {
        Router.push("/404");
      } else {
        dispatch(setConfigData(configData));
      }
    } else {
    }
  }, [configData]);
  let language_direction = undefined;
  if (typeof window !== "undefined") {
    language_direction = localStorage.getItem("language-setting");
  }

  return (
    <>
      <CssBaseline />
      <MetaData
        title={
          configData ? `Home - ${configData?.business_name}` : "Loading..."
        }
        ogImage={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
      />
      <MainLayout configData={configData}>
        <ModuleWiseLayout configData={configData} />
      </MainLayout>
    </>
  );
};

export default Home;
Home.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;
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
