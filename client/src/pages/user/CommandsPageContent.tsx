import { FormEvent, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CommandsForm, RegexPatterns } from "../types/BotTypes";
import { postBotCommands } from "../../services/bot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faEraser, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";


const CommandsPageContent = ({userLoggedIn}: {userLoggedIn:boolean}) => {
    const navigate = useNavigate();

    const [confirmClear, setConfirmClear] = useState(false);
  
    const [showModal, setShowModal] = useState(false);

    const [modalContent, setModalContent] = useState<IModalContent>({
      title: "",
      body: "",
      cancelButtonText: "",
      confirmButtonText: "",
      onConfirm: () => {}  
    });

    useEffect(() => {
      if (confirmClear) {
        onClearHandler();
        setConfirmClear(false);
        setShowModal(false);
      }
    }, [confirmClear]);

    const showCancelConfirmation = () => {
      setModalContent({
        title: `Cancel confirmation`,
        body: `Are you sure you want to cancel? Confirming will bring you to the last page you were on`,
        cancelButtonText: `Cancel`,
        confirmButtonText: `Confirm`,
        onConfirm: () => {
          navigate(-1)
        }
      });
      setShowModal(true);
    }
  
    const showClearConfirmation = () => {
      setModalContent({
        title: `Clear input fields confirmation`,
        body: `Are you sure you want to clear the input fields on this form?`,
        cancelButtonText: `No`,
        confirmButtonText: `Yes`,
        onConfirm: () => {
          onClearHandler();
          setShowModal(false);
        }
      });
      setShowModal(true);
    }

    const submitFormConfirmation = (formSubmitEvent: any) => {
      setModalContent({
        title: `Submit new command request confirmation`,
        body: `Are you sure you want to request this command?`,
        cancelButtonText: `No`,
        confirmButtonText: `Yes`,
        onConfirm: () => {
          onSubmitHandler(formSubmitEvent);
        }
      });
      setShowModal(true);
    }

    const formHasErrorsConfirmation = () => {
      setModalContent({
        title: `Submission errors`,
        body: `There were some errors in the form fields! Please fix the errors in the input fields indicated on the form.`,
        confirmButtonText: `Ok`,
        onConfirm: () => {
          setShowModal(false);
        }
      });
      setShowModal(true);
    }
  
    const [commandData, setCommandData] = useState<CommandsForm>(
    {
      commandName: {
        value: "",
        error: "Invalid command name. Please enter a command name whose length is equal to or less than 32 characters (a-z)",
        valid: false,
        touched: false
      },

      commandDescription: {
        value: "",
        error: "Invalid command description. Please enter a command description whose length is equal to or less than 100 characters (a-z)",
        valid: false,
        touched: false
      },
     
      commandAuthorizedUser: {
        value: "",
        error: "Invalid authorization name. Please enter valid a valid authorization name that is less than 50 characters (a-z)",
        valid: false,
        touched: false
      },

      commandDescriptionForFunction: {
        value: "",
        error: "Invalid command function description. Please enter a description that is less than 1000 characters long (a-z)",
        valid: false,
        touched: false
      },

      commandAuthorizedUsers: [""]
    }
  );

  const onClearHandler = () => {
    setCommandData({
      commandName: {
        value: "",
        error: "Invalid command name. Please enter a command name whose length is equal to or less than 32 characters (a-z)",
        valid: false,
        touched: false
      },

      commandDescription: {
        value: "",
        error: "Invalid command description. Please enter a command description whose length is equal to or less than 100 characters (a-z)",
        valid: false,
        touched: false
      },

      commandDescriptionForFunction: {
        value: "",
        error: "Invalid command description. Please enter a valid description so the admins can create a command for you (1 - 1000 characters a-z)",
        valid: false,
        touched: false
      },
     
      commandAuthorizedUser: {
        value: "",
        error: "Invalid authorization name. Please enter valid a valid authorization name that is less than 50 characters (1 - 50 characters a-z)",
        valid: false,
        touched: false
      },

      commandAuthorizedUsers: [""]
    });
  };

  const onChangeHandler = (event: any) => {
    const { name, value } = event.target;
    setCommandData(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: value,
        valid: validateField(name, value), // Validate dynamically added fields
        touched: true
      }
    }));
  };

  const validateField = (name: string, value: string) => {
    const regexPatterns: RegexPatterns = {
      commandNameRegexPattern: /^[a-zA-Z0-9 ]{1,32}$/,
      commandDescriptionRegexPattern: /^[a-zA-Z0-9 ]{1,100}$/,
      commandAuthorizedUserRegexPattern: /^[a-zA-Z0-9 ]{1,50}$/,
      commandDescriptionForFunctionRegexPattern: /^[a-zA-Z0-9 ]{1,1000}$/
    };

    const inputFieldName = name + "RegexPattern";
    const regexPattern = regexPatterns[inputFieldName];

    return regexPattern ? regexPattern.test(value) : false;
  };


  const onChangeAuthorizedUser = (index: number, value: string) => {
    setCommandData(prevState => ({
      ...prevState,
      commandAuthorizedUsers: prevState.commandAuthorizedUsers.map((user, i) =>
        i === index ? value : user
      )
    }));
  };


  const addAuthorizedUserField = () => {
    setCommandData(prevState => ({
      ...prevState,
      commandAuthorizedUsers: [...prevState.commandAuthorizedUsers, ""]
    }));
  };

  const onSubmitHandler = (formSubmitEvent: React.FormEvent<HTMLFormElement>) => {
    formSubmitEvent.preventDefault();

    const allFieldsValid: boolean = commandData.commandAuthorizedUsers.every(user => validateField("commandAuthorizedUser", user));

    if (!allFieldsValid) {
      formHasErrorsConfirmation();
      return;
    }

    const formSubmissionData = {
      commandName: commandData.commandName.value,
      commandDescription: commandData.commandDescription.value,
      commandDescriptionForFunction: commandData.commandDescriptionForFunction.value,
      commandAuthorizedUsers: commandData.commandAuthorizedUsers
    }

    const postRequestBotCommandResponse = postBotCommands(
      formSubmissionData
    );

    console.log(`Form submission data is: ${Object.values(formSubmissionData)}`);
  };
    if (userLoggedIn) {
      /*
      Whenever any text is input into the 'command description' text area, the text area will dynamically grow vertically to accomodate for additional text being 
      added by the user that overflows the default area of the text area. 
      */
      const adjustTextareaHeight = (e: any) => {
        e.target.style.height = 'inherit'; // Reset the height, allowing the TextArea to shrink if necessary
        e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to scroll height to remove the scroll bar
      }
      
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

                <aside id="bot_command_options_page_content">
                    <h1 id="bot_command_options_page_title">
                        Request bot command
                    </h1>
                </aside>
                <p id="bot_command_options_page_message">
                    Request a command for your Discord bot below:
                </p>

                <Container>
                  <Row className="my-1 justify-content-between mt-5">
                    <Col xs="auto">
                      <Button className="btn btn-danger" onClick={() => showCancelConfirmation()}>
                        <FontAwesomeIcon icon={faXmark}  className="mx-1"/>
                        Cancel
                      </Button>
                    </Col>

                    <Col xs="auto">
                      <Button className="btn btn-secondary" onClick={() => showClearConfirmation()}>
                        <FontAwesomeIcon icon={faEraser} className="mx-1"/>
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Container>

                <section className="bot_command_options_form_section">
                    <Container>
                        <Form>
                            <Row className="my-2 text-start">
                                <Col xs={12} md={6} className="my-2">
                                    <FormGroup>
                                        <FormLabel 
                                            className="command_name_label"
                                            htmlFor="commandName"
                                        >
                                            Name for your command
                                        </FormLabel>
                                        <FormControl
                                            id="bot_commands_name_input"
                                            type="text"
                                            onChange={onChangeHandler}
                                            value={commandData.commandName.value}
                                            name="commandName"
                                            placeholder="1-32 letters and/or numbers (e.g., Bot role 2)"
                                            pattern="[a-zA-Z0-9]{0,32}"
                                            title="Please enter 1-32 letters and/or numbers (e.g., Bot role 2)"
                                            required
                                            isInvalid={
                                              commandData.commandName.touched &&
                                              !commandData.commandName.valid &&
                                              commandData.commandName.value.length > 0
                                            }
                                        />
                                          {commandData.commandName.error &&
                                           commandData.commandName.valid == false && (
                                           <FormControl.Feedback type="invalid">
                                            {commandData.commandName.error}
                                           </FormControl.Feedback>
                                          )}
                                    </FormGroup>
                                </Col>

                                <Col xs={12} md={6} className="my-2">
                                  <FormGroup>
                                    <FormLabel
                                      className="command_description_label"
                                      htmlFor="commandDescription"
                                    >
                                      Description for your command
                                    </FormLabel>
                                    <FormControl
                                      className="bot_command_description_input"
                                      type="text"
                                      name="commandDescription"
                                      placeholder="1-100 letters and/or numbers (e.g., This commands allows customization of a bot)"
                                      pattern="[a-zA-Z0-9]{0,100}"
                                      title="1-100 letters and.or numbers (e.g., This command allows customization of a bot)"
                                      required
                                      onChange={onChangeHandler}
                                      value={commandData.commandDescription.value}
                                      isInvalid={
                                        commandData.commandDescription.touched &&
                                        !commandData.commandDescription.valid &&
                                        commandData.commandDescription.value.length > 0
                                      }
                                    />
                                    {commandData.commandDescription.error &&
                                    commandData.commandDescription.valid === false && (
                                      <FormControl.Feedback type="invalid">
                                        {commandData.commandDescription.error}
                                      </FormControl.Feedback>
                                    )}
                                  </FormGroup>
                                </Col>
                            </Row>

                            <Row className="my-2 text-start">
                                <Col xs={12} md={6} className="my-2 w-100">
                                    <FormGroup>
                                        <FormLabel 
                                          className="command_name_label"
                                          htmlFor="commandDescriptionForFunction"
                                        >
                                            What do you want the command to do?
                                        </FormLabel>
                                        <FormControl
                                          id="bot_commands_name_input"
                                          as="textarea"
                                          onChange={onChangeHandler}
                                          value={commandData.commandDescriptionForFunction.value}
                                          name="commandDescriptionForFunction"
                                          placeholder="1-1000 letters and/or numbers (e.g., I want the command that will respond to a user with 'Ping' if they use the command '/pong')"
                                          title="Please enter 1-32 letters and/or numbers (e.g., Bot role 2)"
                                          required
                                          isInvalid={
                                            commandData.commandDescriptionForFunction.touched &&
                                            !commandData.commandDescriptionForFunction.valid &&
                                            commandData.commandDescriptionForFunction.value.length > 0
                                          }
                                          onInput={adjustTextareaHeight}
                                          style={{ overflow: 'hidden' }}
                                        />
                                        {commandData.commandDescriptionForFunction.error &&
                                          commandData.commandDescriptionForFunction.valid == false && (
                                          <FormControl.Feedback type="invalid">
                                          {commandData.commandDescriptionForFunction.error}
                                          </FormControl.Feedback>
                                        )}
                                      
                                  </FormGroup>
                              </Col>
                            </Row>

                            <Row className="my-2 text-start">
                              {commandData.commandAuthorizedUsers.map((user, index) => (
                                <Col xs={12} md={6} className="my-2" key={index}>
                                  <FormGroup>
                                    <FormLabel
                                      className="command_authorized_user_label"
                                      htmlFor={`commandAuthorizedUser${index}`}
                                    >
                                      Authorized user #{index + 1}
                                    </FormLabel>
                                    <FormControl
                                      className="commandAuthorizedUser"
                                      type="text"
                                      name={`commandAuthorizedUser${index}`}
                                      placeholder="1-100 letters and/or numbers (e.g., Server bot administrator)"
                                      pattern="[a-zA-Z0-9]{0,100}"
                                      title="1-100 letters and/or numbers (e.g., Server bot administrator)"
                                      required
                                      value={user}
                                      onChange={(e) => onChangeAuthorizedUser(index, e.target.value)}
                                      isInvalid={!!(
                                        commandData.commandAuthorizedUsers[index] &&
                                        !validateField("commandAuthorizedUser", user)
                                      )}
                                    />
                                     {commandData.commandAuthorizedUsers[index] &&
                                      !validateField("commandAuthorizedUser", user) && (
                                        <FormControl.Feedback type="invalid">
                                          {commandData.commandAuthorizedUser.error}
                                        </FormControl.Feedback>
                                      )}
                                  </FormGroup>
                                </Col>
                              ))}
                            </Row>

                            
                            <Row className="my-1 justify-content-center mt-5">
                              <Col xs={6} md={3}>
                                <Button className="btn btn-primary" onClick={addAuthorizedUserField}>
                                <FontAwesomeIcon icon={faUser} className="mx-1"/>
                                Add additional authorized users
                                </Button>
                              </Col>
                            </Row>
                            

                            <Row className="my-1 justify-content-center mt-5">
                              <Col xs={6} md={3}>
                                <Button className="btn btn-info mx-1" onClick={(formSubmitEvent) => submitFormConfirmation(formSubmitEvent)}>
                                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="mx-1"/>
                                  Request command
                                </Button>
                              </Col>
                            </Row>
                        </Form>
                    </Container>
                </section>
            </main>
        )
    }
}

export default CommandsPageContent;