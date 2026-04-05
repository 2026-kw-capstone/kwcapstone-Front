import { axiosInstance } from "./axios";
import type {
  RequestPostTextMessageDto,
  RequestPatchConversationTitleDto,
  ResponseDeleteConversationDto,
  ResponseConversationDetailDto,
  ResponseConversationListDto,
  ResponsePostTextMessageDto,
  ResponsePostVoiceMessageDto,
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

export const postVoiceMessage = async ({
  conversationId,
  clientRequestId,
  voiceFile,
}: {
  conversationId: number | null;
  clientRequestId: string;
  voiceFile: Blob;
}): Promise<ResponsePostVoiceMessageDto> => {
  const formData = new FormData();
  if (conversationId !== null) {
    formData.append("conversationId", String(conversationId));
  }
  formData.append("clientRequestId", clientRequestId);
  formData.append("voiceFile", voiceFile, "voice-message.webm");

  const { data } = await axiosInstance.post("/api/messages/voice", formData);
  return data;
};

export const deleteConversation = async (
  conversationId: number
): Promise<ResponseDeleteConversationDto> => {
  const { data } = await axiosInstance.delete(`/api/conversations/${conversationId}`);
  return data;
};
