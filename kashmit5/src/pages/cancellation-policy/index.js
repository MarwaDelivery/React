import { useTranslation } from "react-i18next";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
import MainLayout from "../../src/components/layout/MainLayout";
import RefundPolicy from "../../src/components/policy-page";
import { CustomHeader } from "../../src/api-manage/Headers";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import React, { useEffect } from "react";
import PolicyPage from "../../src/components/policy-page";

const Index = ({ configData }) => {
  const { t } = useTranslation();
  const { data, refetch, isFetching } = useGetPolicyPage("/cancelation");
  useEffect(() => {
    refetch();
  }, []);
  return (
    <>
      <CssBaseline />
      <MetaData title={`Cancellation policy - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <PolicyPage
          data={data}
          title={t("Cancellation policy")}
          isFetching={isFetching}
        />
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async () => {
  const configRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
    {
      method: "GET",
      headers: CustomHeader,
    }
  );
  const config = await configRes.json();
  return {
    props: {
      configData: config,
    },
  };
};
