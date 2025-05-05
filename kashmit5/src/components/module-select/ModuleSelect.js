import React from "react";
import { Skeleton, styled, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import { setSelectedModule } from "../../redux/slices/utils";

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
  justifyContent: "center",
  borderColor: selected
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  background:
    selected &&
    "radial-gradient(50% 50% at 50% 50%, rgba(0, 202, 108, 0) 0%, rgba(0, 255, 137, 0.2) 100%)",
  flexDirection: "row",
  gap: "10px",
  justifyContent: "flex-start"
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
  /*
  // Hardcoded Discovery module with null ID for admin panel
  const discoveryModule = {
    id: 1, // Changed to null for admin panel editing
    module_name: "Discovery",
    module_type: "discovery",
    icon: "2025-01-23-67923d0aad327.png",
    zones: data?.[0]?.zones || [{ id: 15 }],
    status: "1",
    isDiscovery: true,
    stores_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_new: true // Add flag to indicate this is a new module
  };

  // Combine API modules with Discovery module
  const allModules = [ discoveryModule, ...(data || [])];

  React.useEffect(() => {
    if (allModules.length > 0 && !selectedModule) {
      // Set Discovery as default if available
      const defaultModule = allModules.find(module => module.isDiscovery) || allModules[0];
      handleModuleSelect(defaultModule);
    }
  }, [allModules.length]); // Only run when modules load
  */

  const handleModuleSelect = (item) => {
    const moduleToStore = {
      ...item,
      id: item.isDiscovery ? null : item.id
    };
    
    dispatch(setSelectedModule(moduleToStore));
    moduleSelectHandler(moduleToStore);
    localStorage.setItem('selectedModule', JSON.stringify(moduleToStore));
  };


  //change (data) to (allmodules)
  return (
    <Container p=".8rem" spacing={0}>
      {data.length > 0 ? (
        zoneWiseModule(data)?.map((item, index) => (
          <Tooltip
            title={item?.module_name}
            key={index}
            placement="bottom"
          >
            <ModuleContainer
              selected={
                item?.isDiscovery 
                ? selectedModule?.isDiscovery
                : item?.module_type === selectedModule?.module_type &&
                  item?.id === selectedModule?.id            
              }
              onClick={() => handleModuleSelect(item)}
            >
              <CustomImageContainer
                src={`${configData?.base_urls?.module_image_url}/${item?.icon}`}
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
  overflow: "visible", // Changed from hidden
  textOverflow: "clip", // Changed from ellipsis
  flexShrink: 0, // Prevent text from shrinking
}));

export default ModuleSelect;