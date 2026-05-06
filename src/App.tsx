import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import RootLayout from './layouts/RootLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import AuthLayout from './layouts/AuthLayout';
import { AuthProvider } from './contexts/AuthContext';
import { RecordProvider } from './contexts/RecordContext';
import NotFound from './pages/NotFound';

const HomePage = lazy(() => import('./pages/HomePage'));
const MyPage = lazy(() => import('./pages/MyPage'));
const WarmupPage = lazy(() => import('./pages/warmup/WarmupPage'));
const MyNotePage = lazy(() => import('./pages/warmup/MyNotePage'));
const BasicSpeakPage = lazy(() => import('./pages/warmup/BasicSpeakPage'));
const BasicSpeakPracticePage = lazy(
  () => import('./pages/warmup/BasicSpeakPracticePage')
);
const PracticeSelectPage = lazy(() => import('./pages/PracticeSelectPage'));
const ScenarioPage = lazy(() => import('./pages/scenario/ScenarioPage'));
const ScenarioLevelSelectPage = lazy(
  () => import('./pages/scenario/ScenarioLevelSelectPage')
);
const ScenarioPracticePage = lazy(
  () => import('./pages/scenario/ScenarioPracticePage')
);
const FreeConversationListPage = lazy(
  () => import('./pages/free-conversation/FreeConversationListPage')
);
const FreeConversationChatPage = lazy(
  () => import('./pages/free-conversation/FreeConversationChatPage')
);
const ReportPage = lazy(() => import('./pages/ReportPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {index: true, element: <HomePage />},
      { path: "mypage", element: <MyPage /> },
    ]
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "warmup",
        element: <WarmupPage />,
        children: [
          { path: "my-note", element: <MyNotePage /> },
          {
            path: "basic-speak",
            children: [
              { index: true, element: <BasicSpeakPage /> },
              { path: ":cardId", element: <BasicSpeakPracticePage /> },
            ],
          },
        ],
      },
      {
        path: "ai-practice",
        children: [
          { index: true, element: <PracticeSelectPage /> },
          {
            path: "scenario",
            element: <ScenarioPage />,
            children: [
              {
                path: ":scenarioId",
                element: <ScenarioLevelSelectPage />,
                children: [
                  {
                    path: "level/:level",
                    element: <ScenarioPracticePage />,
                  },
                ],
              },
            ],
          },
          {
            path: "free-conversation",
            children: [
              { index: true, element: <FreeConversationListPage /> },
              { path: "chat/new", element: <FreeConversationChatPage /> },
              { path: "chat/:conversationId", element: <FreeConversationChatPage /> },
            ],
          },
        ],
      },
      { path: "report", element: <ReportPage /> },
    ],
  },
];

const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
];

const router = createBrowserRouter([
  ...routes,
  ...protectedRoutes,
  ...authRoutes
]);

export const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RecordProvider>
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
        </RecordProvider>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
