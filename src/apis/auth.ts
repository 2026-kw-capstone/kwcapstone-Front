import { axiosInstance } from "./axios";
import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseReissueDto,
  ResponseSigninDto,
  ResponseSignoutDto,
  ResponseSignupDto,
} from "../types/authType";

export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/auth/signup", body);
  return data;
};

export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/auth/login", body);
  return data;
};

export const postSignout = async (): Promise<ResponseSignoutDto> => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

export const postReissue = async (): Promise<ResponseReissueDto> => {
  const { data } = await axiosInstance.post("/auth/reissue");
  return data;
};

// TODO: Restore this after the backend exposes GET /auth/myinfo.
// export const getMyInfo = async (): Promise<Member> => {
//   const { data } = await axiosInstance.get("/auth/myinfo");
//   return data.result;
// };
