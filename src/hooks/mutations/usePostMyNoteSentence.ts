import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMyNoteSentence } from "../../apis/myNote";
import { QUERY_KEY } from "../../constants/key";
import type { MyNoteSentenceItem } from "../../types/myNoteType";

export const usePostMyNoteSentence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sentenceContent: string) =>
      postMyNoteSentence({ sentenceContent }),
    onSuccess: (response) => {
      queryClient.setQueryData<MyNoteSentenceItem[]>(
        [QUERY_KEY.myNoteSentences],
        (previous) => [response.result, ...(previous ?? [])]
      );

      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myNoteSentences],
      });
    },
  });
};
