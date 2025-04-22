import React, {useEffect} from "react";
import Top from "./Top";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import MiddleSection from "./middle-section";
import Prescription from "../Prescription";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import RecommendItems from "./RecommentItems";
import {getModuleId} from "helper-functions/getModuleId";
import {useRouter} from "next/router";

const StoreDetails = ({ storeDetails, configData }) => {
    const router = useRouter();
  const imageBaseUrl = configData?.base_urls?.store_cover_photo_url;
  const bannerCover = `${imageBaseUrl}/${storeDetails?.cover_photo}`;
  const ownCategories = storeDetails?.category_ids;
  const logo = `${configData?.base_urls?.store_image_url}/${storeDetails?.logo}`;


    let moduleId = undefined;
    let zoneId = undefined;
    let location = undefined;
    if (typeof window !== "undefined") {
        moduleId = getModuleId();
        zoneId = localStorage.getItem("zoneid");
        location = localStorage.getItem("location");
    }

    useEffect(() => {
        if (!moduleId) {
            localStorage.setItem("module", JSON.stringify({ id: storeDetails?.module_id, module_type: router.query.moduleType }));
        }
        if (!zoneId) {
            localStorage.setItem("zoneid", [storeDetails?.zone_id]);
        }
        if (!location) {
            localStorage.setItem("location", storeDetails?.address);
        }
    }, [moduleId, zoneId, location, storeDetails?.module_id, storeDetails?.zone_id, storeDetails?.address, router.query.moduleType]);

  return (
    <CustomStackFullWidth  sx={{ minHeight: "100vh" }} spacing={3}>
      <Top 
        bannerCover={bannerCover}
        storeDetails={storeDetails}
        configData={configData}
        logo={logo}
      />
      <RecommendItems store_id={storeDetails?.id} />
      <MiddleSection
        ownCategories={ownCategories}
        storeDetails={storeDetails}
      />
      {configData?.prescription_order_status &&
        storeDetails?.prescription_order &&
        getCurrentModuleType() === "pharmacy" && (
          <Prescription storeId={storeDetails?.id} />
        )}
    </CustomStackFullWidth>
  );
};

export default StoreDetails;
