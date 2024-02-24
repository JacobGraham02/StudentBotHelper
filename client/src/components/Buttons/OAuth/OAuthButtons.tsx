import React from "react";

const OAuthButtons = () => {
  return (
    <>
      <Container className="text-center my-2 d-flex flex-column align-items-center">
        <div className="mb-2 d-flex justify-content-center w-100">
          <GoogleLogin
            onSuccess={googleOnSuccessHandler}
            onError={googleOnErrorHandler}
          />
        </div>
        {/* Line Separator with "or" in the middle */}
        <div className="separator d-flex align-items-center my-1">
          <div className="line"></div>
          <span className="px-2">or</span>
          <div className="line"></div>
        </div>

        <div className="my-2 d-flex justify-content-center w-100">
          <GitHubLoginButton
            githubLoginHandler={githubLoginHandler}
            text={"Login with GitHub"}
          />
        </div>
      </Container>
    </>
  );
};

export default OAuthButtons;
