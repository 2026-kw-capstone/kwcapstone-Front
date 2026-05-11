export type ApiErrorAction =
  | "redirectLogin"
  | "inline"
  | "retry"
  | "toast"
  | "silentRefresh";

export type ApiFailureResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: string | Record<string, string> | null;
  clientRequestId?: string | null;
};

export type NormalizedApiError = {
  status: number | null;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  action: ApiErrorAction;
  raw?: unknown;
};
