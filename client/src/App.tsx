import {
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./assets/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Config
import { OAuthCreds } from "../config.js";
// Context
import AuthProvider from "./contexts/AuthContext";

// Layouts
// import Layout from "./components/Layout/Layout";
import DefaultLayout from "./screens/layout/DefaultLayout";

// Pages
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import CommandsPage from "./pages/CommandsPage.js";

// Components
import GitHubOAuthRedirect from "./components/Auth/GithubAuth";
import SupportPage from "./components/LoginForm/LoginForm.js";
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
        path: "register", 
        element: <Register /> 
      },
      { 
        path: "login", 
        element: <Login /> 
      },
      { 
        path: 'dashboard',
        element: <DashboardPage isUserLoggedIn={false} />
      },
      {
        path: 'commands',
        element: <CommandsPage />
      },
      {
        path: 'logs',
        element: <LogsPage />
      },
      {
        path: 'configurations',
        element: <ConfigurationsPage />
      },
      {
        path: "home",
        element: <LandingPage isUserLoggedIn={false}/>
      },
      {
        path: "support",
        element: <SupportPage />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
