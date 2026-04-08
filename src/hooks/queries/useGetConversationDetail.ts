import { useQuery } from "@tanstack/react-query";
import { getConversationDetail } from "../../apis/conversation";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";

export const useGetConversationDetail = (
  conversationId: number | null
) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEY.conversationDetail, conversationId],
    queryFn: () => getConversationDetail(conversationId as number),
    enabled: !!accessToken && conversationId !== null,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: undefined,
  });
};
