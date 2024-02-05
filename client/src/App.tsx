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
import Layout from "./components/Layout/Layout";
import DefaultLayout from "./screens/layout/DefaultLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Auth/Register";

// Components
import GitHubOAuthRedirect from "./components/Auth/GithubAuth";

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
        path: "dashboard/",
        element: <LandingPage />,
      },
      { path: "register", element: <Register /> },
      { path: "login", element: <LoginPage /> },
    ],
  },

  {
    path: "*",
    element: <LandingPage />,
    children: [
      {
        path: "*",
        element: <LandingPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

/* <Routes>
        <Route
          path="/login"
          element={
            <Layout
              pageTitle="My page title"
              pageLayoutContent={<LoginPage />}
            />
          }
        />
        <Route
          path="/"
          element={
            <Layout
              pageTitle="My page title"
              pageLayoutContent={<LandingPage />}
            />
          }
        />
      </Routes> */
