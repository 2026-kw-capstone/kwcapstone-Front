import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyNickname } from "../../apis/member";
import type { ResponseGetMyProfileDto } from "../../types/memberType";
import { getMyInfoQueryKey } from "../queries/useGetMyInfo";

export const usePatchNickname = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: patchMyNickname,
    onSuccess: (response) => {
      queryClient.setQueryData<ResponseGetMyProfileDto | undefined>(
        getMyInfoQueryKey(),
        (previous) =>
          previous
            ? {
                ...previous,
                result: {
                  ...previous.result,
                  nickname: response.result.nickname,
                },
              }
            : previous
      );
      void queryClient.invalidateQueries({
        queryKey: getMyInfoQueryKey(),
      });
    },
  });

  return {
    ...mutation,
    changeNickname: mutation.mutateAsync,
  };
};
