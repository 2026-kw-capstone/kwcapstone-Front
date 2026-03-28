export type ConversationSummary = {
  id: string;
  title: string;
};

export type MessageRole = "assistant" | "user";

export type ConversationMessage = {
  id: string;
  role: MessageRole;
  content: string;
  // 추후 API 연동 시 사용자 음성 재생을 위해 서버에서 전달받는 URL
  voiceUrl?: string;
};
