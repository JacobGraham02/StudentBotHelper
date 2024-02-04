import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

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

const RegisterForm = ({
  onSubmitHandler,
  onChangeHandler,
  registerDetails,
}) => {
  const handleChange = (field: string, value: string) => {
    // Assuming onChangeHandler is designed to update the state based on field and value
    onChangeHandler(field, value);
  };

  return (
    <Container className="">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={registerDetails.fullName.value}
                onChange={(e) => handleChange("fullName", e.target.value)}
                isInvalid={
                  !registerDetails.fullName.valid &&
                  registerDetails.fullName.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid full name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={registerDetails.email.value}
                onChange={(e) => handleChange("email", e.target.value)}
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
                placeholder="Password"
                value={registerDetails.password.value}
                onChange={(e) => handleChange("password", e.target.value)}
                isInvalid={
                  !registerDetails.password.valid &&
                  registerDetails.password.touched
                }
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
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
                Passwords must match.
              </Form.Control.Feedback>
            </Form.Group>

            <Button className="w-100 mt-3" variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
