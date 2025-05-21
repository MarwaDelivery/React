import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Button,
  ListItemIcon,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import eng from "../../public/landingpage/us.svg";
import i18n, { t } from "i18next";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useSettings } from "../../contexts/use-settings";

const FooterLanguageSwitcher = () => {
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();
  const [language, setLanguage] = useState("hu");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const anchorRef = useRef(null);
  const { settings, saveSettings } = useSettings();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lang = JSON.parse(localStorage.getItem("language-setting")) || "hu";
      setLanguage(lang);
      i18n.changeLanguage(lang);
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (langKey) => {
    i18n.changeLanguage(langKey);
    setLanguage(langKey);
    localStorage.setItem("language-setting", JSON.stringify(langKey));
    saveSettings({
      ...settings,
      direction: langKey === "ar" ? "rtl" : "ltr",
    });
    toast.success(t("Language changed"));
    window.location.reload();
  };

  const getFlag = (key) => (key === "en" ? eng.src : hung.src);

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Button
        ref={anchorRef}
        onClick={handleClick}
        variant="outlined"
        size="small"
        sx={{
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          textTransform: "none",
          fontSize: "12px",
        }}
        startIcon={<img width="20px" src={getFlag(language)} alt="flag" />}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {language === "en" ? "English" : "Hungarian"}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        MenuListProps={{ "aria-labelledby": "footer-lang-btn" }}
      >
        {configData?.language?.map((lan, idx) => (
          <MenuItem key={idx} onClick={() => handleChangeLanguage(lan.key)}>
            <ListItemIcon>
              <img width="20px" src={getFlag(lan.key)} alt="flag" />
            </ListItemIcon>
            {lan.value}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default FooterLanguageSwitcher;
