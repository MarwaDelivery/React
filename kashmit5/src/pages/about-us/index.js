import { useTranslation } from "react-i18next";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MetaData from "../meta-data";
import MainLayout from "../../src/components/layout/MainLayout";
import PolicyPage from "../../src/components/policy-page";
import { CustomHeader } from "../../src/api-manage/Headers";

const Index = ({ configData }) => {
  const { t } = useTranslation();
  const { data, refetch, isFetching } = useGetPolicyPage("/about-us");
  useEffect(() => {
    refetch();
  }, []);
  return (
    <>
      <CssBaseline />
      <MetaData title={`About Us - ${configData?.business_name}`} />
      <MainLayout configData={configData}>
        <PolicyPage
          data={{ ...data, value: data }}
          title={t("About us")}
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
