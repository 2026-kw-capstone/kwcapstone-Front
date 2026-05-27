import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMyNotePronunciationAnalyze } from "../../apis/myNote";
import { invalidateReportQueries } from "../queries/report";

export const usePostMyNotePronunciationAnalyze = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postMyNotePronunciationAnalyze,
    onSuccess: () => {
      invalidateReportQueries(queryClient);
    },
  });
};
