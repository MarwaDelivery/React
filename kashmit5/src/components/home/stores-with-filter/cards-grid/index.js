import React from "react";
import { Grid } from "@mui/material";
import StoresInfoCard from "./StoresInfoCard";
import { Box } from "@mui/system";
import Slider from "react-slick";
import { settings } from "./SliderSettings";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { LoadingButton } from "@mui/lab";
import { t } from "i18next";

const CardsGrid = ({ data, totalSize, handleMore, isFetching }) => {
  return (
    <Box>
      <Box
        sx={{
          "& .slick-track": {
            marginLeft: "0 !important",
            marginRight: "0 !important",
          },
          "& .slick-slide": {
            padding: "0 10px", // Adds the gap between the slides
          },
        }}
      >
        {data.length > 0 && (
          <Grid container spacing={2}>
            {data?.map((item, index) => {
              return (
                <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
                  <StoresInfoCard data={item} />
                </Grid>
              );
            })}
          </Grid>
        )}

        {/*  <Grid item xs={12} md={12} align="center" my="1rem">
           {totalSize > data.length && (
             <LoadingButton
              sx={{ padding: "10px 50px" }}
              variant="contained"
              onClick={handleMore}
              loading={isFetching}
            >
              {t("See more")}
            </LoadingButton> 
          )} 
        </Grid>  */}
      </Box>
    </Box>
  );
};
CardsGrid.propTypes = {};

export default CardsGrid;

