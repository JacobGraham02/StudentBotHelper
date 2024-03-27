import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import LoginForm from "../../components/Forms/LoginForm";
import { AuthContext } from "../../contexts/AuthContext";

import { OAuthCreds } from "../../../config";
import { loginUser } from "../../services/users/index";
import { getBot } from "../../services/bot";

const Login = () => {
  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState<any>({
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
    if (authCtx?.userAuthDetails.token != "") {
      navigate("/");
    }
  }, [authCtx?.userAuthDetails.token, navigate]);

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
    setLoginForm((prevState: any) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value: value,
        valid: isValid,
        touched: true,
      },
    }));
  };

  const googleOnSuccessHandler = (credentialResponse: any) => {
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

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    let formIsValid = true;
    const updatedFormState: any = {};

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
      const loginData = {
        email: loginForm.email.value,
        password: loginForm.password.value,
      };

      try {
        const response = await loginUser(loginData);
        const bot = await getBot(loginData.email);

        const userData = {
          id: response.user.id,
          token: response.user.token,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          bot: bot.data,
        };

        // Log the user in
        authCtx?.login(userData);
        toast.success("Login successful!");
      } catch (error: any) {
        const statusCode = error.response?.status || 500;
        if (statusCode === 401) {
          toast.error("Invalid credentials. Please try again.");
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      }
    } else {
      console.log("Form is invalid. Please correct the errors.");
      toast.warn("Form is invalid. Please correct the errors and try again.");
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
