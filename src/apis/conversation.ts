import { axiosInstance } from "./axios";
import type {
  RequestPatchConversationTitleDto,
  ResponseConversationDetailDto,
  ResponseConversationListDto,
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
