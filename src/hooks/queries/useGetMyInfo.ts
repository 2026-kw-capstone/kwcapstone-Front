import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";

export const useGetMyInfo = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    select: (response) => response.result,
  });
};
