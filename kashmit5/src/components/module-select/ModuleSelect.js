import React from "react";
//import { useRouter } from "next/router"; // You will need this for routing
import { Skeleton, styled, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import { setSelectedModule } from "../../redux/slices/utils";
import { useRouter } from "next/router"; // Use useRouter for redirection

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
  borderColor: selected ? theme.palette.primary.main : theme.palette.background.paper,
  background: selected &&
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
  storeDetails, // Ensure storeDetails is passed as a prop
}) => {
  const router = useRouter(); // Initialize useRouter for navigation

  const handleModuleSelect = (item) => {
    dispatch(setSelectedModule(item));
    moduleSelectHandler(item);

    // Get the restaurant name from storeDetails and format it for the URL
    const restaurantName = storeDetails?.name?.toLowerCase().replace(/ /g, "-");

    // If restaurantName is available, navigate to the dynamic URL with the selected module
    if (restaurantName) {
      router.push({
        pathname: `/store/${restaurantName}`,  // Restaurant name in URL
        query: {
          module_id: item?.id,
          distance: 845.6089092889412,  // Replace with actual distance
          zone_id: 17,  // Replace with actual zone_id
          moduleType: 'food',  // Replace with actual moduleType
        },
      });
    } else {
      console.error("Restaurant name is missing");
    }
  };

  return (
    <Container p=".8rem" spacing={0}>
      {data ? (
        zoneWiseModule?.(data)?.map((item, index) => {
          return (
            <Tooltip title={item?.module_name} key={index} placement="bottom">
              <ModuleContainer
                selected={item?.module_type === selectedModule?.module_type && item?.id === selectedModule?.id}
                onClick={() => handleModuleSelect(item)}
              >
                <CustomImageContainer
                  src={`${configData?.base_urls?.module_image_url}/${item?.icon}`}
                  width="36px"
                  height="36px"
                  alt="mobile"
                  objectFit="contained"
                />
                <ModuleTitle>{item?.module_name}</ModuleTitle>
              </ModuleContainer>
            </Tooltip>
          );
        })
      ) : (
        <>
          {[...Array(5)].map((item, index) => (
            <Skeleton key={index} width="40px" height="40px" variant="rectangle" />
          ))}
        </>
      )}
    </Container>
  );
};

// Styled component for the module title (name)
const ModuleTitle = styled("span")(({ theme }) => ({
  marginleft: "auto", 
  fontSize: "14px",  
  textAlign: "center",  
  color: theme.palette.text.primary,  
  fontWeight: "bold",
  whiteSpace: "nowrap",  
  textOverflow: "ellipsis",  
  lineHeight: "1.2",  
}));
export default ModuleSelect;
