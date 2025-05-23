import React from "react";
import { Skeleton, styled, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import { setSelectedModule } from "../../redux/slices/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const Container = styled(Stack)(({ theme }) => ({
  zIndex: "999",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: "30px",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
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
  const { t } = useTranslation();
  // Hardcoded Discovery module with null ID for admin panel
  const discoveryModule = {
    id: null, // Changed to null for admin panel editing
    module_name: t("Discovery"),
    module_type: null,
    icon: "/discovery_icon.png",
    zones: data?.flatMap((d) => d.zones).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
    status: "1",
    isDiscovery: true,
    stores_count: 0,
  };

  // Combine API modules with Discovery module
  const hasDiscovery = data?.some((mod) => mod.module_name === t("Discovery") || mod.isDiscovery);

  const allModules = hasDiscovery
    ? [...(data || [])]
    : [discoveryModule, ...(data || [])];

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
      // ✅ Just pass the actual Discovery module object
      dispatch(setSelectedModule(item));
      moduleSelectHandler(item);
    }

    else {
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
                    ? item.icon
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