import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postBasicSpeakPracticeAnalyze } from "../../apis/basicSpeak";
import { invalidateHomeQueries } from "../queries/home";
import { invalidateReportQueries } from "../queries/report";
import { getBasicSpeakPracticeQueryKey } from "../queries/useGetBasicSpeakLatestPractice";
import type {
  BasicSpeakTargetVowel,
  ResponseBasicSpeakLatestDto,
} from "../../types/basicSpeakType";

const getRequestId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `uuid-${crypto.randomUUID()}`;
  }

  return `uuid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const usePostBasicSpeakPracticeAnalyze = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postBasicSpeakPracticeAnalyze,
    onSuccess: (response, variables) => {
      const nextLatest: ResponseBasicSpeakLatestDto = {
        isSuccess: response.isSuccess,
        code: response.code,
        message: response.message,
        result: {
          hasPractice: true,
          practice: {
            ...response.result,
            createdAt: new Date().toISOString(),
          },
        },
      };

      queryClient.setQueryData(
        getBasicSpeakPracticeQueryKey(variables.targetVowel),
        nextLatest
      );
      invalidateHomeQueries(queryClient);
      invalidateReportQueries(queryClient);
    },
  });

  return {
    ...mutation,
    analyzeBasicSpeak: ({
      targetVowel,
      voiceFile,
    }: {
      targetVowel: BasicSpeakTargetVowel;
      voiceFile: Blob;
    }) =>
      mutation.mutateAsync({
        targetVowel,
        voiceFile,
        clientRequestId: getRequestId(),
      }),
  };
};
