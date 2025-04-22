import React from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import ProductInformation from "./ProductInformation";
import ProductImageView from "./ProductImageView";
import CustomImageContainer from "../../CustomImageContainer";
import { useTranslation } from "react-i18next";
import { OfferTypography } from "../../food-details/food-card/FoodCard.style";
import { getAmountWithSign } from "../../../helper-functions/CardHelpers";

export const handleDiscountChip = (product, t) => {
  if (product?.store_discount > 0) {
    if (product?.store_discount > 0) {
      return (
        <OfferTypography>
          {product?.store_discount}% {t("OFF")}
        </OfferTypography>
      );
    } else {
      return (
        <OfferTypography>
          {getAmountWithSign(product?.store_discount)}
        </OfferTypography>
      );
    }
  } else {
    if (product?.discount !== 0) {
      if (product?.discount_type === "percent") {
        return (
          <OfferTypography>
            {product?.discount}% {t("OFF")}
          </OfferTypography>
        );
      } else {
        return (
          <OfferTypography>
            {getAmountWithSign(product?.discount)} {t("OFF")}
          </OfferTypography>
        );
      }
    }
  }
};
const ProductDetailsSection = ({
  productDetailsData,
  configData,
  handleModalClose,
  productUpdate,
  modalmanage,
}) => {
  const { t } = useTranslation();
  const productImage = productDetailsData?.image;
  const productThumbImage = productDetailsData?.images;
  const imageBaseUrl = productDetailsData?.isCampaignItem
    ? configData?.base_urls?.campaign_image_url
    : configData?.base_urls?.item_image_url;
  const imageSrcUrl = `${imageBaseUrl}/${productImage}`;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleModal = () => {
    if (modalmanage) {
      return (
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12}>
            <ProductInformation
              productDetailsData={productDetailsData}
              configData={configData}
              productUpdate={productUpdate}
              handleModalClose={handleModalClose}
              modalmanage={modalmanage}
              imageSrcUrl={imageSrcUrl}
              isSmall={isSmall}
            />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} sm={5} md={5} textAlign="center">
            {handleDiscountChip(productDetailsData, t)}
            {productDetailsData?.module_type !== "food" && productUpdate ? (
              <CustomImageContainer
                width={isSmall ? "200px" : "100%"}
                height={isSmall ? "200px" : "250px"}
                src={imageSrcUrl}
                objectfit="contained"
              />
            ) : (
              <ProductImageView
                productImage={imageSrcUrl}
                productThumbImage={productThumbImage}
                imageBaseUrl={imageBaseUrl}
                configData={configData}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={7} md={7}>
            {productDetailsData?.module_type !== "food" && (
              <ProductInformation
                productDetailsData={productDetailsData}
                configData={configData}
                productUpdate={productUpdate}
                handleModalClose={handleModalClose}
              />
            )}
          </Grid>
        </Grid>
      );
    }
  };

  return <CustomStackFullWidth>{handleModal()}</CustomStackFullWidth>;
};

export default ProductDetailsSection;
