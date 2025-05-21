import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomLanguage from "components/header/top-navbar/CustomLanguage";

const FooterBottom = (props) => {
  const { configData } = props;
  return (
<CustomStackFullWidth
  py="1rem"
  sx={{ backgroundColor: (theme) => theme.palette.footer.bottom }}
>
  <Box
    display="flex"
    width="100%"
    justifyContent="center"
    alignItems="center"
    position="relative"
  >
    <Box position="absolute" left={16} top="50%" sx={{ transform: "translateY(-50%)" }}>
      <CustomLanguage formmobilemenu={false} />
    </Box>
    <Typography color="whiteContainer.main">
      {configData?.footer_text}
    </Typography>
  </Box>
</CustomStackFullWidth>

  );
};

export default FooterBottom;
