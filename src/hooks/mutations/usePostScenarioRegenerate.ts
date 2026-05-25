import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postScenarioRegenerate } from "../../apis/scenario";
import { QUERY_KEY } from "../../constants/key";
import { getScenariosQueryKey } from "../queries/useGetScenarios";

export const usePostScenarioRegenerate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postScenarioRegenerate,
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
    },
  });

  return {
    ...mutation,
    regenerateScenario: mutation.mutateAsync,
  };
};
