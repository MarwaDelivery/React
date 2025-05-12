import { alpha, InputBase, styled } from "@mui/material";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.grey[100], // Softer background
  color: theme.palette.neutral[700],
  border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`, // Subtle border
  borderRadius: "10px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",

  "&:hover": {
    backgroundColor: theme.palette.grey[200],
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },

  "&:focus-within": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

export const SearchIconWrapper = styled("div")(
  ({ theme, language_direction }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...(language_direction === "rtl" && {
      right: 0,
    }),
  })
);

export const StyledInputBase = styled(InputBase)(
  ({ theme, language_direction }) => ({
    color: "inherit",
    width: "100%",
    transition: theme.transitions.create(["width", "padding"], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight:
      language_direction === "rtl" ? `calc(1em + ${theme.spacing(4)})` : undefined,
    ...(language_direction === "rtl" && {
      direction: "rtl",
      textAlign: "right",
    }),
    "& .MuiInputBase-input": {
      padding: theme.spacing(1),
      fontSize: "0.95rem",
      transition: theme.transitions.create("width", {
        duration: theme.transitions.duration.shorter,
      }),
    },
    "&:focus-within": {
      width: "105%",
      paddingLeft: theme.spacing(5),
    },
  })
);
