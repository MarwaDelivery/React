import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import { getSelectedAddOn } from "../../helper-functions/CardHelpers";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import VisibleVariations from "./FoodVariations";

const VariationContent = ({ cartItem }) => {
  const { t } = useTranslation();
  const handleProduct = () => {
    if (cartItem?.selectedOption?.length > 0) {
      return (
        <Stack>
          {cartItem?.choice_options.map((item, index) => {
            return (
              <Stack key={index}>
                <Typography color="customColor.textGray">
                  {item?.title} :{" "}
                  {cartItem?.selectedOption?.[0]?.type.split("-")?.[index]}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      );
    }
  };
  const handleFood = () => {
    return (
      <CustomStackFullWidth>
        <VisibleVariations variations={cartItem?.food_variations} t={t} />
        {cartItem?.selectedAddons?.length > 0 && (
          <Typography color="customColor.textGray">
            {t("Add-on")} : {getSelectedAddOn(cartItem?.selectedAddons)}
          </Typography>
        )}
      </CustomStackFullWidth>
    );
  };

  return (
    <div>
      {cartItem?.module_type === "food" ? handleFood() : handleProduct()}
    </div>
  );
};

VariationContent.propTypes = {};

export default VariationContent;
