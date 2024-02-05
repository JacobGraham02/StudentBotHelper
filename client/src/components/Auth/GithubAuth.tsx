import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { OAuthCreds } from "../../../config";
import { requestUserGithub } from "../../services/users";
const GitHubOAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const stateVerification = OAuthCreds.github.state;

    if (code && state === stateVerification) {
      (async () => {
        try {
          const userCreds = await requestUserGithub(code);
          console.log(userCreds);

          const user = {
            id: userCreds.id,
            username: userCreds.username,
            email: userCreds.email,
            refreshToken: userCreds.refreshToken,
          };
          authCtx?.login({ ...user });
          navigate("/");
        } catch (error) {
          console.error("Unable to retrieve Github User:", error);
          navigate("/register");
        }
      })();
    } else {
      console.error("GitHub OAuth redirect did not include a code.");
      navigate("/register");
    }
  }, [location, navigate, authCtx]);

  return <div>Loading...</div>;
};

export default GitHubOAuthRedirect;
