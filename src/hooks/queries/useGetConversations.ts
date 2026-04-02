import { useQuery } from "@tanstack/react-query";
import { getConversationList } from "../../apis/conversation";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";
import type { ConversationSummary } from "../../types/freeConversationType";
import { useGetMyInfo } from "./useGetMyInfo";

const mapConversationSummary = (
  conversation: ConversationSummary
): ConversationSummary => ({
  conversationId: conversation.conversationId,
  title: conversation.title.trim() || "Untitled Conversation",
  lastMessageAt: conversation.lastMessageAt,
});

export const useGetConversations = () => {
  const { accessToken } = useAuth();
  const { data: myInfo } = useGetMyInfo();
  const userId = myInfo?.memberId;

  return useQuery({
    queryKey: [QUERY_KEY.conversations, userId],
    queryFn: getConversationList,
    enabled: !!accessToken && userId !== null && userId !== undefined,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    select: (response) =>
      response.result
        .map(mapConversationSummary)
        .sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
        ),
  });
};
