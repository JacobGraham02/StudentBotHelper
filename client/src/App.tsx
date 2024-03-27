import {
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./assets/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Config
import { OAuthCreds } from "../config.js";
// Context
import AuthProvider from "./contexts/AuthContext";

// Layouts
// import Layout from "./components/Layout/Layout";
import DefaultLayout from "./screens/layout/DefaultLayout";

// Utils
import { ProtectedRoute } from "./utils/ProtectedRoute.js";

// Pages
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import CommandsPage from "./pages/bot/CommandsPage.js";
import ConfigurationsPage from "./pages/bot/ConfigurationOptionsPage.js";

// Components
import GitHubOAuthRedirect from "./components/Auth/GithubAuth";
import SupportPage from "./components/LoginForm/LoginForm.js";
import Dashboard from "./pages/Dashboard.js";
import LogsPage from "./pages/LogsPage.js";
import DashboardPage from "./pages/DashboardPage.js";
import LandingPage from "./pages/LandingPage.js";
import ProfilePage from "./pages/ProfilePage.js";
import CommandPage from "./pages/CommandPage.js";

const GoogleClientID = OAuthCreds.google.clientID;

// Create router.
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GoogleOAuthProvider clientId={GoogleClientID}>
        <AuthProvider>
          <DefaultLayout />
        </AuthProvider>
      </GoogleOAuthProvider>
    ),
    children: [
      {
        path: "oauth/github",
        element: <GitHubOAuthRedirect />,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "register", 
        element: <Register /> 
      },
      {
        path: "profile", 
        element: (
          <ProtectedRoute>
            <ProfilePage isUserLoggedIn={true} /> 
          </ProtectedRoute>
        ),
      },
      { 
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage isUserLoggedIn={true} />
          </ProtectedRoute>
        )
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "commands",
        element: (
          <ProtectedRoute>
            <CommandsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "command",
        element: <CommandPage isUserLoggedIn={true} />
      },
      {
        path: 'logs',
        element: (
          <ProtectedRoute>
            <LogsPage />
          </ProtectedRoute>
        )
      },
      {
        path: "configurations",
        element: (
          <ProtectedRoute>
            <ConfigurationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'home',
        element: (
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "support",
        element: (
          <ProtectedRoute>
            <SupportPage />,
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
