import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postScenarioRegenerate } from "../../apis/scenario";
import { QUERY_KEY } from "../../constants/key";
import { getScenarioDetailQueryKey } from "../queries/useGetScenarioDetail";
import { getScenariosQueryKey } from "../queries/useGetScenarios";

export const usePostScenarioRegenerate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postScenarioRegenerate,
    onSuccess: (_response, variables) => {
      const isSameScenario = (queryKey: readonly unknown[]) =>
        queryKey[1] === variables.scenarioId;

      const isRegeneratedLevelOrAfter = (queryLevel: unknown) =>
        typeof queryLevel === "number" && queryLevel >= variables.level;

      const isRegeneratedStepOrAfter = (
        queryLevel: unknown,
        queryStepNo: unknown
      ) => {
        if (typeof queryLevel !== "number") return false;
        if (queryLevel > variables.level) return true;

        return (
          queryLevel === variables.level &&
          typeof queryStepNo === "number" &&
          queryStepNo >= variables.stepNo
        );
      };

      queryClient.removeQueries({
        predicate: ({ queryKey }) => {
          if (!isSameScenario(queryKey)) return false;

          const queryType = String(queryKey[0]);

          if (
            queryType === QUERY_KEY.scenarioStep ||
            queryType === QUERY_KEY.scenarioAnswer ||
            queryType === QUERY_KEY.scenarioUserAudio
          ) {
            return isRegeneratedStepOrAfter(queryKey[2], queryKey[3]);
          }

          if (queryType === QUERY_KEY.scenarioResult) {
            return isRegeneratedLevelOrAfter(queryKey[2]);
          }

          return false;
        },
      });

      void queryClient.invalidateQueries({
        queryKey: getScenarioDetailQueryKey(variables.scenarioId),
      });
      void queryClient.invalidateQueries({
        queryKey: getScenariosQueryKey(),
      });
    },
  });

  return {
    ...mutation,
    regenerateScenario: mutation.mutateAsync,
  };
};
