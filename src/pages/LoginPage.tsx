import axios from "axios";
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { getApiErrorMessage } from "../apis/apiError";
import { usePostSignin } from "../hooks/mutations/usePostSignin";

type SigninErrorResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
};

const extractSigninErrorMessage = (error: any): string => {
  return getApiErrorMessage(error, "로그인에 실패했습니다.");

  if (!axios.isAxiosError<SigninErrorResponse>(error)) {
    return "로그인에 실패했습니다.";
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 401) {
    return "회원가입이 확인되지 않습니다.";
  }

  if (typeof data?.message === "string" && data.message.trim().length > 0) {
    return data.message;
  }

  return "로그인에 실패했습니다.";
};

const schema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
});

type FormFields = z.infer<typeof schema>;

const Login = () => {
  const { mutate: signin, isPending } = usePostSignin();
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isValid },
  } = useForm<FormFields>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const email = watch("email");
  const password = watch("password");

  const canSubmit = useMemo(() => {
    return !!email && !!password && isValid && !isPending;
  }, [email, password, isValid, isPending]);

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setLoginErrorMessage("");

    signin(data, {
      onError: (error) => {
        setLoginErrorMessage(extractSigninErrorMessage(error));
      },
    });
  };

  return (
    <div className="w-full rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="mb-7 flex items-center justify-center">
        <h1 className="text-[24px] font-black tracking-tight text-slate-900">
          로그인
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="이메일을 입력해주세요"
            aria-invalid={!!(touchedFields.email && errors.email)}
            className={`h-[56px] w-full rounded-[18px] border bg-[#F8F9FD] px-5 text-[15.5px] font-medium outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
              touchedFields.email && errors.email
                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-100 focus:border-[#278DFD] focus:ring-blue-100"
            }`}
          />
          {touchedFields.email && errors.email && (
            <p className="mt-2 text-[13px] font-medium text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            aria-invalid={!!(touchedFields.password && errors.password)}
            className={`h-[56px] w-full rounded-[18px] border bg-[#F8F9FD] px-5 text-[15.5px] font-medium outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
              touchedFields.password && errors.password
                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-100 focus:border-[#278DFD] focus:ring-blue-100"
            }`}
          />
          {touchedFields.password && errors.password && (
            <p className="mt-2 text-[13px] font-medium text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {loginErrorMessage && (
          <p className="rounded-[14px] bg-rose-50 px-4 py-3 text-[13px] font-bold text-rose-500">
            {loginErrorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 h-[56px] rounded-[18px] bg-[#278DFD] px-4 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(39,141,253,0.3)] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-6 text-center text-[14px] font-medium text-slate-500">
        계정이 없으신가요?{" "}
        <Link to="/signup" className="font-extrabold text-[#278DFD]">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Login;
