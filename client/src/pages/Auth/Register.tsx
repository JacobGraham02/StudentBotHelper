import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import RegisterForm from "../../components/Forms/RegisterForm";
import { AuthContext } from "../../contexts/AuthContext";

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

  const onSubmitHandler = () => {};

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
        />
      </Container>
    </>
  );
};

export default Register;
