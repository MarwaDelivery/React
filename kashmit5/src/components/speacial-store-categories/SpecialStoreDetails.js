

import { Box, Grid } from "@mui/material";
import useGetSpecialStoreDetails from "api-manage/hooks/react-query/store/useGetSpecialStoreDetails";

import StoresInfoCard from "components/home/stores-with-filter/cards-grid/StoresInfoCard";
import H4 from "components/typographies/H4";
import { useRouter } from "next/router";
import React from "react";
import Shimmer from "../home/stores-with-filter/Shimmer";
import { CustomPaperBigCard } from "styled-components/CustomStyles.style";
const SpecialStoreDetails = () => {
    const router = useRouter();

    const { data, isFetching } = useGetSpecialStoreDetails(router.query.id);

    return (
        <CustomPaperBigCard>
            {data?.data?.map((item, index) => (
                <Box key={index}>
                    <H4 textAlign="left" text={item.name} />
                    <Box marginTop={"40px"}>
                        <Grid container spacing={2}>
                            {item?.stores?.map((item, index) => (
                                <Grid key={index} item xs={12} sm={6} md={3}>
                                    <StoresInfoCard data={item} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            ))}

            {isFetching && (
                <Box marginTop={"40px"}>
                    <Shimmer count="10" />
                </Box>
            )}
        </CustomPaperBigCard>
    );
};

export default SpecialStoreDetails;

