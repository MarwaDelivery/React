import React, { Suspense, useEffect, useState } from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { CustomContainer } from "../footer/Footer.style";
import ModuleSelect from "../module-select/ModuleSelect";
import HomePageComponents from "../home/HomePageComponents";
import PercelComponents from "../parcel";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedModule } from "../../redux/slices/utils";
import { useRouter } from "next/router";
import {
  Drawer,
  IconButton,
  Popover,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import useGetModule from "../../api-manage/hooks/react-query/useGetModule";
import { setModules, setResetStoredData } from "../../redux/slices/storedData";
import AssistantIcon from "@mui/icons-material/Assistant";
import Box from "@mui/material/Box";
import GroupButtons from "components/GroupButtons";
import TabForAI from "components/module-wise-layout/TabForAI";
import CloseIcon from "@mui/icons-material/Close";
import AiBot from "components/module-wise-layout/aibot";
import { getToken } from "helper-functions/getToken";
const ModuleWiseLayout = ({ configData }) => {
  const [rerender, setRerender] = useState(false);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { data, refetch } = useGetModule();
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [type, setType] = React.useState("ai");
  const [mobileModuleDrawer, setMobileModuleDrawer] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  useEffect(() => {
    if (router.pathname === "/home") {
      refetch();
    }
  }, []);
  useEffect(() => {
    handleModuleSelect();
  }, [selectedModule]);
  const handleModuleSelect = () => {
    dispatch(setResetStoredData());
    setRerender((prevState) => !prevState);
  };
  const isSmall = useMediaQuery("(max-width:1180px)");
  const moduleSelectHandler = (item) => {
    localStorage.setItem("module", JSON.stringify(item));
    if (item?.module_type === "parcel") {
      dispatch(setSelectedModule(item));
    } else {
      dispatch(setSelectedModule(item));
    }
  };

  return (
    <CustomStackFullWidth>
      {!isSmall && data && data?.length > 1 && (
        <ModuleSelect
          moduleSelectHandler={moduleSelectHandler}
          selectedModule={selectedModule}
          data={data}
          configData={configData}
          dispatch={dispatch}
        />
      )}
      {isSmall && data && data?.length > 1 && (
        <Box
          sx={{
            overflowX: "auto",
            width: "100%",
            padding: "10px 0",
            // Optional: add some padding or margin as you like
            // Scrollbar styling for WebKit browsers (Chrome, Safari, Edge)
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f0f0f0",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#1976d2", // MUI primary blue color
              borderRadius: "3px",
            },

            // Scrollbar styling for Firefox
            scrollbarWidth: "thin",
            scrollbarColor: "#1976d2 #f0f0f0",
          }}
        >
          <ModuleSelect
            moduleSelectHandler={moduleSelectHandler}
            selectedModule={selectedModule}
            data={data}
            configData={configData}
            dispatch={dispatch}
            isMobileView={true}
          />
        </Box>
      )}

      {/*{getToken() ? (*/}
      {/*  <Stack*/}
      {/*    sx={{*/}
      {/*      position: "fixed",*/}
      {/*      zIndex: "999",*/}
      {/*      bottom: "10vh",*/}
      {/*      right: "1vw",*/}
      {/*      cursor: "pointer",*/}
      {/*    }}*/}
      {/*    aria-describedby={id}*/}
      {/*    variant="contained"*/}
      {/*    onClick={handleClick}*/}
      {/*  >*/}
      {/*    <AssistantIcon*/}
      {/*      sx={{*/}
      {/*        width: "50px",*/}
      {/*        height: "50px",*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </Stack>*/}
      {/*) : null}*/}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ minWidth: "300px", padding: "1rem" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            position="relative"
          >
            <TabForAI setType={setType} type={type} />
            <IconButton
              sx={{
                padding: "5px",
                position: "absolute",
                top: -15,
                right: -16,
              }}
            >
              <CloseIcon
                style={{ cursor: "pointer", height: "16px" }}
                onClick={() => handleClose()}
              />
            </IconButton>
          </Stack>
          <AiBot type={type} />
        </Box>
      </Popover>
      {selectedModule && selectedModule?.module_type === "parcel" ? (
        <PercelComponents />
      ) : (
        <HomePageComponents
          key={rerender}
          configData={configData}
          isDiscovery={selectedModule?.isDiscovery}
          allModules={selectedModule?.isDiscovery}
        />
      )}
    </CustomStackFullWidth>
  );
};

export default React.memo(ModuleWiseLayout);
