import type {
  RequestPatchNicknameDto,
  ResponseGetMyProfileDto,
  ResponsePatchNicknameDto,
} from "../types/memberType";
import { axiosInstance } from "./axios";

export const getMyProfile = async (): Promise<ResponseGetMyProfileDto> => {
  const { data } = await axiosInstance.get<ResponseGetMyProfileDto>(
    "/api/mypage/me"
  );
  return data;
};

export const patchMyNickname = async (
  payload: RequestPatchNicknameDto
): Promise<ResponsePatchNicknameDto> => {
  const { data } = await axiosInstance.patch<ResponsePatchNicknameDto>(
    "/api/mypage/me/nickname",
    payload
  );
  return data;
};
