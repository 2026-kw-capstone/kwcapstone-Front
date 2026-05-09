import { useQuery } from "@tanstack/react-query";
import { getMyNoteSentences } from "../../apis/myNote";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";

export const useGetMyNoteSentences = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEY.myNoteSentences],
    queryFn: getMyNoteSentences,
    enabled: !!accessToken,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
