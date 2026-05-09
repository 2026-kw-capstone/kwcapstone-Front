import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyNoteSentence } from "../../apis/myNote";
import { QUERY_KEY } from "../../constants/key";
import type { MyNoteSentenceItem } from "../../types/myNoteType";

type DeleteMyNoteSentenceContext = {
  previousSentences?: MyNoteSentenceItem[];
};

export const useDeleteMyNoteSentence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyNoteSentence,
    onMutate: async (sentenceId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.myNoteSentences],
      });

      const previousSentences = queryClient.getQueryData<MyNoteSentenceItem[]>([
        QUERY_KEY.myNoteSentences,
      ]);

      queryClient.setQueryData<MyNoteSentenceItem[]>(
        [QUERY_KEY.myNoteSentences],
        (previous) =>
          previous?.filter((sentence) => sentence.sentenceId !== sentenceId) ??
          previous
      );

      return { previousSentences } satisfies DeleteMyNoteSentenceContext;
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        [QUERY_KEY.myNoteSentences],
        context?.previousSentences
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myNoteSentences],
      });
    },
  });
};
