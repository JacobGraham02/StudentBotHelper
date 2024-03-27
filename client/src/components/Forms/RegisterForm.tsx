import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import GitHubLoginButton from "../Buttons/OAuth/GitHubLoginButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

type RegisterDetails = {
  fullName: {
    touched: boolean;
    valid: boolean;
    value: string;
  };
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
  confirmPassword: {
    touched: boolean;
    valid: boolean;
    value: string;
  };
};

interface RegisterFormProps {
  onSubmitHandler: any;
  onChangeHandler: (field: string, value: string) => void;
  registerDetails: RegisterDetails;
  googleOnSuccessHandler: (response: any) => void; // Ideally, replace `any` with a specific type
  googleOnErrorHandler: () => void;
  githubLoginHandler: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmitHandler,
  onChangeHandler,
  registerDetails,
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
              text={"Register with GitHub"}
            />
          </div>
        </Container>
        <Col md={6}>
          <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="formFullName">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name (e.g., John Doe)"
                value={registerDetails.fullName.value}
                onChange={(e) => handleChange("fullName", e.target.value)}
                pattern="/^[A-Za-z\s'-]+$/"
                isInvalid={
                  !registerDetails.fullName.valid &&
                  registerDetails.fullName.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid full name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email (e.g., johnsmith2@gmail.com)"
                value={registerDetails.email.value}
                onChange={(e) => handleChange("email", e.target.value)}
                pattern="/^[^\s@]+@[^\s@]+\.[^\s@]+$/"
                isInvalid={
                  !registerDetails.email.valid && registerDetails.email.touched
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
                placeholder="Password (e.g., BbewFV9H4wv9qqBQTvsoQciP)"
                value={registerDetails.password.value}
                onChange={(e) => handleChange("password", e.target.value)}
                isInvalid={
                  !registerDetails.password.valid &&
                  registerDetails.password.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password (longer than 8 characters).
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password (must be the same as the password you wrote above)"
                value={registerDetails.confirmPassword.value}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                isInvalid={
                  !registerDetails.confirmPassword.valid &&
                  registerDetails.confirmPassword.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Password and confirmation password must match
              </Form.Control.Feedback>
            </Form.Group>

            <Container>
              <Row className="justify-content-center my-3">
                <Col xs="auto">
                  <Link to="/login" className="btn btn-link">
                    Already have an account?
                  </Link>
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                  <Button
                    className="d-flex align-items-center justify-content-center w-100"
                    variant="primary"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                    Register
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

export default RegisterForm;
