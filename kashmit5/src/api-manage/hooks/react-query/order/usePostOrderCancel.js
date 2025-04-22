import MainApi from "../../../MainApi";
import { order_cancel_api } from "../../../ApiRoutes";
import { useMutation } from "react-query";

const postData = async (formData) => {
  const { data } = await MainApi.post(order_cancel_api, formData);
  return data;
};

export default function usePostOrderCancel() {
  return useMutation("order-cancel", postData);
}
