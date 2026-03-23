import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import HomePage from './pages/HomePage';
import RootLayout from './layouts/RootLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import WarmupPage from './pages/warmup/WarmupPage';
import MyNotePage from './pages/warmup/MyNotePage';
import BasicSpeakPracticePage from './pages/warmup/BasicSpeakPracticePage';
import BasicSpeakPage from './pages/warmup/BasicSpeakPage';
import ScenarioPage from './pages/scenario/ScenarioPage';
import FreeConversationPage from './pages/FreeConversationPage';
import ReportPage from './pages/ReportPage';
import MyPage from './pages/MyPage';
import ScenarioLevelSelectPage from './pages/scenario/ScenarioLevelSelectPage';
import ScenarioPracticePage from './pages/scenario/ScenarioPracticePage';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PracticeSelectPage from './pages/PracticeSelectPage';
import { AuthProvider } from './contexts/AuthContext';
import NotFound from './pages/NotFound';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {index: true, element: <HomePage />},
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
            element: <FreeConversationPage />,
          },
        ],
      },
      { path: "report", element: <ReportPage /> },
      { path: "mypage", element: <MyPage /> },
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
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
