import { useContext, useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
} from "react-bootstrap";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfilePageContent = () => {
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);

  const [modalContent, setModalContent] = useState<IModalContent>({
    title: "",
    body: "",
    cancelButtonText: "",
    confirmButtonText: "",
    onConfirm: () => {},
  });

  const getRoleName = (roleId: number): string => {
    switch (roleId) {
      case 1:
        return "User";
      case 2:
        return "Manager";
      case 3:
        return "Developer";
      case 4:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  const showCancelConfirmation = () => {
    setModalContent({
      title: `Cancel confirmation`,
      body: `Are you sure you want to go back to the previous page?`,
      cancelButtonText: `Cancel`,
      confirmButtonText: `Confirm`,
      onConfirm: () => {
        navigate(-1);
      },
    });
    setShowModal(true);
  };

  return (
    <main id="main" className="text-center">
      <CustomModal
        showModal={showModal}
        setShowModal={setShowModal}
        title={modalContent.title}
        body={modalContent.body}
        cancelButtonText={modalContent.cancelButtonText}
        confirmButtonText={modalContent.confirmButtonText!}
        onConfirm={modalContent.onConfirm}
      />

      <Container>
        <Row className="my-1 justify-content-between mt-5">
          <Col xs="auto">
            <Button
              className="btn btn-danger"
              onClick={() => showCancelConfirmation()}
            >
              <FontAwesomeIcon icon={faXmark} className="mx-1" />
              Go back
            </Button>
          </Col>
        </Row>
      </Container>

      <aside id="bot_configuration_options_page_content">
        <h1 id="bot_onfiguration_options_page_title">
          {authCtx?.userAuthDetails.name}'s profile options
        </h1>
        <p id="bot_configuration_options_page_message">
          Modify your profile options below:
        </p>
      </aside>

      <section className="user_profile_section">
        <Container>
          <Row className="my-2 text-start">
            <Col xs={12} md={6} className="my-2">
              <FormGroup>
                <FormLabel className="profile_name_input_label" htmlFor="name">
                  Name
                </FormLabel>
                <FormControl
                  id="profile_name_input"
                  type="text"
                  value={authCtx!.userAuthDetails.name}
                  name="name"
                  contentEditable="false"
                  required
                />
              </FormGroup>
            </Col>

            <Col xs={12} md={6} className="my-2">
              <FormGroup>
                <FormLabel className="profile_email_label" htmlFor="email">
                  Email address
                </FormLabel>
                <FormControl
                  id="profile_email"
                  type="text"
                  value={authCtx!.userAuthDetails.email}
                  name="email"
                  required
                  contentEditable="false"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className="my-2 text-start">
            <Col xs={12} md={6} className="my-2">
              <FormGroup>
                <FormLabel className="profile_role_label" htmlFor="role">
                  Role
                </FormLabel>
                <FormControl
                  id="profile_role"
                  type="text"
                  value={getRoleName(authCtx!.userAuthDetails.role)}
                  name="role"
                  contentEditable="false"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default ProfilePageContent;
