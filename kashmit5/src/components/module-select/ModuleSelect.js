import React from "react";
import { Skeleton, styled, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import { setSelectedModule } from "../../redux/slices/utils";
import { useRouter } from "next/router"; // For redirecting to discovery

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
  return data.filter((moduleItem) => {
    const zoneIds = moduleItem?.zones?.map((zone) => zone.id);
    return currentZoneIds?.some((id) => zoneIds?.includes(id));
  });
};

const ModuleSelect = ({
  moduleSelectHandler,
  selectedModule,
  data,
  configData,
  dispatch,
}) => {
  const router = useRouter();

  // Discovery "page" tab config
  const discoveryModule = {
    id: null,
    module_name: "Discovery",
    module_type: "discovery",
    icon: "2025-01-23-67923d0aad327.png",
    isDiscovery: true
  };

  const filteredModules = zoneWiseModule(data || []);

  React.useEffect(() => {
    if (!selectedModule && filteredModules.length > 0) {
      const defaultModule = filteredModules[0];
      dispatch(setSelectedModule(defaultModule));
      moduleSelectHandler(defaultModule);
      localStorage.setItem('selectedModule', JSON.stringify(defaultModule));
    }
  }, [filteredModules.length]);

  const handleModuleSelect = (item) => {
    if (item.isDiscovery) {
      router.push("/discovery"); // Redirect to Discovery page
    } else {
      dispatch(setSelectedModule(item));
      moduleSelectHandler(item);
      localStorage.setItem('selectedModule', JSON.stringify(item));
    }
  };

  return (
    <Container p=".8rem" spacing={0}>
      {/* Discovery Page Tab 
      <Tooltip title="Discovery" placement="bottom">
        <ModuleContainer
          selected={router.pathname === "/discovery"}
          onClick={() => handleModuleSelect(discoveryModule)}
        >
          <CustomImageContainer
            src={`${configData?.base_urls?.module_image_url}/${discoveryModule?.icon}`}
            width="36px"
            height="36px"
            alt={discoveryModule?.module_name}
            objectFit="contained"
          />
          <ModuleTitle>{discoveryModule?.module_name}</ModuleTitle>
        </ModuleContainer>
      </Tooltip>*/}

      {/* API Modules */}
      {filteredModules.length > 0 ? (
        filteredModules.map((item, index) => (
          <Tooltip title={item?.module_name} key={index} placement="bottom">
            <ModuleContainer
              selected={
                item?.module_type === selectedModule?.module_type &&
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
          <Skeleton key={index} width="40px" height="40px" variant="rectangle" />
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