import React from "react";
import { Skeleton, styled, Tooltip } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import { setSelectedModule } from "../../redux/slices/utils";

const Container = styled(Stack)(({ theme }) => ({
  zIndex: "999",
  alignItems: "center",
  justifyContent: "center",
  //top: 90,
  //right: 950,
  
  //boxShadow: "0px 0px 29.7006px rgba(71, 71, 71, 0.1)",
  //background: theme.palette.background.paper,
  //borderTopLeftRadius: "29px",
  //borderBottomLeftRadius: "29px",
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
  //backgroundColor: "rgba(227, 227, 227, 0.2)",
  //border: "2px solid",
  borderColor: selected
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  background:
    selected &&
    "radial-gradient(50% 50% at 50% 50%, rgba(0, 202, 108, 0) 0%, rgba(0, 255, 137, 0.2) 100%)",
  flexDirection: "row", // Ensures that icon and text are in a row
  gap: "10px",  // Adds some space between the image and the text
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
  const handleModuleSelect = (item) => {
    dispatch(setSelectedModule(item));
    moduleSelectHandler(item);
  };
  return (
    <Container p=".8rem" spacing={0}>
      {data ? (
        zoneWiseModule?.(data)?.map((item, index) => {
          return (
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
            <Skeleton
              key={index}
              width="40px"
              height="40px"
              variant="rectangle"
            />
          ))}
        </>
      )}
    </Container>
  );
};
// Styled component for the module title (name)
const ModuleTitle = styled("span")(({ theme }) => ({
  marginleft: "auto",  // Space between icon and title
  fontSize: "14px",  // Font size for the title
  textAlign: "center",  // Center the title text
  color: theme.palette.text.primary,  // Use the theme's text color
  fontWeight: "bold",
  whiteSpace: "nowrap",  // Prevent title from wrapping to the next line
  textOverflow: "ellipsis",  // Show ellipsis for overflowing text
  lineHeight: "1.2",  // Control line height for better text readability

}));
export default ModuleSelect;