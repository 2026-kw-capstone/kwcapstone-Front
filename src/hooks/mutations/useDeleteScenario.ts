import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScenario } from "../../apis/scenario";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseGetScenariosDto } from "../../types/scenarioType";
import { invalidateHomeQueries } from "../queries/home";
import { invalidateReportQueries } from "../queries/report";
import { getScenariosQueryKey } from "../queries/useGetScenarios";

type DeleteScenarioVariables = {
  scenarioId: number;
};

type DeleteScenarioContext = {
  previousScenarios?: ResponseGetScenariosDto;
};

export const useDeleteScenario = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ scenarioId }: DeleteScenarioVariables) =>
      deleteScenario(scenarioId),
    onMutate: async ({ scenarioId }) => {
      await queryClient.cancelQueries({
        queryKey: getScenariosQueryKey(),
      });

      const previousScenarios =
        queryClient.getQueryData<ResponseGetScenariosDto>(getScenariosQueryKey());

      queryClient.setQueryData<ResponseGetScenariosDto>(
        getScenariosQueryKey(),
        (previous) =>
          previous
            ? {
                ...previous,
                result: {
                  ...previous.result,
                  scenarios: previous.result.scenarios.filter(
                    (scenario) => scenario.scenarioId !== scenarioId
                  ),
                },
              }
            : previous
      );

      return {
        previousScenarios,
      } satisfies DeleteScenarioContext;
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        getScenariosQueryKey(),
        context?.previousScenarios
      );
    },
    onSuccess: (_response, variables) => {
      const keysToRemove = new Set<string>([
        QUERY_KEY.scenarioDetail,
        QUERY_KEY.scenarioStep,
        QUERY_KEY.scenarioAnswer,
        QUERY_KEY.scenarioResult,
        QUERY_KEY.scenarioUserAudio,
      ]);

      queryClient.removeQueries({
        predicate: ({ queryKey }) =>
          keysToRemove.has(String(queryKey[0])) &&
          queryKey[1] === variables.scenarioId,
      });

      void queryClient.invalidateQueries({
        queryKey: getScenariosQueryKey(),
      });
      invalidateHomeQueries(queryClient);
      invalidateReportQueries(queryClient);
    },
  });

  return {
    ...mutation,
    deleteScenario: mutation.mutateAsync,
  };
};
