import { useState } from "react";
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
import { postBotConfigurations } from "../../services/bot";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackwardFast } from "@fortawesome/free-solid-svg-icons/faBackwardFast";
import { faBell, faEraser } from "@fortawesome/free-solid-svg-icons";


const CommandsPageContent = ({userLoggedIn}: {userLoggedIn:boolean}) => {
    const navigate = useNavigate();
  
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

      commandOptions: { 
        value: [{
          command_option_name: "",
          command_option_description: "",
          command_option_required: false
        }], 
        error: "Invalid command option. Please enter valid configuration options",
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
        error: "Invalid command function description. Please enter a description so the admins can create a command for you (a-z)",
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

      commandOptions: { 
        value: [{
          command_option_name: "",
          command_option_description: "",
          command_option_required: false
        }], 
        error: "Invalid command option. Please enter valid configuration options",
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

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const onSubmitHandler = (e: any) => {
    e.preventDefault();
    const allFieldsValid = Object.values(commandData).every(field =>
      Array.isArray(field) ? field.every(user => validateField("commandAuthorizedUser", user)) : field.valid
    );

    if (!allFieldsValid) {
      alert("Please correct the form errors shown on screen before submitting");
      return;
    }

  };
    if (userLoggedIn) {
        return (
            <main id="main" className="text-center">
                <aside id="bot_command_options_page_content">
                    <h1 id="bot_command_options_page_title">
                        Request  bot command
                    </h1>
                </aside>
                <p id="bot_command_options_page_message">
                    Request a command for your Discord bot below:
                </p>

                <Container>
                  <Row className="my-1 justify-content-between mt-5">
                    <Col xs="auto">
                      <Button className="btn btn-danger" onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faBackwardFast} className="mx-1"/>
                        Cancel
                      </Button>
                    </Col>

                    <Col xs="auto">
                      <Button className="btn btn-secondary" onClick={onClearHandler}>
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
                                          pattern="[a-zA-Z0-9 ]{1,1000}"
                                          title="Please enter 1-32 letters and/or numbers (e.g., Bot role 2)"
                                          required
                                          isInvalid={
                                            commandData.commandDescriptionForFunction.touched &&
                                            !commandData.commandDescriptionForFunction.valid &&
                                            commandData.commandDescriptionForFunction.value.length > 0
                                          }
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

                            <Button className="btn btn-primary" onClick={addAuthorizedUserField}>
                                  Add additional authorized users
                            </Button>

                            <Row className="my-1 justify-content-center mt-5">
                              <Col xs={6} md={3}>
                                <Button className="btn btn-info" onClick={onSubmitHandler}>
                                  <FontAwesomeIcon icon={faBell} />
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