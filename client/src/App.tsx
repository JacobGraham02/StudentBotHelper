import {
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./assets/styles.css";

// Context
import AuthProvider from "./contexts/AuthContext";

// Layouts
import Layout from "./components/Layout/Layout";
import DefaultLayout from "./screens/layout/DefaultLayout";
// Pages
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Auth/Register";

// Create router.
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <DefaultLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <div>hi</div>,
      },
      {
        path: "dashboard/",
        element: <LandingPage />,
      },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <LoginPage /> },
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
