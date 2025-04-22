import { alpha, Paper, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomButtonPrimary } from "../../../styled-components/CustomButtons.style";
import Box from "@mui/material/Box";

export const CustomSearchField = styled(Paper)(({ theme }) => ({
  width: "100%",
  border: "none",
}));
export const SearchLocationTextField = styled(TextField)(
  ({ theme, language_direction, frommap, fromparcel }) => ({
    width: "100%",

    "& label.Mui-focused": {
      color: theme.palette.primary.main,
      background: theme.palette.neutral[100],
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme.palette.primary.main,
      background: theme.palette.neutral[100],
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiOutlinedInput-root": {
      paddingTop: "0px",
      paddingBottom: "0px",
      borderTopRightRadius:
        frommap === "true" ? "0px" : fromparcel === "false" ? "0px" : "8px",
      borderBottomRightRadius:
        frommap === "true" ? "0px" : fromparcel === "false" ? "0px" : "8px",
      borderTopLeftRadius: frommap === "true" && "0px",
      borderBottomLeftRadius: frommap === "true" && "0px",
      border: frommap === "true" ? "1px solid" : "2px solid",
      borderColor: theme.palette.primary.main,
      "& fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  })
);
export const StyledButton = styled(CustomButtonPrimary)(
  ({ theme, radiuschange, language_direction }) => ({
    color: theme.palette.whiteContainer.main,
    width: "500px",
    padding: "9px 7px 10.5px 7px",

    // paddingTop: "10px",
    // paddingBottom: "9px",
    marginLeft: language_direction === "rtl" && "15px",
    borderTopLeftRadius:
      (language_direction === "ltr" || !language_direction) &&
      radiuschange === "true" &&
      "0px",
    borderBottomLeftRadius:
      (language_direction === "ltr" || !language_direction) &&
      radiuschange === "true" &&
      "0px",
    borderTopRightRadius:
      language_direction === "rtl" && radiuschange === "true" && "0px",
    borderBottomRightRadius:
      language_direction === "rtl" && radiuschange === "true" && "0px",
  })
);
export const CustomBox = styled(Box)(({ theme }) => ({
  maxWidth: "825px",
  width: "100%",
  // backgroundColor:{alpha(theme.palette.primary.main, 0.3)},
  padding: "2.625rem",
  borderRadius: "1.25rem",
  height: "132px",
  // maxWidth: '825px',
  // marginLeft: 'auto',
  // marginRight: 'auto',
  // marginTop: '34px',
  // [theme.breakpoints.down('sm')]: {
  //     marginTop: '10px',
}));
export const CustomTypography = styled(Typography)(
  ({ theme, fontWeight, align }) => ({
    color: theme.palette.neutral[1000],
    fontWeight: fontWeight ? fontWeight : "inherit",
    textAlign: align ? align : "",
  })
);
