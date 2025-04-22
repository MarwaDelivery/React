import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import { categories_list_api } from "api-manage/ApiRoutes";

const getData = async (pageParams) => {
	const { data } = await MainApi.get(`${categories_list_api}`);
	return data;
};

export default function useGetCategoryLists(pageParams) {
	return useQuery("categories-lists", () => getData(pageParams), {
		onError: onSingleErrorResponse,
	});
}
