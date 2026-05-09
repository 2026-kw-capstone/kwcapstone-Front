import { useMutation } from "@tanstack/react-query";
import { postMyNotePronunciationAnalyze } from "../../apis/myNote";

export const usePostMyNotePronunciationAnalyze = () => {
  return useMutation({
    mutationFn: postMyNotePronunciationAnalyze,
  });
};
