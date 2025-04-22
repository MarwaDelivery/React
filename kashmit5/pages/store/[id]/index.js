import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../../src/components/layout/MainLayout";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setConfigData } from "../../../src/redux/slices/configData";
import StoreDetails from "../../../src/components/store-details";
import {
  config_api,
  store_details_api,
} from "../../../src/api-manage/ApiRoutes";
import MetaData from "../../meta-data";

const Index = ({ initialConfigData, initialStoreDetails }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id: storeId, module_id: moduleId } = router.query;
  const metaTitle = `${initialStoreDetails?.name} - ${initialConfigData?.business_name}`;
  const [isSSR, setIsSSR] = useState(true);
  const [configData, setConfigDataState] = useState(initialConfigData);

  useEffect(() => {
    setIsSSR(false);
  }, []);
  useEffect(() => {
    dispatch(setConfigData(configData));
  }, [configData]);

  return (
    <>
      {!isSSR && (
        <>
          <CssBaseline />
          <MetaData
            title={metaTitle}
            businessName={initialConfigData?.business_name}
            ogImage={initialStoreDetails?.cover_photo}
            description={initialStoreDetails?.description}
            configData={initialConfigData}
            b
          />
          <MainLayout configData={configData}>
            <StoreDetails
              storeDetails={initialStoreDetails}
              configData={configData}
            />
          </MainLayout>
        </>
      )}
    </>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  const storeId = context.query.id;
  const moduleId = context.query.module_id;

  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${config_api}`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const storeDetailsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${store_details_api}/${storeId}`,
    {
      method: "GET",
      headers: {
        moduleId: moduleId,
        "X-software-id": 33571750,
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL,
      },
    }
  );
  const config = await configRes.json();
  const storeDetails = await storeDetailsRes.json();
  return {
    props: {
      initialConfigData: config,
      initialStoreDetails: storeDetails,
    },
  };
};
