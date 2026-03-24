import { LOCAL_STORAGE_KEY } from "../constants/key";

export const ACCESS_TOKEN_UPDATED_EVENT = "auth:access-token-updated";

const dispatchAccessTokenUpdated = (token: string | null) => {
  window.dispatchEvent(
    new CustomEvent<string | null>(ACCESS_TOKEN_UPDATED_EVENT, {
      detail: token,
    })
  );
};

export const getStoredAccessToken = (): string | null => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (!token) {
    return null;
  }

  try {
    return JSON.parse(token) as string;
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    return null;
  }
};

export const setStoredAccessToken = (token: string) => {
  localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(token));
  dispatchAccessTokenUpdated(token);
};

export const clearStoredAccessToken = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  dispatchAccessTokenUpdated(null);
};
