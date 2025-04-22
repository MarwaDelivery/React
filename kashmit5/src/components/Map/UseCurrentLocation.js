import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { t } from "i18next";
import AllowLocationDialog from "./AllowLocationDialog";
const UseCurrentLocation = ({
  isLoadingCurrentLocation,
  setLoadingCurrentLocation,
  setLocationEnabled,
  setLocation,
  zoneId,
  refetchCurrentLocation,
  setRerenderMap,
  isGeolocationEnabled,
  coords,
}) => {
  const [openLocation, setOpenLocation] = useState(false);
  const handleCloseLocation = () => {
    setOpenLocation(false);
  };
  return (
    <>
      <LoadingButton
        sx={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: "5px",
          color: (theme) => theme.palette.whiteContainer.main,
        }}
        // aria-label="pickcurrentlocation"
        // variant="contained"
        onClick={async (e) => {
          e.preventDefault();
          if (coords) {
            setLoadingCurrentLocation(true);
            setLocationEnabled(true);
            setLocation({
              lat: coords?.latitude,
              lng: coords?.longitude,
            });
            setLoadingCurrentLocation(false);
            if (zoneId) {
              localStorage.setItem("zoneid", zoneId);
              // router.push('/home')
              // handleClose()
            }
            await refetchCurrentLocation();
            setRerenderMap((prevState) => !prevState);
          } else {
            setOpenLocation(true);
          }
        }}
        startIcon={<GpsFixedIcon />}
        //endIcon={<GpsFixedIcon />}
        loadingPosition="end"
        variant="contained"
        loading={isLoadingCurrentLocation}
      >
        {t("Use Current Location")}
      </LoadingButton>
      {openLocation && (
        <AllowLocationDialog
          handleCloseLocation={handleCloseLocation}
          openLocation={openLocation}
          isGeolocationEnabled={isGeolocationEnabled}
        />
      )}
    </>
  );
};

export default UseCurrentLocation;
