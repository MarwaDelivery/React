import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { t } from "i18next";

const detectPlatform = () => {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(ua)) {
    return "android";
  }
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  ) {
    return "ios";
  }
  return "other";
};

const MobileAppInstallPopup = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("other");

  useEffect(() => {
    if (isMobile) {
      const detectedPlatform = detectPlatform();
      setPlatform(detectedPlatform);
      if (localStorage.getItem("appInstallPopupDismissed") !== "true") {
        setOpen(true);
      }
    }
  }, [isMobile]);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("appInstallPopupDismissed", "true");
  };

  // Your real app custom schemes (deep links)
  const customScheme = {
  android: "https://marwa.hu/openapp",
  ios: "com.googleusercontent.apps.393744073684-rq9gv7el7q88clvk9c74gbf8es9e1ik3://home",
  };

  const storeLinks = {
    android: "https://play.google.com/store/apps/details?id=com.marwa.androiduser&hl=en",
    ios: "https://apps.apple.com/hu/app/marwa-foods/id6449415140",
  };

  const tryOpenApp = () => {
    const scheme = customScheme[platform];
    const storeLink = storeLinks[platform];

    if (!scheme) {
      // fallback - just open store if no scheme found
      window.open(storeLink, "_blank");
      return;
    }

    // Try to open the app using custom URL scheme
    let timeout;
    const start = Date.now();

    // Create an invisible iframe for iOS, or just set window.location for Android
    if (platform === "ios") {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = scheme;
      document.body.appendChild(iframe);

      timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        // If the app didn't open, redirect to store
        if (Date.now() - start < 1500) {
          window.location.href = storeLink;
        }
      }, 1200);
    } else {
      // Android & other platforms
      window.location.href = scheme;

      timeout = setTimeout(() => {
        // If the app didn't open in 1.5s, redirect to store
        if (Date.now() - start < 1500) {
          window.location.href = storeLink;
        }
      }, 1200);
    }
  };

  const getMessage = () => t("Install Our App for a Better Experience!");

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          {getMessage()}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {t("Get faster access, and exclusive offers.")}
        </Typography>
        <Button variant="contained" color="primary" onClick={tryOpenApp}>
          {t("Install App")}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {t("Maybe Later")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileAppInstallPopup;
