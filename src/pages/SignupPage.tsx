import axios from "axios";
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { getApiErrorMessage } from "../apis/apiError";
import { postSignup } from "../apis/auth";

type SignupErrorResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: string | Record<string, string> | null;
};

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호 확인은 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호 확인은 20자 이하여야 합니다." }),
    nickname: z.string().min(1, { message: "닉네임을 입력해 주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const extractSignupErrorMessage = (error: any): string => {
  return getApiErrorMessage(error, "회원가입에 실패했습니다.");

  if (!axios.isAxiosError<SignupErrorResponse>(error)) {
    return "회원가입에 실패했습니다.";
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 409) {
    return data?.message ?? "이미 존재하는 이메일입니다.";
  }

  if (status === 400) {
    if (typeof data?.result === "string") {
      return data.result;
    }

    if (data?.result && typeof data.result === "object") {
      const firstMessage = Object.values(data.result)[0];
      if (firstMessage) {
        return String(firstMessage);
      }
    }

    return data?.message ?? "입력값이 올바르지 않습니다.";
  }

  return data?.message ?? "회원가입에 실패했습니다.";
};

const Signup = () => {
  const navigate = useNavigate();
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isValid, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
      nickname: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const email = watch("email");
  const password = watch("password");
  const passwordCheck = watch("passwordCheck");
  const nickname = watch("nickname");

  const canSubmit = useMemo(() => {
    return (
      !!email &&
      !!password &&
      !!passwordCheck &&
      !!nickname &&
      isValid &&
      !isSubmitting &&
      !isSubmittingApi
    );
  }, [email, password, passwordCheck, nickname, isValid, isSubmitting, isSubmittingApi]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const body = {
      email: data.email,
      password: data.password,
      nickname: data.nickname,
    };

    try {
      setIsSubmittingApi(true);
      await postSignup(body);
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패", error);
      alert(extractSignupErrorMessage(error));
    } finally {
      setIsSubmittingApi(false);
    }
  };

  return (
    <div className="w-full rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="mb-7 flex items-center justify-center">
        <h1 className="text-[24px] font-black tracking-tight text-slate-900">
          회원가입
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="이메일을 입력해 주세요"
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
            placeholder="비밀번호를 입력해 주세요"
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

        <div>
          <input
            {...register("passwordCheck")}
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            aria-invalid={!!(touchedFields.passwordCheck && errors.passwordCheck)}
            className={`h-[56px] w-full rounded-[18px] border bg-[#F8F9FD] px-5 text-[15.5px] font-medium outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
              touchedFields.passwordCheck && errors.passwordCheck
                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-100 focus:border-[#278DFD] focus:ring-blue-100"
            }`}
          />
          {touchedFields.passwordCheck && errors.passwordCheck && (
            <p className="mt-2 text-[13px] font-medium text-rose-500">
              {errors.passwordCheck.message}
            </p>
          )}
        </div>

        <div>
          <input
            {...register("nickname")}
            type="text"
            placeholder="닉네임을 입력해 주세요"
            aria-invalid={!!(touchedFields.nickname && errors.nickname)}
            className={`h-[56px] w-full rounded-[18px] border bg-[#F8F9FD] px-5 text-[15.5px] font-medium outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
              touchedFields.nickname && errors.nickname
                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-100 focus:border-[#278DFD] focus:ring-blue-100"
            }`}
          />
          {touchedFields.nickname && errors.nickname && (
            <p className="mt-2 text-[13px] font-medium text-rose-500">
              {errors.nickname.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 h-[56px] rounded-[18px] bg-[#278DFD] px-4 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(39,141,253,0.3)] transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isSubmittingApi ? "처리 중..." : "회원가입"}
        </button>
      </form>

      <div className="mt-6 text-center text-[14px] font-medium text-slate-500">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="font-extrabold text-[#278DFD]">
          로그인
        </Link>
      </div>
    </div>
  );
};

export default Signup;
