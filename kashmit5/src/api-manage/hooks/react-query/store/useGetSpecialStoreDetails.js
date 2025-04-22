import MainApi from "../../../MainApi";
import { special_store_details } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (store_id) => {
	const { data } = await MainApi.get(`${special_store_details}/${store_id}`);
	return data;
};

export default function useGetSpecialStoreDetails(store_id) {
	return useQuery(
		["special-store-details", store_id],
		() => getData(store_id),
		{
			onError: onSingleErrorResponse,
		}
	);
}
