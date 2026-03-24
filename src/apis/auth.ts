import { axiosInstance } from "./axios";
import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
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
  const response = await axiosInstance.post("/auth/login", body);
  console.log(response);
  return response.data;
};

export const postSignout = async (): Promise<ResponseSignoutDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signout");
  return data;
};

export const postReissue = async (): Promise<ResponseReissueDto> => {
  const { data } = await axiosInstance.post("/auth/reissue");
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};
