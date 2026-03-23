import type {
  ConversationMessage,
  ConversationSummary,
} from "../types/freeConversationType";

export const MOCK_CONVERSATION_LIST: ConversationSummary[] = [
  { id: "conv-1", title: "마트에서 사과 찾기" },
  { id: "conv-2", title: "카페 주문 연습" },
  { id: "conv-3", title: "택시 기사님과 대화" },
];

export const MOCK_MESSAGES_BY_CONVERSATION: Record<string, ConversationMessage[]> = {
  "conv-1": [
    {
      id: "conv-1-assistant-1",
      role: "assistant",
      content: "안녕하세요. 오늘은 마트에서 사과를 찾는 상황을 연습해볼까요?",
    },
    {
      id: "conv-1-user-1",
      role: "user",
      content: "네, 사과 코너가 어디인지 영어로 물어보고 싶어요.",
    },
    {
      id: "conv-1-assistant-2",
      role: "assistant",
      content: "좋아요. 'Excuse me, where can I find apples?' 라고 말해보세요.",
    },
    {
      id: "conv-1-user-2",
      role: "user",
      content: "Excuse me, where can I find apples?",
    },
    {
      id: "conv-1-assistant-3",
      role: "assistant",
      content: "아주 좋아요. 이제 조금 더 공손하게 말해볼까요?",
    },
    {
      id: "conv-1-user-3",
      role: "user",
      content: "Excuse me, could you tell me where I can find apples?",
    },
    {
      id: "conv-1-assistant-4",
      role: "assistant",
      content: "좋아요. 직원이 'Aisle 4'라고 답했다면 뭐라고 말하면 좋을까요?",
    },
    {
      id: "conv-1-user-4",
      role: "user",
      content: "Thank you! I appreciate it.",
    },
    {
      id: "conv-1-assistant-5",
      role: "assistant",
      content: "완벽해요. 이제 사과 종류를 물어보는 문장도 연습해볼게요.",
    },
    {
      id: "conv-1-user-5",
      role: "user",
      content: "Do you have green apples as well?",
    },
    {
      id: "conv-1-assistant-6",
      role: "assistant",
      content: "네, 아주 자연스럽습니다. 가격을 물어보는 문장도 이어서 해볼까요?",
    },
    {
      id: "conv-1-user-6",
      role: "user",
      content: "How much are these apples per kilo?",
    },
    {
      id: "conv-1-assistant-7",
      role: "assistant",
      content: "좋아요. 마지막으로 계산대로 가기 전에 확인하는 문장을 연습해봐요.",
    },
    {
      id: "conv-1-user-7",
      role: "user",
      content: "Great, I'll take four of these. Thank you for your help.",
    },
    {
      id: "conv-1-assistant-8",
      role: "assistant",
      content: "아주 훌륭합니다. 실제 상황에서도 충분히 자연스럽게 말할 수 있겠어요.",
    },
  ],
  "conv-2": [
    {
      id: "conv-2-assistant-1",
      role: "assistant",
      content: "카페에서 주문하는 연습을 해볼게요. 무엇을 주문하고 싶나요?",
    },
    {
      id: "conv-2-user-1",
      role: "user",
      content: "아이스 아메리카노 한 잔 주세요.",
    },
  ],
  "conv-3": [
    {
      id: "conv-3-assistant-1",
      role: "assistant",
      content: "목적지를 영어로 설명해볼까요?",
    },
  ],
};
