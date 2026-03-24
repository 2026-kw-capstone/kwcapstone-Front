import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { useMemo, useState } from "react";
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

const extractSignupErrorMessage = (error: unknown): string => {
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
        return firstMessage;
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
    const { passwordCheck: _passwordCheck, ...body } = data;

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
    <div className="w-full rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-8">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-3 rounded-2xl transition hover:opacity-90"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 shadow-md shadow-emerald-200">
              <MessageCircle className="fill-white text-white" size={28} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">이음</span>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">회원가입</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="이메일을 입력해 주세요"
            className={`min-h-12 w-full rounded-xl border px-4 py-3 text-base outline-none transition ${
              touchedFields.email && errors.email
                ? "border-red-500"
                : "border-slate-300 focus:border-emerald-500"
            }`}
          />
          {touchedFields.email && errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            className={`min-h-12 w-full rounded-xl border px-4 py-3 text-base outline-none transition ${
              touchedFields.password && errors.password
                ? "border-red-500"
                : "border-slate-300 focus:border-emerald-500"
            }`}
          />
          {touchedFields.password && errors.password && (
            <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("passwordCheck")}
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            className={`min-h-12 w-full rounded-xl border px-4 py-3 text-base outline-none transition ${
              touchedFields.passwordCheck && errors.passwordCheck
                ? "border-red-500"
                : "border-slate-300 focus:border-emerald-500"
            }`}
          />
          {touchedFields.passwordCheck && errors.passwordCheck && (
            <p className="mt-2 text-sm text-red-500">{errors.passwordCheck.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("nickname")}
            type="text"
            placeholder="닉네임을 입력해 주세요"
            className={`min-h-12 w-full rounded-xl border px-4 py-3 text-base outline-none transition ${
              touchedFields.nickname && errors.nickname
                ? "border-red-500"
                : "border-slate-300 focus:border-emerald-500"
            }`}
          />
          {touchedFields.nickname && errors.nickname && (
            <p className="mt-2 text-sm text-red-500">{errors.nickname.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 min-h-12 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSubmittingApi ? "처리 중..." : "회원가입"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="font-semibold text-emerald-600">
          로그인
        </Link>
      </div>
    </div>
  );
};

export default Signup;
