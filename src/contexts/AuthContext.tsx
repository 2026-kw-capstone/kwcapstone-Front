import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  ACCESS_TOKEN_UPDATED_EVENT,
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from "../hooks/accessToken";

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
  const [accessTokenState, setAccessTokenState] = useState<string | null>(
    getStoredAccessToken()
  );

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);

    if (token) {
      setStoredAccessToken(token);
    } else {
      clearStoredAccessToken();
    }
  };

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

  useEffect(() => {
    const handleAccessTokenUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<string | null>;
      setAccessTokenState(customEvent.detail);
    };

    window.addEventListener(ACCESS_TOKEN_UPDATED_EVENT, handleAccessTokenUpdated);

    return () => {
      window.removeEventListener(
        ACCESS_TOKEN_UPDATED_EVENT,
        handleAccessTokenUpdated
      );
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }

  return context;
};
