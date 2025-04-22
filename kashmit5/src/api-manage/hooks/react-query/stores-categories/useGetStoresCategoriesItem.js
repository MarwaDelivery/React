import MainApi from "../../../MainApi";
import { latest_items_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import axios from "axios";

const getData = async (pageParams) => {
  const { storeId, categoryId, offset, type, limit, minMax, moduleId, zoneId } =
    pageParams;
  if (minMax[0] !== 0 && minMax[1] !== 1) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}${latest_items_api}?store_id=${storeId}&category_id=${categoryId}&offset=${offset}&limit=${limit}&type=${type}&min_price=${minMax[0]}&max_price=${minMax[1]}`,
      {
        headers: {
          moduleId: moduleId,
          zoneId: JSON.stringify([zoneId]),
        },
      }
    );
    return data;
  } else {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}${latest_items_api}?store_id=${storeId}&category_id=${categoryId}&offset=${offset}&limit=${limit}&type=${type}`,
      {
        headers: {
          moduleId: moduleId,
          zoneId: JSON.stringify([zoneId]),
        },
      }
    );
    return data;
  }
};

export default function useGetStoresCategoriesItem(pageParams, handleSuccess) {
  return useQuery("stores-categories-item", () => getData(pageParams), {
    enabled: false,
    onSuccess: handleSuccess,
    onError: onErrorResponse,
  });
}
