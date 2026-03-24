export type CommonResponse<T> = {
  status: number;
  message: string;
  data: T;
}

// 회원가입
export type RequestSignupDto = {
  email: string;
  password: string;
  name: string;
}

export type ResponseSignupDto = CommonResponse<{
    id: number | string;
    email: string;
    name: string;
}>

// 로그인
export type RequestSigninDto = {
  email: string;
  password: string;
}

export type ResponseSigninDto = CommonResponse<{
    accessToken: string;
    // refreshToken?: string;
}>;

// 액세스 토큰 재발급
export type ResponseReissueDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
  };
};

// 로그아웃
export type ResponseSignoutDto = CommonResponse<{
    success: boolean;
}>;

// 내 정보 조회
export type ResponseMyInfoDto = CommonResponse<{
    id: number | string;
    email: string;
    name: string;
}>;
