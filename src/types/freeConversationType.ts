export type ConversationSummary = {
  id: string;
  title: string;
};

export type MessageRole = "assistant" | "user";

export type ConversationMessage = {
  id: string;
  role: MessageRole;
  content: string;
};
