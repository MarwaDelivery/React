import { styled } from "@mui/material/styles";
import { Paper, Typography } from "@mui/material";

// Styled container for layout
export const Container = styled("div")({
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Styled Paper with optional props for maxHeight and maxWidth
export const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "maxHeight" && prop !== "maxWidth",
})(({ theme, maxHeight = "700px", maxWidth = "500px" }) => ({
  width: "80vw",
  height: "80vh",
  maxWidth: maxWidth,
  maxHeight: maxHeight,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  position: "relative",
  backgroundColor: theme.palette.background.paper,
}));

// Styled messages body with scrollable area
export const MessagesBody = styled(Paper)(({ theme }) => ({
  width: "calc(100% - 20px)",
  margin: 10,
  overflowY: "scroll",
  height: "calc(100% - 80px)",
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  "&::-webkit-scrollbar": {
    width: "8px", // Adjust scrollbar width
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.primary.main, // Change the thumb color
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.paper, // Optionally change track color
    borderRadius: "10px",
  },
}));

// Custom Typography with optional props for font size and text decoration
export const CustomTypographyGray = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== "nodefaultfont" && prop !== "textdecoration",
})(({ theme, nodefaultfont, textdecoration }) => ({
  color: theme.palette.neutral
    ? theme.palette.neutral[400]
    : theme.palette.text.secondary,
  fontWeight: "bold",
  fontSize: nodefaultfont !== "true" ? "1rem" : undefined,
  textDecoration: textdecoration,
}));
