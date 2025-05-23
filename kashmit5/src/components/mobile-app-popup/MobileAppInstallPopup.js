import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogActions, Typography, useMediaQuery } from "@mui/material";
import { t } from "i18next";

const detectPlatform = () => {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(ua)) {
    return "android";
  }
  // Detect iOS including iPadOS (which has Mac-like UA but supports touch)
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

   /* if (process.env.NODE_ENV === "development") {
      setOpen(true);
      setPlatform("android "); // or "ios" to test
      return;
    }*/
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

  const getAppLink = () => {
    if (platform === "android")
      return "https://play.google.com/store/apps/details?id=com.marwa.androiduser&hl=en";
    if (platform === "ios")
      return "https://apps.apple.com/hu/app/marwa-foods/id6449415140"; // Replace with your real iOS app store link
    return "https://play.google.com/store/apps/details?id=com.marwa.androiduser&hl=en"; // Android default link for other platforms
  };

  const getMessage = () => {
    if (platform === "android")
      return t("Install Our App for a Better Experience!");
    if (platform === "ios")
      return t("Install Our App for a Better Experience!");
    return t("Install Our App for a Better Experience!");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          boxShadow: 6,
          textAlign: "center",
        },
      }}
    >
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <img
            src="/icon.jpg" // Change this to your app icon
            alt="App Logo"
            style={{ width: "70px", height: "64px", borderRadius: 16 }}
          />

          <Typography variant="h6" fontWeight={600}>
            {getMessage()}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t("Get faster access, and exclusive offers.")}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            href={getAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 1 }}
          >
            {t("Install App")}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={handleClose} size="small" color="inherit">
          {t("Maybe Later")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileAppInstallPopup;
