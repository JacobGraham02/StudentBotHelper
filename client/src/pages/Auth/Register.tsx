import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
    if (authCtx?.userAuthDetails.token != "") {
      navigate("/");
    }
  }, [authCtx?.userAuthDetails.token]);

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
    // Initialize updatedFormState with the current state
    const updatedFormState = { ...registerForm };

    // Check if the form is valid
    for (const field in registerForm) {
      if (!registerForm[field].valid) {
        formIsValid = false;
        updatedFormState[field].touched = true; // Mark as touched to show validation feedback
      }
    }

    // Update the form state to trigger validation feedback
    setRegisterForm(updatedFormState);

    if (formIsValid) {
      try {
        // Attempt to register the user
        const userInfo = {
          fullName: registerForm.fullName.value,
          email: registerForm.email.value,
          password: registerForm.password.value,
          confirmPassword: registerForm.confirmPassword.value,
        };

        await registerUser(userInfo);

        toast.success("Registration successful!");

        // redirect to login page.
        navigate("/login");
      } catch (error) {
        // Display an error toast if registration fails
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        console.error(error);
        toast.error(errorMessage);
      }
    } else {
      toast.error("Form is invalid. Please correct the errors and try again.");
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
