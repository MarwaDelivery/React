import React from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Box, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import LockIcon from "@mui/icons-material/Lock";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { SignInButton } from "../NavBar.style";
import Link from "next/link";
import { useRouter } from "next/router";
import { Stack } from "@mui/system";

const CustomSignButton = ({ from }) => {
  const router = useRouter();
  const token = "";
  const theme = useTheme();
  const clickHandler = () => {
    router.push("/auth/sign-in", undefined, { shallow: true });
  };
  return (
    <>
      <Stack justifyContent="flex-end" alignItems="end">
        <SignInButton onClick={clickHandler} variant="contained">
          <CustomStackFullWidth direction="row" alignItems="center" spacing={1}>
            <LockIcon
              fontSize="small"
              style={{ color: theme.palette.whiteContainer.main }}
            />
            <Typography color={theme.palette.whiteContainer.main}>
              {t("Sign In")}
            </Typography>
          </CustomStackFullWidth>
        </SignInButton>
      </Stack>
    </>
  );
};

export default CustomSignButton;
