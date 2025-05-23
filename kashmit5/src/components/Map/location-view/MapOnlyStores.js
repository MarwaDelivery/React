import React, { useCallback, useMemo, useReducer } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Stack } from "@mui/system";
import StoreIcon from "@mui/icons-material/Store";
import { IconButton, Tooltip } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "348px",
  borderRadius: "10px",
  border: "1px solid #EAEEF2",
  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.10) inset",
};

const defaultZoom = 14;

const MapOnlyStores = ({ stores }) => {
  const center = useMemo(() => {
    if (stores.length > 0) {
      return {
        lat: parseFloat(stores[0].latitude),
        lng: parseFloat(stores[0].longitude),
      };
    }
    return { lat: 0, lng: 0 };
  }, [stores]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  });

  const options = useMemo(
    () => ({
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    }),
    []
  );

  const renderMarkers = () =>
    stores.map((store, idx) => (
      <Marker
        key={idx}
        position={{
          lat: parseFloat(store.latitude),
          lng: parseFloat(store.longitude),
        }}
        icon={{
          url: "/location-pin.png", // optional custom icon
          scaledSize: new window.google.maps.Size(30, 30),
        }}

      />
    ));

  return isLoaded ? (
    <Stack>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={defaultZoom}
        options={options}
      >
        {renderMarkers()}
      </GoogleMap>
    </Stack>
  ) : (
    <></>
  );
};

export default MapOnlyStores;
