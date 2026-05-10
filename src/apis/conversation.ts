import { axiosInstance } from "./axios";
import type {
  ConversationDetail,
  ConversationSummary,
  RequestPostTextMessageDto,
  RequestPatchConversationTitleDto,
  ResponseDeleteConversationDto,
  ResponseGetConversationVoiceAudioDto,
  ResponsePostTextMessageDto,
  ResponsePostVoiceMessageDto,
  ResponsePatchConversationTitleDto,
  ConversationVoiceAudioResult,
} from "../types/freeConversationType";

export const getConversationList = async (): Promise<ConversationSummary[]> => {
  const { data } = await axiosInstance.get("/api/conversations");
  return data.result;
};

export const getConversationDetail = async (
  conversationId: number
): Promise<ConversationDetail> => {
  const { data } = await axiosInstance.get(`/api/conversations/${conversationId}`);
  return data.result;
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

export const getConversationVoiceAudio = async (
  messageId: number
): Promise<ConversationVoiceAudioResult> => {
  const { data } = await axiosInstance.get<ResponseGetConversationVoiceAudioDto>(
    `/api/messages/${messageId}/voice`
  );
  return data.result;
};

export const deleteConversation = async (
  conversationId: number
): Promise<ResponseDeleteConversationDto> => {
  const { data } = await axiosInstance.delete(`/api/conversations/${conversationId}`);
  return data;
};
