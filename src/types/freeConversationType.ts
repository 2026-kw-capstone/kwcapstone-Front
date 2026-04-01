import type { ApiResponse } from "./authType";

export type ConversationSummary = {
  conversationId: number;
  title: string;
  lastMessageAt: string;
};

export type MessageRole = "assistant" | "user";

export type ConversationMessage = {
  id: string;
  role: MessageRole;
  content: string;
  // API 연동 후 사용자 음성 재생을 위해 서버에서 전달받는 URL
  voiceUrl?: string;
};

export type ResponseConversationListDto = ApiResponse<ConversationSummary[]>;
