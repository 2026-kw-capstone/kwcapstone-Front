export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type RequestSignupDto = {
  email: string;
  password: string;
  nickname: string;
};

export type Member = {
  memberId: number;
  email: string;
  nickname: string;
};

export type ResponseSignupDto = ApiResponse<Member>;

export type RequestSigninDto = {
  email: string;
  password: string;
};

export type ResponseSigninDto = ApiResponse<{
  accessToken: string;
  member: Member;
}>;

export type ResponseReissueDto = ApiResponse<{
  accessToken: string;
}>;

export type ResponseSignoutDto = ApiResponse<{
  success: boolean;
}>;

export type ResponseMyInfoDto = ApiResponse<{
  id: number | string;
  email: string;
  name: string;
}>;
