import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import RegisterForm from "../../components/Forms/RegisterForm";
import { AuthContext } from "../../contexts/AuthContext";

import { OAuthCreds } from "../../../config";
import { registerUser } from "../../services/users/index";

const Register = () => {
  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    fullName: {
      valid: false,
      touched: false,
      value: "",
    },
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
    confirmPassword: {
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
      case "fullName":
        // Allows letters, spaces, apostrophes, and hyphens. Adjust the regex as needed.
        isValid =
          /^[A-Za-z\s'-]+$/.test(value.trim()) && value.trim().length > 0;
        break;

      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Example: simple email regex
        break;
      case "password":
        isValid = value.length >= 8; // Example: valid if length is 8 or more
        break;
      case "confirmPassword":
        isValid = value === registerForm.password.value; // Match with password
        break;
      default:
        break;
    }

    // Update state with new value and validation result
    setRegisterForm((prevState) => ({
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

    for (const field in registerForm) {
      if (!registerForm[field].valid) {
        formIsValid = false;
      }

      updatedFormState[field] = {
        ...registerForm[field],
        touched: true,
      };
    }

    setRegisterForm(updatedFormState);

    if (formIsValid) {
      console.log("Form is valid. Submitting data...", registerForm);
      // Handle form submission, e.g., sending data to a server

      const response = await registerUser(registerForm);

      const userData = {
        id: response.data.body.id,
        email: response.data.body.email,
        username: response.data.body.username,
        password: response.data.body.password,
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
        <h4>Register Today!</h4>
        <p className="text-center">
          Below you will find a form to register for our application.
        </p>
      </Container>

      <Container className="">
        <RegisterForm
          onSubmitHandler={onSubmitHandler}
          onChangeHandler={onChangeHandler}
          registerDetails={registerForm}
          googleOnSuccessHandler={googleOnSuccessHandler}
          googleOnErrorHandler={googleOnErrorHandler}
          githubLoginHandler={githubLoginHandler}
        />
      </Container>
    </>
  );
};

export default Register;
