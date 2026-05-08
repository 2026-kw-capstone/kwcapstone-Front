import { useQuery } from "@tanstack/react-query";
import { getConversationList } from "../../apis/conversation";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";
import type { ConversationSummary } from "../../types/freeConversationType";

const mapConversationSummary = (
  conversation: ConversationSummary
): ConversationSummary => ({
  conversationId: conversation.conversationId,
  title: conversation.title.trim() || "Untitled Conversation",
  lastMessageAt: conversation.lastMessageAt,
});

export const useGetConversations = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEY.conversations],
    queryFn: async () => {
      const conversations = await getConversationList();

      return conversations
        .map(mapConversationSummary)
        .sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
        );
    },
    enabled: !!accessToken,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
