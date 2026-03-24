import axios from "axios";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import z from "zod";
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostSignin } from "../hooks/mutations/usePostSignin";

type SigninErrorResponse = {
  isSuccess?: boolean;
  code?: string;
  message?: string;
};

const extractSigninErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError<SigninErrorResponse>(error)) {
    return "로그인에 실패했습니다.";
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (typeof data?.message === "string" && data.message.trim().length > 0) {
    return data.message;
  }

  if (status === 401) {
    return "인증되지 않은 요청입니다.";
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
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              이음
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">로그인</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="이메일을 입력해주세요"
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
            placeholder="비밀번호를 입력해주세요"
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

        {loginErrorMessage && (
          <p className="text-sm text-red-500">{loginErrorMessage}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 min-h-12 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        계정이 없으신가요?{" "}
        <Link to="/signup" className="font-semibold text-emerald-600">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Login;
