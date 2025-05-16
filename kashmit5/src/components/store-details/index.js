import React, { useEffect, useState } from "react";
import Top from "./Top";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import MiddleSection from "./middle-section";
import Prescription from "../Prescription";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import RecommendItems from "./RecommentItems";
import { getModuleId } from "helper-functions/getModuleId";
import { useRouter } from "next/router";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { calculateDistanceInMeters } from "../../utils/geoUtils";
import { isDeliveryFree } from "components/home/stores-with-filter/cards-grid/StoresInfoCard";
import { getDeliveryFeeStatus } from "components/home/stores-with-filter/cards-grid/StoresInfoCard";
import { t } from "i18next";


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


  const [showFreeDeliveryPopup, setShowFreeDeliveryPopup] = useState(false);


  const [distanceToCustomer, setDistanceToCustomer] = useState(null);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentLatLng");
      if (stored) {
        try {
          const { lat, lng } = JSON.parse(stored);
          const storeLat = storeDetails?.latitude;
          const storeLng = storeDetails?.longitude;

          if (
            lat != null &&
            lng != null &&
            storeLat != null &&
            storeLng != null
          ) {
            const distance = calculateDistanceInMeters(
              lat,
              lng,
              storeLat,
              storeLng
            );
            setDistanceToCustomer(distance);
          }
        } catch (error) {
          console.error(
            "Failed to parse currentLatLng from localStorage:",
            error
          );
        }
      }
    }
  }, [storeDetails]);


  const deliveryFeeStatusMessage = getDeliveryFeeStatus(storeDetails, distanceToCustomer);


  useEffect(() => {
    // Show popup only if message is exactly "0 HUF delivery fee"
    if (deliveryFeeStatusMessage === t("0 HUF delivery fee")) {
      setShowFreeDeliveryPopup(true);
    } else {
      setShowFreeDeliveryPopup(false);
    }
  }, [deliveryFeeStatusMessage]);


  const handleClose = () => {
    setShowFreeDeliveryPopup(false);
  };

  const applied = t("applied");



  return (
    <CustomStackFullWidth sx={{ minHeight: "100vh" }} spacing={3}>
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
      {/* Snackbar popup */}
      <Snackbar
        open={showFreeDeliveryPopup}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{
          width: "100%",          // set width
          fontSize: "16px",        // control font size
          p: 2,                    // padding (theme spacing)
          borderRadius: "12px",    // rounded corners
          textAlign: "center",     // optional: center the text
        }}>
          <strong>{deliveryFeeStatusMessage}</strong> {applied}🎉!
        </Alert>
      </Snackbar>
    </CustomStackFullWidth>
  );
};

export default StoreDetails;
