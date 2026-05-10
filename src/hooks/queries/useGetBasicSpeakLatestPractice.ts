import { useQuery } from "@tanstack/react-query";
import { getBasicSpeakLatestPractice } from "../../apis/basicSpeak";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";
import type { BasicSpeakTargetVowel } from "../../types/basicSpeakType";

export const getBasicSpeakPracticeQueryKey = (
  targetVowel?: BasicSpeakTargetVowel
) => [QUERY_KEY.basicSpeakPractice, targetVowel] as const;

export const useGetBasicSpeakLatestPractice = (
  targetVowel?: BasicSpeakTargetVowel
) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: getBasicSpeakPracticeQueryKey(targetVowel),
    queryFn: () => getBasicSpeakLatestPractice(targetVowel!),
    enabled: !!accessToken && !!targetVowel,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
