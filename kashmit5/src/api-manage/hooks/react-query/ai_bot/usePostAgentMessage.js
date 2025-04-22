import { useMutation } from "react-query";
import { send_agent_chat_api, store_message_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const storeData = async (cData) => {
  const { data } = await MainApi.post(`${send_agent_chat_api}`, cData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
export const usePostAgentMessage = () => {
  return useMutation("send_message", storeData);
};
