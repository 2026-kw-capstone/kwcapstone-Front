import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { useAuth } from "../../contexts/AuthContext";

export const usePostSignin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: postSignin,
    onSuccess: (response) => {
      const accessToken = response.data.accessToken;

      login({
        accessToken,
        // refreshToken: response.data.refreshToken,
      });

      window.location.href = "/";
    },
    onError: (error) => {
      console.error("로그인 실패", error);
      alert("로그인에 실패했습니다.");
    },
  });
};