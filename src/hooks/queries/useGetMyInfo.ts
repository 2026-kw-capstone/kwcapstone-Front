import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../../apis/member";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";

export const getMyInfoQueryKey = () => [QUERY_KEY.myInfo] as const;

export const useGetMyInfo = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getMyInfoQueryKey(),
    queryFn: getMyProfile,
    enabled: !!accessToken,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    select: (response) => response.result,
  });
};
