export type CommonResponse<T> = {
  status: number;
  message: string;
  data: T;
};
};

export type RequestSignupDto = {
  email: string;
  password: string;
  nickname: string;
};
  nickname: string;
};

export type ResponseSignupDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
export type ResponseSignupDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
};
    nickname: string;
  };
};

export type RequestSigninDto = {
  email: string;
  password: string;
};
};

export type ResponseSigninDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    member: {
      memberId: number;
      email: string;
      nickname: string;
    };
  };
};

export type ResponseReissueDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
  };
};

export type ResponseSignoutDto = CommonResponse<{
  success: boolean;
  success: boolean;
}>;

export type ResponseMyInfoDto = CommonResponse<{
  id: number | string;
  email: string;
  name: string;
  id: number | string;
  email: string;
  name: string;
}>;
