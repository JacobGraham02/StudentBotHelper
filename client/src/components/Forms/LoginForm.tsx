import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import GitHubLoginButton from "../Buttons/OAuth/GitHubLoginButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

type LoginDetails = {
  email: {
    touched: boolean;
    valid: boolean;
    value: string;
  };
  password: {
    touched: boolean;
    valid: boolean;
    value: string;
  };
};

const LoginForm = ({
  onSubmitHandler,
  onChangeHandler,
  loginDetails,
  googleOnSuccessHandler,
  googleOnErrorHandler,
  githubLoginHandler,
}) => {
  const handleChange = (field: string, value: string) => {
    // Assuming onChangeHandler is designed to update the state based on field and value
    onChangeHandler(field, value);
  };

  return (
    <Container className="">
      <Row className="justify-content-md-center">
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
        <Col md={6}>
          <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={loginDetails.email.value}
                onChange={(e) => handleChange("email", e.target.value)}
                isInvalid={
                  !loginDetails.email.valid && loginDetails.email.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={loginDetails.password.value}
                onChange={(e) => handleChange("password", e.target.value)}
                isInvalid={
                  !loginDetails.password.valid && loginDetails.password.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password (longer than 8 characters).
              </Form.Control.Feedback>
            </Form.Group>

            <Container
              className="d-flex justify-content-center align-items-center"
              style={{ height: "40px", width: "240px" }}
            >
              <Button
                className="d-flex align-items-center justify-content-center w-100"
                variant="primary"
                type="submit"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="me-2" />
                Login
              </Button>
            </Container>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
