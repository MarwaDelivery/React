import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import H4 from "../../typographies/H4";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Button } from "@mui/material";
import { HomeComponentsWrapper } from "../HomePageComponents";
import CardsGrid from "../stores-with-filter/cards-grid";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import CardsCarousel from "../stores-with-filter/CardsCarousel";

const CategoryStorePopular = ({ isFetching, isSuccess, item }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <HomeComponentsWrapper>
      {item?.stores && item?.stores.length > 0 && (
        <>
          <CustomStackFullWidth
            direction={"row"}
            justifyContent={"space-between"}
          >
            <H4 text={item.name} />
            <Button
              variant="text"
              onClick={() => {
                router.push({
                  pathname: "/store/store-categories",
                  query: {
                    id: item?.id,
                  }, // Example query params
                });
              }}
            >
              {t("View all")}
            </Button>

            {/*<Button
              variant="text"
              onClick={() => {
                router.push(`/home/${item.module_type}`);
              }}
            >
              {t("View all")}
            </Button>*/}

          </CustomStackFullWidth>

          <CardsCarousel data={item?.stores} />

        </>
      )}
      {/* {isFetching && (
				<Grid container>
					<ProductCardShimmer />
				</Grid>
			)} */}
    </HomeComponentsWrapper>
  );
};

export default CategoryStorePopular;
