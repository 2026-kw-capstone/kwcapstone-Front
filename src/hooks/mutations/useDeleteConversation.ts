import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConversation } from "../../apis/conversation";
import { QUERY_KEY } from "../../constants/key";
import type {
  ConversationDetail,
  ConversationSummary,
} from "../../types/freeConversationType";

type DeleteConversationVariables = {
  conversationId: number;
  selectedConversationId: number | null;
};

type DeleteConversationContext = {
  previousConversations?: ConversationSummary[];
  previousConversationDetail?: ConversationDetail;
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId }: DeleteConversationVariables) =>
      deleteConversation(conversationId),
    onMutate: async ({ conversationId, selectedConversationId }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.conversations],
        }),
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.conversationDetail, conversationId],
        }),
      ]);

      const previousConversations = queryClient.getQueryData<ConversationSummary[]>([QUERY_KEY.conversations]);
      const previousConversationDetail = queryClient.getQueryData<ConversationDetail>([QUERY_KEY.conversationDetail, conversationId]);

      queryClient.setQueryData<ConversationSummary[]>(
        [QUERY_KEY.conversations],
        (previous) =>
          previous?.filter(
            (conversation) => conversation.conversationId !== conversationId
          ) ?? previous
      );

      if (selectedConversationId === conversationId) {
        queryClient.setQueryData<ConversationDetail>(
          [QUERY_KEY.conversationDetail, conversationId],
          (previous) =>
            previous
              ? {
                  ...previous,
                  messages: [],
                }
              : previous
        );
      }

      return {
        previousConversations,
        previousConversationDetail,
      } satisfies DeleteConversationContext;
    },
    onError: (_, variables, context) => {
      queryClient.setQueryData(
        [QUERY_KEY.conversations],
        context?.previousConversations
      );
      queryClient.setQueryData(
        [QUERY_KEY.conversationDetail, variables.conversationId],
        context?.previousConversationDetail
      );
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.conversations],
      });
      queryClient.removeQueries({
        queryKey: [QUERY_KEY.conversationDetail, variables.conversationId],
      });
    },
  });
};
