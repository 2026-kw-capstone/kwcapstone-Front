import { useMutation } from "@tanstack/react-query";
import { postSignout } from "../../apis/auth";
import { useAuth } from "../../contexts/AuthContext";

export const usePostSignout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: postSignout,
    onSuccess: () => {
      logout();
      window.location.href = "/";
    },
    onError: (error) => {
      console.error("로그아웃 실패", error);
      logout();
      window.location.href = "/";
    },
  });
};