import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../../../pages/meta-data";
import MainLayout from "../layout/MainLayout";
import StoresWithFilter from "../home/stores-with-filter";

const AllStore = ({ configData }) => {
  return (
    <>
      <CssBaseline />
      <MetaData
        title={`Store On ${configData?.business_name} `}
        //ogImage={`${configData?.base_urls?.react_landing_page_images}/${landingPageData?.banner_section_full?.banner_section_img_full}`}
      />
      <MainLayout configData={configData}>
        <StoresWithFilter />
      </MainLayout>
    </>
  );
};

export default AllStore;
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
