import { Box, Paper, styled } from "@mui/material";
import footerBg from "./footerBg.svg";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
export const StyledFooterBackground = styled(Box)(
  ({ theme, nobottommargin }) => ({
    //minHeight: '500px',
    marginTop: ".8rem",
    width: "100%",
    background: `url(${footerBg.src}) no-repeat center center / cover `,
    borderRadius: "20px 20px 0px 0px",
    [theme.breakpoints.down("md")]: {
      marginBottom: nobottommargin === "true" ? "none" : "70px",
    },
  })
);

// export const CustomContainer = styled(CustomStackFullWidth)(({ theme }) => ({
//   paddingLeft: "1.3rem",
//   paddingRight: "1.3rem",
//   [theme.breakpoints.up("lg")]: {
//     paddingLeft: "8%",
//     paddingRight: "8%",
//   },
//   [theme.breakpoints.up("xl")]: {
//     paddingLeft: "15%",
//     paddingRight: "15%",
//   },
// }));
export const StyledFooterTop = styled(CustomStackFullWidth)(({ theme }) => ({
  marginTop: "1rem",
  padding: "1rem",
  backgroundColor: "rgba(0, 98, 52, 0.4)",
  borderRadius: "30px",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginTop: "50px",
    padding: "2.813rem",
  },
}));
