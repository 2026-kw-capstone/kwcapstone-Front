import type { ApiResponse } from "./authType";

export interface MemberProfileDto {
  memberId: number;
  email: string;
  nickname: string;
}

export interface RequestPatchNicknameDto {
  nickname: string;
}

export type ResponseGetMyProfileDto = ApiResponse<MemberProfileDto>;

export type ResponsePatchNicknameDto = ApiResponse<{
  nickname: string;
}>;
