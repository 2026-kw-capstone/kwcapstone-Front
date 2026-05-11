import type { ApiResponse } from "./authType";

export type ConversationSummary = {
  conversationId: number;
  title: string;
  lastMessageAt: string;
};

export type ConversationInputType = "TEXT" | "VOICE";

export type ConversationUserMessage = {
  messageId: number;
  role: "USER";
  inputType: ConversationInputType;
  voiceUrl: string | null;
  content: string;
  createdAt: string;
};

export type ConversationAiMessage = {
  messageId: number;
  role: "AI";
  content: string;
  createdAt: string;
};

export type ConversationFeedback = {
  feedbackId: number;
  content: string;
  createdAt: string;
};

export type SentConversationUserMessage = Omit<
  ConversationUserMessage,
  "createdAt"
>;

export type SentConversationAiMessage = Omit<ConversationAiMessage, "createdAt">;

export type SentConversationFeedback = Omit<ConversationFeedback, "createdAt">;

export type ConversationMessageGroup = {
  clientRequestId: string;
  userMessage: ConversationUserMessage | null;
  aiMessage: ConversationAiMessage | null;
  feedback: ConversationFeedback | null;
};

export type ConversationDetail = {
  conversationId: number;
  title: string;
  messages: ConversationMessageGroup[];
};

export type RequestPostTextMessageDto = {
  conversationId: number | null;
  clientRequestId: string;
  content: string;
};

export type PostConversationMessageResult = {
  conversationId: number;
  userMessage: SentConversationUserMessage;
  aiMessage: SentConversationAiMessage;
  feedback: SentConversationFeedback;
};

export type RequestPatchConversationTitleDto = {
  title: string;
};

export type PatchConversationTitleResult = {
  conversationId: number;
  title: string;
};

export type ResponseConversationListDto = ApiResponse<ConversationSummary[]>;
export type ResponseConversationDetailDto = ApiResponse<ConversationDetail>;
export type ResponsePatchConversationTitleDto =
  ApiResponse<PatchConversationTitleResult>;
export type ResponsePostTextMessageDto = ApiResponse<PostConversationMessageResult> & {
  clientRequestId: string;
};
export type ResponsePostVoiceMessageDto = ApiResponse<PostConversationMessageResult> & {
  clientRequestId: string;
};

export type ResponseDeleteConversationDto = {
  isSuccess: boolean;
  code: string;
  message: string;
};

export type ConversationVoiceAudioResult = {
  messageId: number;
  voiceUrl: string;
};

export type ResponseGetConversationVoiceAudioDto =
  ApiResponse<ConversationVoiceAudioResult>;
