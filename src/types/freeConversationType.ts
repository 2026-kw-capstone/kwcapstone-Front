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
