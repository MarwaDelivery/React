import React from "react";
import { Skeleton, styled, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import { setSelectedModule } from "../../redux/slices/utils";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router"; // if using Next.js routing


const Container = styled(Stack)(({ theme }) => ({
  zIndex: "999",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: "30px",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const ModuleContainer = styled(Box)(({ theme, selected }) => ({
  zIndex: 100000,
  cursor: "pointer",
  width: "150px",
  height: "40px",
  borderRadius: "11px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center", // Change this to center the content
  borderColor: selected
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  background:
    selected &&
    "radial-gradient(50% 50% at 50% 50%, rgba(0, 202, 108, 0) 0%, rgba(0, 255, 137, 0.2) 100%)",
  flexDirection: "row",
  gap: "10px",
}));

export const zoneWiseModule = (data) => {
  let currentZoneIds = undefined;
  if (typeof window !== "undefined") {
    currentZoneIds = JSON.parse(localStorage.getItem("zoneid"));
  }
  const result = data.filter((moduleItem) => {
    const zoneIds = moduleItem?.zones?.map((zone) => zone.id);
    return currentZoneIds?.some((id) => zoneIds?.includes(id));
  });
  return result;
};

const ModuleSelect = ({
  moduleSelectHandler,
  selectedModule,
  data,
  configData,
  dispatch,
}) => {
  const router = useRouter(); // add this line
  // Hardcoded Discovery module with null ID for admin panel
  const discoveryModule = {
    id: null, // Changed to null for admin panel editing
    module_name: "Discovery",
    module_type: "discovery",
    icon: "/discovery_icon.png",
    zones: data?.[0]?.zones || [{ id: 15 }],
    status: "1",
    isDiscovery: true,
    stores_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_new: true // Add flag to indicate this is a new module
  };

  // Combine API modules with Discovery module
  const allModules = [discoveryModule, ...(data || [])];

  useEffect(() => {
    const zoneFilteredModules = zoneWiseModule(allModules);
    const discoveryModule = zoneFilteredModules?.find((mod) => mod.isDiscovery);

    if (discoveryModule) {
      dispatch(setSelectedModule(discoveryModule));
      moduleSelectHandler(discoveryModule);
    }
  }, []);



  const handleModuleSelect = (item) => {
    if (item.isDiscovery) {
      // For Discovery module, send null ID to server
      const discoveryDataForServer = {
        ...item,
        id: null, // Ensure ID is null
        combinedData: {
          markets: [],
          restaurants: []
        },
        request_type: "create" // Indicate this is a create request
      };

      dispatch(setSelectedModule(discoveryDataForServer));
      moduleSelectHandler(discoveryDataForServer);

      // Optionally: Send to server immediately
      // sendToServer(discoveryDataForServer);
    } else {
      // Normal module handling
      dispatch(setSelectedModule(item));
      moduleSelectHandler(item);
    }
  };

  return (
    <Container p=".8rem" spacing={0}>
      {allModules.length > 0 ? (
        zoneWiseModule(allModules)?.map((item, index) => (
          <Tooltip
            title={item?.module_name}
            key={index}
            placement="bottom"
          >
            <ModuleContainer
              selected={
                item?.module_type === selectedModule?.module_type &&
                item?.id === selectedModule?.id
              }
              onClick={() => handleModuleSelect(item)}
            >
              <CustomImageContainer
                src={
                  item?.isDiscovery
                    ? item.icon // static path you manually set
                    : `${configData?.base_urls?.module_image_url}/${item?.icon}`
                }
                width="36px"
                height="36px"
                alt={item?.module_name}
                objectFit="contained"
              />
              <ModuleTitle>{item?.module_name}</ModuleTitle>
            </ModuleContainer>
          </Tooltip>
        ))
      ) : (
        [...Array(5)].map((_, index) => (
          <Skeleton
            key={index}
            width="40px"
            height="40px"
            variant="rectangle"
          />
        ))
      )}
    </Container>
  );
};

const ModuleTitle = styled("span")(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.text.primary,
  fontWeight: "bold",
  whiteSpace: "nowrap",
  overflow: "visible",
  textOverflow: "clip",
  flexShrink: 0,
}));
export default ModuleSelect;