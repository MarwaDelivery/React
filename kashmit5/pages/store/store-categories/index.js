import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import MetaData from "../../meta-data";
import MainLayout from "../../../src/components/layout/MainLayout";
import SpecialStoreDetails from "../../../src/components/speacial-store-categories/SpecialStoreDetails";
const Index = ({ configData }) => {
	const { t } = useTranslation();
	const router = useRouter();
	return (
		<>
			<CssBaseline />
			<MetaData
				title={`${t("Special Store")} ${t("on")} ${
					configData?.business_name
				}`}
				//ogImage={`${configData?.base_urls?.react_landing_page_images}/${landingPageData?.banner_section_full?.banner_section_img_full}`}
			/>
			<MainLayout configData={configData}>
				<SpecialStoreDetails />
			</MainLayout>
		</>
	);
};

export default Index;
export const getServerSideProps = async () => {
	// const config = await ConfigApi.config()
	// const landingPageData = await landingPageApi.getLandingPageImages()
	const configRes = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
		{
			method: "GET",
			headers: {
				"X-software-id": 33571750,
				"X-server": "server",
				origin: process.env.NEXT_CLIENT_HOST_URL,
			},
		}
	);
	const config = await configRes.json();
	return {
		props: {
			configData: config,
			// landingPageData: landingPageData,
		},
	};
};
