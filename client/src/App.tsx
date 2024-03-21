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
import ConfigurationsOptionsPage from "./pages/bot/ConfigurationOptionsPage.js";
import CommandsPage from "./pages/CommandsPage.js";

// Components
import GitHubOAuthRedirect from "./components/Auth/GithubAuth";
import SupportPage from "./components/LoginForm/LoginForm.js";
import Dashboard from "./pages/Dashboard.js";
import LogsPage from "./pages/LogsPage.js";
import ConfigurationsPage from "./pages/ConfigurationOptionsPage.js";
import DashboardPage from "./pages/DashboardPage.js";
import LandingPage from "./pages/LandingPage.js";

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
        path: 'dashboard',
        element: <DashboardPage isUserLoggedIn={false} />
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
        path: 'logs',
        element: <LogsPage />
      },
      {
        path: 'configurations',
        element: <ConfigurationsPage />
      },
      {
        path: "configurations",
        element: (
          <ProtectedRoute>
            <ConfigurationsOptionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "support",
        element: <SupportPage isUserLoggedIn={false} />,
      },
        element: <SupportPage />
      }
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
