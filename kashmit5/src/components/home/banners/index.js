import React, { useEffect, useState } from "react";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import useGetBanners from "../../../api-manage/hooks/react-query/useGetBanners";
import { styled, useMediaQuery } from "@mui/material";
import { Box, height, margin, padding } from "@mui/system";
import CustomImageContainer from "../../CustomImageContainer";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import { getModuleId } from "../../../helper-functions/getModuleId";
import FoodDetailModal from "../../food-details/foodDetail-modal/FoodDetailModal";
import { setBanners } from "../../../redux/slices/storedData";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

/*const BannersWrapper = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "10px",
  width: "100%",
  marginLeft:"3% !important",
  height: "560px",
  [theme.breakpoints.down("md")]: {
    height: "200px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "150px",
  },
}));*/


const BannersWrapper = styled(Box)(({ theme, isSingle }) => ({
  cursor: "pointer",
  borderRadius: "10px",
  width: "98% !important", // Add !important
  marginLeft: isSingle ? "auto !important" : "2% !important",
  marginRight: isSingle ? "auto !important" : "0 !important",
  height: "600px",
  overflow: "hidden",
  [theme.breakpoints.down("lg")]: {
    height: "280px",
  },
  [theme.breakpoints.down("md")]: {
    height: "220px",
  },
  [theme.breakpoints.down("sm")]: {
    height:"160px",
  },
  [theme.breakpoints.down("xs")]: {
    height: "120px",
  },
  [theme.breakpoints.up("xl")]: {
    height: "390px",
  },
}));


const Banners = (props) => {
  const router = useRouter();
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { banners } = useSelector((state) => state.storedData);
  const { data, refetch: refetchBannerData, isFetching } = useGetBanners();
  const [bannersData, setBannersData] = useState([]);
  const [foodBanner, setFoodBanner] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { configData } = useSelector((state) => state.configData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (banners.banners.length === 0 && banners.campaigns.length === 0) {
      refetchBannerData();
    }
  }, [banners]);
  useEffect(() => {
    if (data) {
      dispatch(setBanners(data));
    }
  }, [data]);
  useEffect(() => {
    if (banners.banners.length > 0 || banners.campaigns.length > 0) {
      handleBannersData();
    }
  }, [banners]);

  const handleBannersData = () => {
    let mergedBannerData = [];
    if (banners?.banners?.length > 0) {
      banners?.banners?.forEach((item) => mergedBannerData.push(item));
    }
    if (banners?.campaigns?.length > 0) {
      banners?.campaigns?.forEach((item) =>
        mergedBannerData.push({ ...item, isCampaign: true })
      );
    }
    setBannersData(mergedBannerData);
  };
  const handleBannerClick = (banner) => {
    let moduleType = null;
    const moduleId = banner?.store?.module_id;
    if (moduleId == 2) {
      moduleType = "grocery"
    }else if (moduleId == 3){
      moduleType = "food"
    }else if (moduleId == 7){
      moduleType = "parcel"
    } else{
      return null;
    };  
    console.log('Data:', data);
    if (banner?.isCampaign) {
      router.push({
        pathname: "/campaigns/[id]",
        query: {
          id: `${banner?.id}`,
          module_id: `${banner?.store?.module_id}`,
        },
      });
    } else {
      if (banner?.type === "store_wise") {
        router.push({
          pathname: "/store/[id]",
          query: {
            id: `${banner?.store?.id}`,
            module_id: `${banner?.store?.module_id}`,
            //distance: `${banner?.store?.distance}`,
            zone_id: `${banner?.store?.zone_id}`,
            moduleType: `${moduleType}`,
          },
        });
      } else {
        if (banner?.type === "item_wise") {
          if (selectedModule?.module_type === "food") {
            setFoodBanner(banner?.item);
            setOpenModal(true);
          } else {
            router.push({
              pathname: "/product/[id]",
              query: {
                id: `${banner?.item?.slug ? banner?.item?.slug : banner?.item?.id
                  }`,
                module_id: `${banner?.store?.module_id}`,
              },
            });
          }
        }
      }
    }
  };
  const handleModalClose = () => {
    setOpenModal(false);
    //setBannerData(null);
  };

  const SliderContainer = styled(Box)(({ theme, isSingle }) => ({
    width: isSingle ? "50%" : "100%", // Container takes only needed width
    margin: isSingle ? "0 auto" : "0", // Center container for single banner
    [theme.breakpoints.down("sm")]: {
      width: isSingle ? "70%" : "100%", // Slightly wider on mobile
    },
  }));
  
  const settings = {
    dots: false,
    infinite: bannersData.length > 1,
    slidesToShow: bannersData.length >= 2 ? 2 : 1,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          infinite: bannersData.length > 1,
        },
      },
    ],
    slidesToScroll: 1,
    autoplay: bannersData.length > 1, // Only autoplay if multiple banners
    speed: 800,
    autoplaySpeed: 4000,
    cssEase: "linear",
  };
  const isSmall = useMediaQuery("(max-width:1180px)");
  

  return (
    <>
      <CustomStackFullWidth sx={{ mt: isSmall && "1.5rem" }}>
        <SliderContainer isSingle={bannersData.length === 1}>
          <Slider {...settings}>
            {bannersData.length > 0 &&
              bannersData?.map((item, index) => {
                return (
                  <BannersWrapper
                    key={index}
                    className="slider-dots"
                    onClick={() => handleBannerClick(item)}
                    isSingle={bannersData.length === 1}
                  >
                    <CustomImageContainer
                      src={`${item?.isCampaign
                        ? configData?.base_urls?.campaign_image_url
                        : configData?.base_urls?.banner_image_url
                        }/${item?.image}`}
                      alt={item?.title}
                      height="100%"
                      width="100%" // Changed to 100% for both cases
                      objectfit="cover"
                      borderRadius="10px"
                    />
                  </BannersWrapper>
                );
              })}

            {isFetching && (
              <BannersWrapper>
                <Skeleton variant="rectangle" width="100%" height="100%" />
              </BannersWrapper>
            )}
          </Slider>
          </SliderContainer>
      </CustomStackFullWidth>
      {openModal && foodBanner && (
        <FoodDetailModal
          product={foodBanner}
          image={`${configData?.base_urls?.item_image_url}/${foodBanner?.image}`}
          open={openModal}
          handleModalClose={handleModalClose}
          setOpen={setOpenModal}
        />
      )}
    </>
  );
};

Banners.propTypes = {};

export default Banners;
