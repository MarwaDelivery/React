import React, { useEffect, useState } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "../../styled-components/CustomStyles.style";
import { Button, Grid, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import wallet from "./assets/wallet.png";
import { setUser } from "../../redux/slices/profileInfo";
import useGetProfile from "../../api-manage/hooks/react-query/profile/useGetProfile";
import { useDispatch } from "react-redux";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { Skeleton } from "@mui/material";
import TransactionHistory from "../transaction-history";
import useGetWalletTransactionsList from "../../api-manage/hooks/react-query/useGetWalletTransactionsList";
import CustomModal from "../../components/modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import OutlinedInput from "@mui/material/OutlinedInput";
import { CustomButtonSuccess } from "src/styled-components/CustomButtons.style";
import { digitalPaymentData } from "components/checkout/digitalPaymentData";
import { CheckCircle } from "@mui/icons-material";
import { baseUrl } from "api-manage/MainApi";
import { generatePaymentUrl } from "utils/CustomFunctions";
import { useQuery } from "react-query";
import { ProfileApi } from "api-manage/another-formated-api/profileApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useRouter } from "next/router";

export const CustomOutlinedInput = styled(OutlinedInput)(({ theme, type }) => ({
  borderRadius: "7px",
  height: "48px",
  width: "100%",
  maxWidth: "457px",
  outline: "none !important",
  border: "none !important",
  boxShadow: "none !important",
  background: theme.palette.background.paper,
  paddingInline: "35px",
  fontSize: "20px",
  input: {
    textAlign: "center",
    fontWeight: "400",
  },
  "input::-webkit-inner-spin-button": {
    display: "none",
  },
  "input::-webkit-iuter-spin-button": {
    display: "none",
  },
}));

export const WallatBox = styled(Box)(({ theme, nobackground }) => ({
  display: "flex",
  height: "123px",
  background: nobackground === "true" ? "inherit" : theme.palette.primary.main,
  borderRadius: "10px",
  [theme.breakpoints.up("xs")]: {
    width: "100%",
    maxWidth: "343px",
  },
  [theme.breakpoints.up("md")]: {
    width: "330px",
  },
  // padding:'30px'
}));
const validationSchema = Yup.object({
  amount: Yup.string().required("Please Enter amount"),
  payment_method: Yup.string().required("Payment method is required"),
});
export const CustomRadioBox = styled(Box)(({ theme, type }) => ({
  label: {
    display: "flex",
    alignItems: "center",
    gap: "21px",
    cursor: "pointer",
    ".MuiSvgIcon-root": {
      width: "18px",
      height: "18px",
      color: theme.palette.primary.main,
    },
    ">.MuiStack-root": {
      width: "0",
      flexGrow: "1",
    },
    padding: "8px 30px",
    borderRadius: "10px",
    "&.active": {
      background: theme.palette.background.custom3,
    },
  },
}));

const Wallet = (props) => {
  const { configData, t } = props;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(digitalPaymentData[0]?.value);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading: customerLoading, data: customerData } = useQuery(
    ["profile-info"],
    ProfileApi.profileInfo,
    {
      onError: onSingleErrorResponse,
    }
  );
  const formik = useFormik({
    initialValues: {
      amount: "",
      payment_method: digitalPaymentData[0]?.value,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, helpers) => {
      const orderId = "0";
      const userID = customerData?.data?.id;
      try {
        const paymentUrl = generatePaymentUrl(
          orderId,
          values?.payment_method,
          values?.amount,
          userID
        );
        const page = "wallet";
        const callbackUrl = `${window.location.origin}/${page}?userID=${userID}`;
        const finalUrl = `${paymentUrl}&callback=${callbackUrl}`;
        router.push(finalUrl);
        // formSubmitHandler(values);
      } catch (err) {}
    },
  });
  const userOnSuccessHandler = (res) => {
    dispatch(setUser(res));
    //handleClose()
  };
  const { data: userData, refetch: profileRefetch } =
    useGetProfile(userOnSuccessHandler);
  const [offset, setOffset] = useState(1);
  let pageParams = { offset: offset };
  const { data, refetch, isLoading } = useGetWalletTransactionsList(pageParams);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await refetch();
    await profileRefetch();
  };

  // const formSubmitHandler = (values) => {
  //   setLoading(true);
  //   const page = "wallet";
  //   const callbackUrl = `${window.location.origin}/profile?page=${page}`;
  //   const payloadData = {
  //     ...values,
  //     callback: callbackUrl,
  //     payment_platform: "web",
  //   };
  //
  //   mutate(payloadData, {
  //     onSuccess: async (response) => {
  //       setLoading(false);
  //       const url = response?.redirect_link;
  //       Router.push(url);
  //     },
  //     onError: onErrorResponse,
  //   });
  // };
  return (
    <CustomStackFullWidth
      my="2rem"
      alignItems="center"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <CustomPaperBigCard sx={{ paddingTop: "4rem", minHeight: "60vh" }}>
        <Grid container>
          <Grid xs={12} md={12} align="center">
            <WallatBox>
              <CustomStackFullWidth
                direction="row"
                justifyContent="center"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
              >
                <CustomImageContainer
                  src={wallet?.src}
                  width="60px"
                  height="60px"
                />
                <Stack alignItems="flex-start">
                  <Typography
                    fontWeight="bold"
                    color={theme.palette.whiteContainer.main}
                  >
                    {t("Wallet Amount")}
                  </Typography>
                  <Typography
                    fontSize="20px"
                    fontWeight="bold"
                    color={theme.palette.whiteContainer.main}
                  >
                    {userData ? (
                      getAmountWithSign(userData?.wallet_balance)
                    ) : (
                      <Skeleton variant="text" width="100px" />
                    )}
                  </Typography>
                </Stack>
                <Button
                  onClick={() => setOpen(true)}
                  sx={{
                    color: (theme) => theme.palette.neutral[100],
                    background: theme.palette.neutral[1000],
                  }}
                >
                  {t("Add Fund")}
                </Button>
              </CustomStackFullWidth>
            </WallatBox>
          </Grid>
          <Grid item xs={12}>
            <TransactionHistory data={data} isLoading={isLoading} />
          </Grid>
        </Grid>
      </CustomPaperBigCard>
      <CustomModal openModal={open} handleClose={() => setOpen(false)}>
        <Box sx={{ p: { xs: "24px" }, paddingBlock: { sm: "41px 27px" } }}>
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ position: "relative" }}
          >
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                zIndex: "99",
                position: "absolute",
                top: -40,
                right: -20,
                backgroundColor: (theme) => theme.palette.neutral[100],
                borderRadius: "50%",
                [theme.breakpoints.down("md")]: {
                  top: -25,
                  right: -20,
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "12px", fontWeight: "500" }} />
            </IconButton>
          </CustomStackFullWidth>
          <Box textAlign="center" mb={4}>
            <Typography variant="h6" mb={2}>
              {t("Add Fund to Wallet")}
            </Typography>
            <Typography variant="body2">
              {t("Add fund by from secured digital payment gateways")}
            </Typography>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <CustomOutlinedInput
              variant="outlined"
              name="amount"
              id="amount"
              type="number"
              placeholder="Enter Amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helpertext={formik.touched.amount && formik.errors.amount}
            />
            <Box mt={3}>
              <Typography variant="body1" fontWeight="600" mb={2}>
                {t("Payment Methods")}
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontSize: "12px" }}
                >
                  ({t("Faster & secure way to pay bill")})
                </Typography>
              </Typography>
              {formik.values.amount > 0 && (
                <>
                  <Stack>
                    {digitalPaymentData?.map((item, i) => (
                      <CustomRadioBox key={item?.name}>
                        <label className={value == item?.value ? "active" : ""}>
                          <input
                            type="radio"
                            name="payment_method"
                            value={item?.value}
                            onChange={(e) => {
                              setValue(e.target.value);
                              formik.handleChange(e);
                            }}
                            style={{ display: "none" }}
                          />
                          {value == item?.value ? (
                            <CheckCircle />
                          ) : (
                            <Box
                              sx={{
                                width: "18px",
                                borderRadius: "50%",
                                aspectRatio: "1",
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                            />
                          )}
                          <Stack
                            direction="row"
                            gap={1}
                            sx={{
                              img: {
                                height: "24px",
                                width: "unset",
                              },
                            }}
                          >
                            {item?.gateway_image && (
                              <CustomImageContainer
                                src={item?.image.src}
                                width="30px"
                                height="30px"
                                objectfit="contain"
                              />
                            )}
                            <Typography fontSize="14px">
                              {item?.name}
                            </Typography>
                          </Stack>
                        </label>
                      </CustomRadioBox>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
            <Box mt={4}>
              <CustomButtonSuccess
                width="100%"
                height="50px"
                type="submit"
                //loading={loading}
                disabled={formik.values.amount <= 0}
              >
                {t("Add fund")}
              </CustomButtonSuccess>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </CustomStackFullWidth>
  );
};

Wallet.propTypes = {};

export default Wallet;
