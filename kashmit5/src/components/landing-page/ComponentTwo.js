import React from "react";
import {
  Box,
  Grid,
  Skeleton,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import bgImage from "../../../public/landingpage/com2Bg-svg.png";
import CustomImageContainer from "../CustomImageContainer";
import DownloadApps from "./DownloadApps";
import CustomContainer from "../container";

export const ComponentTwoContainer = styled(Box)(
  ({ theme, paddingTop, paddingBottom, background }) => ({
    paddingTop: paddingTop ? paddingTop : "1.5rem",
    paddingBottom: paddingBottom ? paddingBottom : "1rem",
    background: ` no-repeat center center / contain, rgba(3, 157, 85, 0.3)  `,
  })
);

const ComponentTwo = ({ configData, landingPageData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {(Number.parseInt(
        configData?.landing_page_links?.app_url_android_status
      ) === 1 ||
        Number.parseInt(configData?.landing_page_links?.app_url_ios_status) ===
          1) && (
        <ComponentTwoContainer paddingTop="3rem" paddingBottom="3rem">
          <CustomContainer>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={4}
            >
              <Grid item xs={12} sm={12} md={6} align="center">
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "260px", md: "480px" },
                    height: { xs: "240px", md: "420px" },
                  }}
                >
                  {configData ? (
                    <CustomImageContainer
                      src={`${configData?.base_urls?.react_landing_page_images}/${landingPageData?.app_section_image}`}
                      alt="mobile"
                      height="100%"
                      width="100%"
                      objectfit="contain"
                    />
                  ) : (
                    <Skeleton
                      height="100%"
                      width="100%"
                      variant="rectangular"
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <DownloadApps configData={configData} />
              </Grid>
            </Grid>
          </CustomContainer>
        </ComponentTwoContainer>
      )}
    </>
  );
};

export default ComponentTwo;
