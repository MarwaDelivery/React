import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Button, Stack, Typography } from "@mui/material";

export const CustomBoxWrapper = styled(Box)(({ theme }) => ({
  outline: "none",
  position: "absolute",
  insetBlockStart: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgColor: "background.paper",
  boxShadow: 24,
  padding: "10px",
  maxWidth: "845px",
  minWidth: "100px",
  width: "100%",

  background: theme.palette.background.paper,
  borderRadius: "5px",
  [theme.breakpoints.down("md")]: {
    maxWidth: "500px",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "300px",
  },
}));
export const LocationView = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  flex: "1 0",
  maxWidth: "800px",
  width: "100%",
  background: theme.palette.neutral[100],
  color: theme.palette.neutral[1000],
  top: "15%",
  height: "48px",
  padding: "8px",
  position: "absolute",
  [theme.breakpoints.down("md")]: {
    top: "22%",
  },
  [theme.breakpoints.down("sm")]: {
    top: "32%",
  },
}));
export const PrimaryButton = styled(Button)(
  ({ theme, color, width, backgroundcolor }) => ({
    width: width ? width : "100%",
    color: theme.palette.whiteContainer.main,
    backgroundColor: backgroundcolor
      ? backgroundcolor
      : theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.neutral[100],
    },
  })
);
