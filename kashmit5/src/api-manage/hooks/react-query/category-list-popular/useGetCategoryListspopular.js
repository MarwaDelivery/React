import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import { categories_list_api_one } from "api-manage/ApiRoutes";

const getData = async (pageParams) => {
	const { data } = await MainApi.get(`${categories_list_api_one}`);
	return data;
};

export default function useGetCategoryListspopular(pageParams) {
	return useQuery("categories-lists-popular", () => getData(pageParams), {
		onError: onSingleErrorResponse,
	});
}
