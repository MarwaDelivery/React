// Colors

const neutral = {
  100: "#000000",
  200: "#303032",
  300: "#323232",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#f0f0fa",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
  1000: "#F3F4F6",
  1100: "#D6D6D6",
};

const background = {
  default: "#0B0F19",
  paper: neutral[900],
  custom: "#282829",
  custom2: "#1F2937",
  custom3: neutral[900],
};

const divider = "#2D3748";
const foodCardColor = "#FFF6EF";
const primary = {
  main: "#039D55",
  light: "#909BEF",
  dark: "#1c6641",
  contrastText: neutral[900],
  overlay: "#FFFFFF",
};

const secondary = {
  main: "#10B981",
  light: "#3FC79A",
  dark: "#0B815A",
  contrastText: neutral[900],
};

const success = {
  main: "#14B8A6",
  light: "#43C6B7",
  dark: "#0E8074",
  contrastText: neutral[900],
};

const info = {
  main: "#2196F3",
  light: "#64B6F7",
  dark: "#0B79D0",
  contrastText: neutral[900],
};

const warning = {
  main: "#FFB020",
  light: "#FFBF4C",
  dark: "#B27B16",
  contrastText: neutral[900],
};

const error = {
  main: "#D14343",
  light: "#DA6868",
  dark: "#922E2E",
  contrastText: neutral[900],
};

const text = {
  primary: "#EDF2F7",
  secondary: "#A0AEC0",
  disabled: "rgba(255, 255, 255, 0.48)",
  custom: "#ede8e8",
  customText1: "#EDF2F7",
};

const footer = {
  inputButton: "#BBFFDF",
  inputButtonHover: "#67907e",
  bottom: "rgba(0, 98, 52, 0.3)",
  appDownloadButtonBg: "#1A1A1A",
};

const customColor = {
  textGray: "#9c9c9c",
  textGrayDeep: "#787676",
  buyButton: "#006371",
};

const whiteContainer = {
  main: "#ffffff",
};

const pink = {
  main: "#FF6D76",
};

const paperBoxShadow = "#E5EAF1";

export const darkThemeOptions = {
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[500],
          color: "#FFFFFF",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-filledDefault": {
            backgroundColor: neutral[800],
            "& .MuiChip-deleteIcon": {
              color: neutral[500],
            },
          },
          "&.MuiChip-outlinedDefault": {
            borderColor: neutral[700],
            "& .MuiChip-deleteIcon": {
              color: neutral[700],
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: text.secondary,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: divider,
        },
        input: {
          "&:-webkit-autofill": {
            "-webkit-box-shadow": "0 0 0 100px #282929 inset",
            "-webkit-text-fill-color": "#fff",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: neutral[100],
        },
        track: {
          backgroundColor: neutral[500],
          opacity: 1,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${divider}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[800],
          ".MuiTableCell-root": {
            color: neutral[300],
          },
        },
      },
    },
  },
  palette: {
    action: {
      active: neutral[400],
      hover: "rgba(255, 255, 255, 0.04)",
      selected: "rgba(255, 255, 255, 0.08)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      disabled: "rgba(255, 255, 255, 0.26)",
    },
    background,
    divider,
    error,
    info,
    mode: "dark",
    neutral,
    primary,
    secondary,
    success,
    text,
    warning,
    footer,
    customColor,
    whiteContainer,
    pink,
    paperBoxShadow,
    foodCardColor,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.24)",
    "0px 1px 2px rgba(0, 0, 0, 0.24)",
    "0px 1px 4px rgba(0, 0, 0, 0.24)",
    "0px 1px 5px rgba(0, 0, 0, 0.24)",
    "0px 1px 6px rgba(0, 0, 0, 0.24)",
    "0px 2px 6px rgba(0, 0, 0, 0.24)",
    "0px 3px 6px rgba(0, 0, 0, 0.24)",
    "0px 4px 6px rgba(0, 0, 0, 0.24)",
    "0px 5px 12px rgba(0, 0, 0, 0.24)",
    "0px 5px 14px rgba(0, 0, 0, 0.24)",
    "0px 5px 15px rgba(0, 0, 0, 0.24)",
    "0px 6px 15px rgba(0, 0, 0, 0.24)",
    "0px 7px 15px rgba(0, 0, 0, 0.24)",
    "0px 8px 15px rgba(0, 0, 0, 0.24)",
    "0px 9px 15px rgba(0, 0, 0, 0.24)",
    "0px 10px 15px rgba(0, 0, 0, 0.24)",
    "0px 12px 22px -8px rgba(0, 0, 0, 0.24)",
    "0px 13px 22px -8px rgba(0, 0, 0, 0.24)",
    "0px 14px 24px -8px rgba(0, 0, 0, 0.24)",
    "0px 20px 25px rgba(0, 0, 0, 0.24)",
    "0px 25px 50px rgba(0, 0, 0, 0.24)",
    "0px 25px 50px rgba(0, 0, 0, 0.24)",
    "0px 25px 50px rgba(0, 0, 0, 0.24)",
    "0px 25px 50px rgba(0, 0, 0, 0.24)",
  ],
};
