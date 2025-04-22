import { useInfiniteQuery, useQuery } from "react-query";

import { ai_bot_message_list } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (params, pageParam) => {
  const { page_limit } = params;

  const { data } = await MainApi.get(
    `${ai_bot_message_list}?is_ai=1&admin_id=0&offset=${pageParam}&limit=${page_limit}`
  );

  return data;
};
export const useGetMessages = (params) => {
  return useInfiniteQuery(
    "get_conversations",
    ({ pageParam = params.offset }) => getData(params, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.messages.length > 0 ? nextPage : undefined;
      },
      enabled: false,
      onError: onErrorResponse,
    }
  );
};
