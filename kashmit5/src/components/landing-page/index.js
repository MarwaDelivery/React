import React, { useEffect, useState } from "react";
import ComponentOne from "./ComponentOne";
import Registration from "./Registration";
import ComponentTwo from "./ComponentTwo";
import ComponentThree from "./ComponentThree";
import HeroSection from "./hero-section/HeroSection";
import dynamic from "next/dynamic";
import PushNotificationLayout from "../PushNotificationLayout";
import AppDownloadSection from "./app-download-section/index";
import { useGeolocated } from "react-geolocated";
import { useRouter } from "next/router";
import MapModal from "../Map/MapModal";
const LandingPage = ({ configData, landingPageData }) => {
  const Testimonials = dynamic(() => import("./Testimonials"), {
    ssr: false,
  });
  const [location, setLocation] = useState(undefined);
  const [open, setOpen] = useState(false);
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: true,
  });
  useEffect(() => {
    setLocation(JSON.stringify(localStorage.getItem("location")));
  }, []);
  const handleClose = () => {
    const location = localStorage.getItem("location");
    const isModuleExist = localStorage.getItem("module");
    if (location) {
      isModuleExist && setOpen(false);
    } else {
      setOpen(false);
    }
  };
  const router = useRouter();
  const handleOrderNow = () => {
    if (location) {
      if (location === "null") {
        setOpen(true);
      } else {
        router.push("/home", undefined, { shallow: true });
      }
    } else {
      setOpen(true);
    }
  };
  return (
    <>
      <PushNotificationLayout>
        <HeroSection
          configData={configData}
          landingPageData={landingPageData}
          handleOrderNow={handleOrderNow}
        />
         {(configData?.toggle_dm_registration ||
          configData?.toggle_dm_registration) && (
          <Registration configData={configData} />
        )}
       
       {/*  {(configData?.toggle_dm_registration ||
          configData?.toggle_dm_registration) && (
          <ComponentThree configData={configData} />
        )} */}
          <ComponentOne
          landingPageData={landingPageData}
          configData={configData}
          handleOrderNow={handleOrderNow}
        /> 
        {landingPageData?.app_download_button?.length > 0 && (
          <AppDownloadSection
            configData={configData}
            landingPageData={landingPageData}
          />
        )}
       
        <ComponentTwo
          configData={configData}
          landingPageData={landingPageData}
        />
        {/* {(configData?.toggle_dm_registration ||
          configData?.toggle_dm_registration) && (
          <Registration configData={configData} />
        )} */}
        
        <Testimonials />
        {open && (
          <MapModal
            open={open}
            handleClose={handleClose}
            coords={coords}
            disableAutoFocus
          />
        )}
      </PushNotificationLayout>
    </>
  );
};

export default LandingPage;
