import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import HomePageComponents from "../../src/components/home/HomePageComponents";
import Router from "next/router";
import { setConfigData } from "../../src/redux/slices/configData";
import ZoneGuard from "../../src/components/route-guard/ZoneGuard";
import MetaData from "../meta-data";

const DiscoveryPage = ({ configData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (configData) {
      if (configData.length === 0) {
        Router.push("/404");
      } else {
        dispatch(setConfigData(configData));
      }
    }
  }, [configData, dispatch]);

  let language_direction = undefined;
  if (typeof window !== "undefined") {
    language_direction = localStorage.getItem("language-setting");
  }

  return (
    <>
      <CssBaseline />
      <MetaData
        title={
          configData ? `Discovery - ${configData?.business_name}` : "Loading..."
        }
        ogImage={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
      />
      <MainLayout configData={configData}>
        <HomePageComponents isDiscovery={true} configData={configData} />
      </MainLayout>
    </>
  );
};

export default DiscoveryPage;

DiscoveryPage.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;

export const getServerSideProps = async () => {
  try {
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

    if (!configRes.ok) {
      throw new Error("Failed to fetch config data");
    }

    const config = await configRes.json();

    return {
      props: {
        configData: config,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        configData: null,
      },
    };
  }
};