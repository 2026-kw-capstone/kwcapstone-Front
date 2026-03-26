import { MessageCircle } from "lucide-react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

const NotFound = () => {
  const error = useRouteError();

  let detail = "페이지를 불러오는 중 문제가 발생했습니다.";

  if (isRouteErrorResponse(error)) {
    detail = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFB] px-6 text-slate-900">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Link to="/" className="mx-auto mb-6 inline-flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 shadow-md shadow-emerald-200">
            <MessageCircle className="fill-white text-white" size={22} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">이음</span>
        </Link>

        <p className="text-2xl font-bold">페이지 로딩 중 오류가 발생했습니다.</p>
        <p className="mt-3 break-words text-sm text-slate-600">{detail}</p>
        <p className="mt-1 text-sm text-slate-500">로고를 누르면 홈으로 이동합니다.</p>
      </section>
    </main>
  );
};

export default NotFound;
