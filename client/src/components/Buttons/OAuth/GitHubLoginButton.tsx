import React from "react";
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

// Define the props interface
interface GitHubLoginButtonProps {
  githubLoginHandler: () => void;
  text: string;
}

const GitHubLoginButton: React.FC<GitHubLoginButtonProps> = ({
  githubLoginHandler,
  text,
}) => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "40px", width: "240px" }}
    >
      <Button
        variant="secondary"
        className="d-flex align-items-center justify-content-center w-100"
        onClick={githubLoginHandler}
      >
        <FontAwesomeIcon icon={faGithub} className="me-1" />
        {text}
      </Button>
    </Container>
  );
};

export default GitHubLoginButton;
