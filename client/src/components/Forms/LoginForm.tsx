import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import GitHubLoginButton from "../Buttons/OAuth/GitHubLoginButton";
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

interface LoginFormProps {
  onSubmitHandler: any;
  onChangeHandler: (field: string, value: string) => void;
  loginDetails: LoginDetails;
  googleOnSuccessHandler: (response: any) => any;
  googleOnErrorHandler: () => void;
  githubLoginHandler: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmitHandler,
  onChangeHandler,
  loginDetails,
  // googleOnSuccessHandler,
  // googleOnErrorHandler,
  // githubLoginHandler,
}) => {
  const handleChange = (field: string, value: string) => {
    // Assuming onChangeHandler is designed to update the state based on field and value
    onChangeHandler(field, value);
  };

  return (
    <Container className="">
      <Row className="justify-content-md-center">
        {/* <Container className="text-center my-2 d-flex flex-column align-items-center">
          <div className="mb-2 d-flex justify-content-center w-100">
            <GoogleLogin
              onSuccess={googleOnSuccessHandler}
              onError={googleOnErrorHandler}
            />
          </div>

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
        </Container> */}
        <Col md={6}>
          <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter the email given to you on Discord (e.g., jdgraha1@lakeheadu.ca)"
                value={loginDetails.email.value}
                onChange={(e) => handleChange("email", e.target.value)}
                isInvalid={
                  !loginDetails.email.valid && loginDetails.email.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Enter the email that given to you on Discord
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter the password given to you on Discord (e.g., pass1)"
                value={loginDetails.password.value}
                onChange={(e) => handleChange("password", e.target.value)}
                isInvalid={
                  !loginDetails.password.valid && loginDetails.password.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Enter the password that was given to you on Discord
              </Form.Control.Feedback>
            </Form.Group>
            <Container>
              {/* <Row className="justify-content-center my-3">
                <Col xs="auto">
                  <Link to="/register" className="btn btn-link">
                    Create an account instead.
                  </Link>
                </Col>
              </Row> */}

              <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                  <Button
                    className="d-flex align-items-center justify-content-center w-100"
                    variant="primary"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faRightToBracket} className="me-2" />
                    Login
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
