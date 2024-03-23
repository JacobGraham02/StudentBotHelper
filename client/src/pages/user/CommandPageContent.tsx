import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { Container, Row, Col, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const CommandPageContent = ({userLoggedIn}: {userLoggedIn:boolean}) => {
    const navigate = useNavigate();
    let commandName, commandDescription, commandFunction = undefined;

    const [confirmClear, setConfirmClear] = useState(false);
  
    const [showModal, setShowModal] = useState(false);

    const { state } = useLocation();

    const textareaReference = useRef<HTMLTextAreaElement>(null);

    const [modalContent, setModalContent] = useState<IModalContent>({
      title: "",
      body: "",
      cancelButtonText: "",
      confirmButtonText: "",
      onConfirm: () => {}  
    });

    if (state) {
      commandName = state.command_data.name;
      commandDescription = state.command_data.description;
      commandFunction = state.command_object.execute;
    }


    useEffect(() => {
      if (confirmClear) {
        setShowModal(false);
      }
    }, [commandFunction]);


    useEffect(() => {
      if (textareaReference.current) {
        adjustTextareaHeight(textareaReference.current);
      }
    }, [commandFunction]);


    const showCancelConfirmation = () => {
      setModalContent({
        title: `Cancel confirmation`,
        body: `Are you sure you want to go back to the previous page?`,
        cancelButtonText: `Cancel`,
        confirmButtonText: `Confirm`,
        onConfirm: () => {
          navigate(-1)
        }
      });
      setShowModal(true);
    }

    const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
      element.style.height = 'auto'; // Reset the height to auto
      const maxHeight = window.innerHeight * 0.45; // Calculate 50% of the viewport height
      const currentHeight = element.scrollHeight;
      element.style.height = `${Math.min(currentHeight, maxHeight)}px`; // Set the height to the smaller of current height and max height
  }

    if (userLoggedIn) {
      /*
      Whenever any text is input into the 'command description' text area, the text area will dynamically grow vertically to accomodate for additional text being 
      added by the user that overflows the default area of the text area. 
      */
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
              >
              </CustomModal>

              <Container>
                <Row className="my-1 justify-content-between mt-5">
                  <Col xs="auto">
                    <Button className="btn btn-danger" onClick={() => showCancelConfirmation()}>
                      <FontAwesomeIcon icon={faXmark}  className="mx-1"/>
                      Go back
                    </Button>
                  </Col>
                </Row>
              </Container>

              <section id="main_command_section">
                <aside id="command_page_titles">
                  <h1 id="command_h1_title">
                      {commandName} command
                  </h1>
                  <h3 id="command_h2_title">
                      View the command parameters below:
                  </h3>
                </aside>

              <Container>
                  <Row className="my-2 text-start">
                      <Col xs={12} md={6} className="my-2">
                          <FormGroup>
                              <FormLabel
                                  className="command_name_input_label"
                              >
                                  Command name
                              </FormLabel>
                              <FormControl
                                  id="profile_name_input"
                                  type="text"
                                  value={commandName}
                                  name="name"
                                  readOnly
                                  required
                              />
                          </FormGroup>
                      </Col>

                      <Col xs={12} md={6} className="my-2">
                          <FormGroup>
                              <FormLabel
                                  className="command_description_label"
                              >
                                  Command description
                              </FormLabel>
                              <FormControl
                                  id="profile_email"
                                  type="text"
                                  value={commandDescription}
                                  name="email"
                                  required
                                  readOnly
                              />
                          </FormGroup>
                      </Col>
                  </Row>

                  <Row className="my-2 text-start">
                      <Col xs={12} md={6} className="my-2 w-100">
                          <FormGroup>
                              <FormLabel
                                  className="command_functionality_label"
                              >
                                  Command functionality
                              </FormLabel>
                              <textarea
                                  ref={textareaReference}
                                  id="command_function"
                                  value={commandFunction}
                                  name="commandFunction"
                                  className="form-control"
                                  readOnly
                              />
                          </FormGroup>
                      </Col>
                  </Row>
              </Container>
            </section>
          </main>
        )
    }
}

export default CommandPageContent;