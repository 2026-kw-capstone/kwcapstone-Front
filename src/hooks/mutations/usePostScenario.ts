import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postScenario } from "../../apis/scenario";
import { getScenarioDetailQueryKey } from "../queries/useGetScenarioDetail";
import { getScenariosQueryKey } from "../queries/useGetScenarios";

export const usePostScenario = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postScenario,
    onSuccess: (response) => {
      queryClient.setQueryData(
        getScenarioDetailQueryKey(response.result.scenarioId),
        response.result
      );
      void queryClient.invalidateQueries({
        queryKey: getScenariosQueryKey(),
      });
    },
  });

  return {
    ...mutation,
    createScenario: mutation.mutateAsync,
  };
};
