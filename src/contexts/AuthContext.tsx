import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
  accessToken: string | null;
  // refreshToken: string | null;
  isLoggedIn: boolean;
  setAccessToken: (token: string | null) => void;
  // setRefreshToken: (token: string | null) => void;
  login: (params: {
    accessToken: string;
    // refreshToken?: string;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const accessTokenStorage = useLocalStorage<string>(LOCAL_STORAGE_KEY.accessToken);
  // const refreshTokenStorage = useLocalStorage<string>(LOCAL_STORAGE_KEY.refreshToken);

  const [accessTokenState, setAccessTokenState] = useState<string | null>(
    accessTokenStorage.getItem()
  );

  // const [refreshTokenState, setRefreshTokenState] = useState<string | null>(
  //   refreshTokenStorage.getItem()
  // );

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);

    if (token) {
      accessTokenStorage.setItem(token);
    } else {
      accessTokenStorage.removeItem();
    }
  };

  // const setRefreshToken = (token: string | null) => {
  //   setRefreshTokenState(token);
  //
  //   if (token) {
  //     refreshTokenStorage.setItem(token);
  //   } else {
  //     refreshTokenStorage.removeItem();
  //   }
  // };

  const login = ({
    accessToken,
    // refreshToken,
  }: {
    accessToken: string;
    // refreshToken?: string;
  }) => {
    setAccessToken(accessToken);
    // if (refreshToken) setRefreshToken(refreshToken);
  };

  const logout = () => {
    setAccessToken(null);
    // setRefreshToken(null);
  };

  const value: AuthContextType = {
    accessToken: accessTokenState,
    // refreshToken: refreshTokenState,
    isLoggedIn: !!accessTokenState,
    setAccessToken,
    // setRefreshToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }

  return context;
};