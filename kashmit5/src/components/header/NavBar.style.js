import { alpha, AppBar, BottomNavigationAction, Button, Drawer, Menu, Link as MenuLink, Stack, Switch, styled } from "@mui/material";
import bgImg from "../../../public/bgimge.jpg";

// ========== AppBar & Navigation ==========

export const AppBarStyle = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : theme.palette.background.default
}));

export const CustomDrawer = styled(Drawer)(({ theme, router }) => {
  const margin = router.pathname === "/" ? theme.spacing(3) : 0;
  return {
    "& .MuiDrawer-paper": {
      top: 60,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      marginLeft: margin,
      marginRight: margin,
      [theme.breakpoints.down("sm")]: {
        marginLeft: router.pathname === "/" ? theme.spacing(2) : 0,
        marginRight: router.pathname === "/" ? theme.spacing(2) : 0,
      },
    },
  };
});

// ========== Background & Layout ==========

export const CustomBgImage = styled(Stack)(() => ({
  backgroundImage: `url(${bgImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

export const CustomStackForLoaction = styled(Stack)({
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
});

// ========== Buttons ==========

export const TopBarButton = styled(Button)(({ theme, formmobilemenu }) => ({
  padding: formmobilemenu ? "7px 5px" : "7px 12px",
  color: theme.palette.neutral[100],
}));

export const SignInButton = styled(Button)(({ theme }) => ({
  maxWidth: 150,
  width: "100%",
  color: theme.palette.neutral[100],
  backgroundColor: theme.palette.primary.main,
}));

export const ButtonContainer = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

// ========== Switch ==========

export const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 22,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(20px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
      },
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg ... />')`, // Use reusable icon
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#fff",
    width: 20,
    height: 20,
  },
  "& .MuiSwitch-track": {
    borderRadius: 13,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

// ========== Menu ==========

export const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
    boxShadow:
      "0 0 0 0 rgb(255 255 255), 0 0 0 1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "&:active": {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

export const NavMenuLink = styled(MenuLink)(({ theme }) => ({
  color: theme.palette.neutral[1000],
  display: "flex",
  fontSize: 16,
  textDecoration: "none",
  gap: "5px",
  "&:hover": {
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
}));

// ========== Links & Bottom Nav ==========

export const NavLinkStyle = styled(Stack)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

export const CustomBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  color: theme.palette.neutral[1000],
  minWidth: 60,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "& .MuiBottomNavigationAction-label": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "1",
    WebkitBoxOrient: "vertical",
  },
}));
