import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Typography} from "@mui/material";
import {CustomStackFullWidth} from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import {CustomButton} from "./index";

const SmallerScreen = props => {
    const {configData, landingPageData, goToApp} = props
    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            paddingY="2rem"
            spacing={2}
        >
            <Grid
                item
                xs={12}
                sm={12}
                md={6}
                textAlign={{ xs: "center", md: "right" }}
            >
                <CustomImageContainer
                    src={`${configData?.base_urls?.landing_page_image_url}/${landingPageData?.download_app_section?.img}`}
                    objectfit="contain"
                    height= "auto"
                    width="100%"
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <CustomStackFullWidth spacing={3}>
                    <Typography variant="h4" color="primary.main">
                        {landingPageData?.download_app_section?.description}
                    </Typography>
                    <CustomStackFullWidth spacing={2}>
                        <CustomStackFullWidth
                            gap={2}
                            direction="row"
                            flexGrow={1}
                            flexWrap="wrap"
                            alignItems="center"
                        >
                            {landingPageData?.app_download_button?.map(
                                (item, index) => {
                                    return (
                                        <CustomButton
                                            key={index}
                                            variant="contained"
                                            onClick={() => goToApp(item?.link)}
                                        >
                                            {item?.button_text}
                                        </CustomButton>
                                    );
                                }
                            )}
                        </CustomStackFullWidth>
                    </CustomStackFullWidth>
                </CustomStackFullWidth>
            </Grid>
        </Grid>
    );
};

SmallerScreen.propTypes = {

};

export default SmallerScreen;