import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import LoginForm from "../../components/Forms/LoginForm";
import { AuthContext } from "../../contexts/AuthContext";

import { OAuthCreds } from "../../../config";
import { loginUser } from "../../services/users/index";

const Login = () => {
  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: {
      valid: false,
      touched: false,
      value: "",
    },
    password: {
      valid: false,
      touched: false,
      value: "",
    },
  });

  useEffect(() => {
    if (authCtx?.userAuthDetails.refreshToken != "") {
      navigate("/");
    }
  }, [authCtx?.userAuthDetails.refreshToken]);

  const onChangeHandler = (field: string, value: string) => {
    let isValid = true; // Default to true, adjust based on validation
    // Basic validation rules
    switch (field) {
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Example: simple email regex
        break;
      case "password":
        isValid = value.length >= 8; // Example: valid if length is 8 or more
        break;

      default:
        break;
    }

    // Update state with new value and validation result
    setLoginForm((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value: value,
        valid: isValid,
        touched: true,
      },
    }));
  };

  const googleOnSuccessHandler = (credentialResponse) => {
    console.log(credentialResponse);
  };

  const googleOnErrorHandler = () => {
    console.log("Login Failed");
  };

  const githubLoginHandler = () => {
    const clientID = OAuthCreds.github.clientID;
    const redirectURI = encodeURIComponent(OAuthCreds.github.redirectURL);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=user&state=tokenAuthorizationStudentHelperBot`;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    let formIsValid = true;
    const updatedFormState = {};

    for (const field in loginForm) {
      if (!loginForm[field].valid) {
        formIsValid = false;
      }

      updatedFormState[field] = {
        ...loginForm[field],
        touched: true,
      };
    }

    setLoginForm(updatedFormState);

    if (formIsValid) {
      console.log("Form is valid. Submitting data...", loginForm);
      // Handle form submission, e.g., sending data to a server

      const response = await loginUser(loginForm);

      const userData = {
        id: response.data.body.id,
        email: response.data.body.email,
        username: response.data.body.username,
        refreshToken: response.data.body.refreshToken,
      };

      authCtx?.login(userData);
    } else {
      console.log("Form is invalid. Please correct the errors.");
    }
  };

  return (
    <>
      <Container className="text-center my-5">
        <h4>Welcome Back!</h4>
      </Container>

      <Container className="">
        <LoginForm
          onSubmitHandler={onSubmitHandler}
          onChangeHandler={onChangeHandler}
          loginDetails={loginForm}
          googleOnSuccessHandler={googleOnSuccessHandler}
          googleOnErrorHandler={googleOnErrorHandler}
          githubLoginHandler={githubLoginHandler}
        />
      </Container>
    </>
  );
};

export default Login;
