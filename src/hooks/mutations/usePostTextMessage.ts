import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { postTextMessage } from "../../apis/conversation";
import { QUERY_KEY } from "../../constants/key";
import type {
  ConversationDetail,
  ConversationMessageGroup,
  ConversationSummary,
  ResponsePostTextMessageDto,
} from "../../types/freeConversationType";

type PostTextMessageVariables = {
  conversationId: number | null;
  content: string;
};

type InternalPostTextMessageVariables = PostTextMessageVariables & {
  clientRequestId: string;
};

type UsePostTextMessageOptions = {
  onConversationCreated?: (conversationId: number) => void;
};

type PostTextMessageContext = {
  previousConversations?: ConversationSummary[];
  previousConversationDetail?: ConversationDetail;
  optimisticMessageGroup: ConversationMessageGroup;
  requestConversationId: number | null;
};

const getRequestId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `uuid-${crypto.randomUUID()}`;
  }

  return `uuid-${Math.random().toString(16).slice(2)}`;
};

const createOptimisticMessageGroup = (
  content: string,
  clientRequestId: string
): ConversationMessageGroup => {
  const now = new Date().toISOString();
  const tempMessageId = -Date.now();

  return {
    clientRequestId,
    userMessage: {
      messageId: tempMessageId,
      role: "USER",
      inputType: "TEXT",
      voiceUrl: null,
      content,
      createdAt: now,
    },
    aiMessage: null,
    feedback: null,
  };
};

const mergeConversationSummary = (
  previous: ConversationSummary[] | undefined,
  conversationId: number,
  fallbackTitle: string
) => {
  const now = new Date().toISOString();
  const list = previous ?? [];
  const target = list.find((conversation) => conversation.conversationId === conversationId);

  if (!target) {
    return [
      {
        conversationId,
        title: fallbackTitle,
        lastMessageAt: now,
      },
      ...list,
    ];
  }

  return [
    {
      ...target,
      lastMessageAt: now,
    },
    ...list.filter((conversation) => conversation.conversationId !== conversationId),
  ];
};

export const usePostTextMessage = (options?: UsePostTextMessageOptions) => {
  const queryClient = useQueryClient();
  const [pendingNewConversationMessages, setPendingNewConversationMessages] =
    useState<ConversationMessageGroup[]>([]);

  const mutation = useMutation<
    ResponsePostTextMessageDto,
    Error,
    InternalPostTextMessageVariables,
    PostTextMessageContext
  >({
    mutationFn: ({ conversationId, content, clientRequestId }) =>
      postTextMessage({ conversationId, clientRequestId, content }),
    onMutate: async ({ conversationId, content, clientRequestId }) => {
      const optimisticMessageGroup = createOptimisticMessageGroup(content, clientRequestId);

      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.conversations],
        }),
        ...(conversationId !== null
          ? [
              queryClient.cancelQueries({
                queryKey: [QUERY_KEY.conversationDetail, conversationId],
              }),
            ]
          : []),
      ]);

      const previousConversations = queryClient.getQueryData<ConversationSummary[]>([QUERY_KEY.conversations]);
      const previousConversationDetail =
        conversationId !== null
          ? queryClient.getQueryData<ConversationDetail>([
              QUERY_KEY.conversationDetail,
              conversationId,
            ])
          : undefined;

      queryClient.setQueryData<ConversationSummary[]>(
        [QUERY_KEY.conversations],
        (previous) =>
          conversationId !== null
            ? mergeConversationSummary(previous, conversationId, "New conversation")
            : previous
      );

      if (conversationId !== null) {
        queryClient.setQueryData<ConversationDetail>(
          [QUERY_KEY.conversationDetail, conversationId],
          (previous) =>
            previous
              ? {
                  ...previous,
                  messages: [...previous.messages, optimisticMessageGroup],
                }
              : previous
        );
      } else {
        setPendingNewConversationMessages((previous) => [
          ...previous,
          optimisticMessageGroup,
        ]);
      }

      return {
        previousConversations,
        previousConversationDetail,
        optimisticMessageGroup,
        requestConversationId: conversationId,
      };
    },
    onError: (_, variables, context) => {
      queryClient.setQueryData(
        [QUERY_KEY.conversations],
        context?.previousConversations
      );

      if (variables.conversationId !== null) {
        queryClient.setQueryData(
          [QUERY_KEY.conversationDetail, variables.conversationId],
          context?.previousConversationDetail
        );
      } else if (context) {
        setPendingNewConversationMessages((previous) =>
          previous.filter(
            (message) =>
              message.clientRequestId !== context.optimisticMessageGroup.clientRequestId
          )
        );
      }
    },
    onSuccess: (response, _, context) => {
      if (!context) {
        return;
      }

      const resolvedConversationId = response.result.conversationId;
      const serverClientRequestId =
        response.clientRequestId ?? context.optimisticMessageGroup.clientRequestId;
      const messageGroup: ConversationMessageGroup = {
        clientRequestId: serverClientRequestId,
        userMessage: response.result.userMessage,
        aiMessage: response.result.aiMessage,
        feedback: response.result.feedback,
      };

      queryClient.setQueryData<ConversationDetail>(
        [QUERY_KEY.conversationDetail, resolvedConversationId],
        (previous) => {
          if (!previous) {
            return {
              conversationId: resolvedConversationId,
              title: "New conversation",
              messages: [messageGroup],
            };
          }

          const targetClientRequestId = context.optimisticMessageGroup.clientRequestId;
          const targetIndex = previous.messages.findIndex(
            (message) => message.clientRequestId === targetClientRequestId
          );

          if (targetIndex === -1) {
            return {
              ...previous,
              messages: [...previous.messages, messageGroup],
            };
          }

          const nextMessages = [...previous.messages];
          nextMessages[targetIndex] = messageGroup;

          return {
            ...previous,
            messages: nextMessages,
          };
        }
      );

      queryClient.setQueryData<ConversationSummary[]>(
        [QUERY_KEY.conversations],
        (previous) =>
          mergeConversationSummary(
            previous,
            resolvedConversationId,
            messageGroup.userMessage?.content.slice(0, 20) || "New conversation"
          )
      );

      if (context.requestConversationId === null) {
        setPendingNewConversationMessages((previous) =>
          previous.filter(
            (message) =>
              message.clientRequestId !== context.optimisticMessageGroup.clientRequestId
          )
        );
        options?.onConversationCreated?.(resolvedConversationId);
      }

      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.conversations],
      });
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.conversationDetail, resolvedConversationId],
      });
    },
  });

  const sendTextMessage = (variables: PostTextMessageVariables) => {
    const content = variables.content.trim();

    return mutation.mutateAsync({
      ...variables,
      content,
      clientRequestId: getRequestId(),
    });
  };

  const clearPendingNewConversationMessages = () => {
    setPendingNewConversationMessages([]);
  };

  return {
    ...mutation,
    sendTextMessage,
    pendingNewConversationMessages,
    clearPendingNewConversationMessages,
  };
};
