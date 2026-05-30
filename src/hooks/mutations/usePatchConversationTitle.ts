import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchConversationTitle } from "../../apis/conversation";
import { QUERY_KEY } from "../../constants/key";
import { invalidateHomeQueries } from "../queries/home";
import type {
  ConversationDetail,
  ConversationSummary,
} from "../../types/freeConversationType";

type PatchConversationTitleVariables = {
  conversationId: number;
  title: string;
};

export const usePatchConversationTitle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, title }: PatchConversationTitleVariables) =>
      patchConversationTitle(conversationId, { title }),
    onMutate: async ({ conversationId, title }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.conversations],
        }),
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.conversationDetail, conversationId],
        }),
      ]);

      const previousConversations = queryClient.getQueryData<ConversationSummary[]>(
        [QUERY_KEY.conversations]
      );
      const previousConversationDetail = queryClient.getQueryData<ConversationDetail>([
        QUERY_KEY.conversationDetail,
        conversationId,
      ]);

      queryClient.setQueryData<ConversationSummary[]>(
        [QUERY_KEY.conversations],
        (previous) =>
          previous?.map((conversation) =>
            conversation.conversationId === conversationId
              ? { ...conversation, title }
              : conversation
          ) ?? previous
      );

      queryClient.setQueryData<ConversationDetail>(
        [QUERY_KEY.conversationDetail, conversationId],
        (previous) =>
          previous
            ? {
                ...previous,
                title,
              }
            : previous
      );

      return {
        previousConversations,
        previousConversationDetail,
      };
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
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.conversationDetail, variables.conversationId],
      });
      invalidateHomeQueries(queryClient);
    },
  });
};
