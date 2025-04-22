import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import axios from "axios";

export const getData = async (pageParams) => {
  const { store_id, page_limit, offset, moduleId, zoneId } = pageParams;
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/items/recommended?store_id=${store_id}&limit=${page_limit}&offset=${offset}`,
    {
      headers: {
        moduleId: moduleId,
        zoneId: JSON.stringify([zoneId]),
      },
    }
  );
  return data;
};
export const useGetRecommendProducts = (pageParams) => {
  return useQuery("recommend-products", () => getData(pageParams), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
};
