import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const GitHubOAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code) {
      // Here you would typically send 'code' to your backend to exchange it for an access token
      console.log("OAuth Code:", code);
      // Optional: Verify the 'state' parameter matches the one you sent in the auth request for CSRF protection

      if (state === "tokenAuthorizationStudentHelperBot") {

      })

      // Redirect the user to another page after handling the code, or show a success message, etc.
      navigate("/"); // Redirecting to home page for example
    } else {
      // Handle the case where there is no code in the URL
      console.error("GitHub OAuth redirect did not include a code.");
      navigate("/register"); // Redirecting to home page or an error page
    }
  }, [location, navigate]);

  // Render a loading message or nothing at all, since this page should handle the redirect quickly
  return <div>Loading...</div>;
};

export default GitHubOAuthRedirect;
