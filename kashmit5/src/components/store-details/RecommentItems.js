import React, { useEffect, useRef, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
  SliderCustom,
} from "../../styled-components/CustomStyles.style";
import { Grid, Typography } from "@mui/material";
import H1 from "../typographies/H1";
import { useGetRecommendProducts } from "../../api-manage/hooks/react-query/store/useGetRecommendProducts";
import settings from "../../../pages/settings";
import ProductCard from "../cards/ProductCard";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { recommendSettings } from "./recommendSettings";
import { getItemsOrFoods } from "../../helper-functions/getItemsOrFoods";
import { t } from "i18next";
const RecommendItems = ({ store_id }) => {
  const router = useRouter();
  const [offset, setOffset] = useState(1);
  const [page_limit, setPageLimit] = useState(4);
  const foodCampaignSliderRef = useRef(null);
  const { id, module_id, zone_id } = router.query;
  const { data, refetch, isRefetching, isLoading } = useGetRecommendProducts({
    store_id,
    page_limit,
    offset,
    moduleId: module_id,
    zoneId: zone_id,
  });
  useEffect(() => {
    refetch();
  }, [store_id]);

  const Recommended = t("Recommended");

  return (
    <>
      {data?.items?.length > 0 && (
        <CustomStackFullWidth sx={{ padding: "1rem" }} width="90% !important" marginLeft="5% !important">
          <Grid conatiner>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="h6" textAlign="left">
                {`${Recommended} ${getItemsOrFoods()}`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <SliderCustom sx={{ paddingTop: "5px" }} gap="15px">
                <Slider ref={foodCampaignSliderRef} {...recommendSettings}>
                  {data?.items?.map((item) => {
                    return (
                      <div key={item?.id}>
                        <ProductCard
                          item={item}
                          horizontalcard="true"
                          cardheight="160px"
                        />
                      </div>
                    );
                  })}
                </Slider>
              </SliderCustom>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
      )}
    </>
  );
};

export default RecommendItems;
