import { axiosInstance } from "./axios";
import type {
  RequestPostTextMessageDto,
  RequestPatchConversationTitleDto,
  ResponseDeleteConversationDto,
  ResponseConversationDetailDto,
  ResponseConversationListDto,
  ResponsePostTextMessageDto,
  ResponsePatchConversationTitleDto,
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

export const patchConversationTitle = async (
  conversationId: number,
  payload: RequestPatchConversationTitleDto
): Promise<ResponsePatchConversationTitleDto> => {
  const { data } = await axiosInstance.patch(
    `/api/conversations/${conversationId}`,
    payload
  );

  return data;
};

export const postTextMessage = async (
  payload: RequestPostTextMessageDto
): Promise<ResponsePostTextMessageDto> => {
  const { data } = await axiosInstance.post("/api/messages/text", payload);
  return data;
};

export const deleteConversation = async (
  conversationId: number
): Promise<ResponseDeleteConversationDto> => {
  const { data } = await axiosInstance.delete(`/api/conversations/${conversationId}`);
  return data;
};
