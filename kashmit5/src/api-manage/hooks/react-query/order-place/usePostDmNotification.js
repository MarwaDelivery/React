import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { dm_notification_api } from "api-manage/ApiRoutes";

const getData = async (orderId) => {
  const { data } = await MainApi.get(`${dm_notification_api}/${orderId}`);
  return data;
};

export default function usePostDmNotification(orderId) {
  return useQuery("dm_notify", () => getData(orderId), {
    enabled: false,
    onError: onSingleErrorResponse,
  });
}
