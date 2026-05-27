import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postScenarioAnswer } from "../../apis/scenario";
import { invalidateReportQueries } from "../queries/report";
import { getScenarioAnswerQueryKey } from "../queries/useGetScenarioAnswer";
import { getScenarioResultQueryKey } from "../queries/useGetScenarioResult";
import type { ScenarioLevel } from "../../types/scenarioType";

export const usePostScenarioAnswer = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postScenarioAnswer,
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        getScenarioAnswerQueryKey({
          scenarioId: variables.scenarioId,
          level: variables.level,
          stepNo: variables.stepNo,
        }),
        response.result
      );

      void queryClient.invalidateQueries({
        queryKey: getScenarioResultQueryKey({
          scenarioId: variables.scenarioId,
          level: variables.level as ScenarioLevel,
        }),
      });
      invalidateReportQueries(queryClient);
    },
  });

  return {
    ...mutation,
    analyzeScenarioAnswer: mutation.mutateAsync,
  };
};
