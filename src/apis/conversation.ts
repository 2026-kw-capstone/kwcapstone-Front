import { axiosInstance } from "./axios";
import type {
  ResponseConversationDetailDto,
  ResponseConversationListDto,
} from "../types/freeConversationType";

export const getConversationList =
  async (): Promise<ResponseConversationListDto> => {
    const { data } = await axiosInstance.get("/api/conversations");
    return data;
  };

export const getConversationDetail = async (
  conversationId: number
): Promise<ResponseConversationDetailDto> => {
  const { data } = await axiosInstance.get(`/api/conversations/${conversationId}`);
  return data;
};
