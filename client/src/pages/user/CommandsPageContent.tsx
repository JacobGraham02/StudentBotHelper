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
      }
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
     
      commandAuthorizedUser: {
        value: "",
        error: "Invalid authorization name. Please enter valid a valid authorization name that is less than 50 characters (a-z)",
        valid: false,
        touched: false
      },
    });
  };

  const onChangeHandler = (event: any) => {
    const { name, value } = event.target; // Destructure name and value from the event target

    const regexPatterns: RegexPatterns = {
      commandNameRegexPattern: /^[a-zA-Z0-9]{1,32}$/,
      commandDescriptionRegexPattern: /^[a-zA-Z0-9]{1,100}$/,
      commandAuthorizedUserRegexPattern: /^[a-zA-Z0-9]{1,50}$/
    };

    let newValue = value;
    let isValid = false;

    const inputFieldName = name + "RegexPattern";
    const regexPattern = regexPatterns[inputFieldName];

    if (regexPattern) {
      isValid = regexPattern.test(value);
    }

    // Update your form state here with newValue and isValid
    // Example:
    setCommandData((prevState) => ({
        ...prevState,
        [name]: {
            ...prevState[name],
            value: newValue,
            valid: isValid,
            touched: true, // Mark as touched to show feedback if needed
        },
    }));
};


  const onSubmitHandler = (e: any) => {
    e.preventDefault();

    const allFieldsValid = Object.values(commandData).every(field => field.valid);

    if (!allFieldsValid) {
      alert("Please correct the form errors shown on screen before submitting");
      return;
    }

  };
    if (userLoggedIn) {
        return (
            <main id="main">
                <aside id="bot_command_options_page_content">
                    <h1 id="bot_command_options_page_title">
                        Bot command options
                    </h1>
                </aside>
                <p id="bot_command_options_page_message">
                    Add commands to your Discord bot below:
                </p>

                <section className="bot_command_options_form_section">
                    <Container>
                        <Form>
                            <Row className="my-2">
                                <Col xs={12} md={6} className="my-2">
                                    <FormGroup>
                                        <FormLabel 
                                            className="command_name_label"
                                            htmlFor="commandName"
                                        >
                                            Command name
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
                                      Command description
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

                            <Row className="my-2">
                              <Col xs={12} md={6} className="my-2">
                                  <FormGroup>
                                      <FormLabel 
                                          className="command_authorized_user_label"
                                          htmlFor="commandAuthorizedUser"
                                      >
                                          Authorized user
                                      </FormLabel>
                                      <FormControl 
                                        className="commandAuthorizedUser"
                                        type="text"
                                        name="commandAuthorizedUser"
                                        placeholder="1-100 letters and/or numbers (e.g., Server bot administrator)"
                                        pattern="[a-zA-Z0-9]{0,100}"
                                        title="1-100 letters and/or numbers (e.g., Server bot administrator)"
                                        required
                                        onChange={onChangeHandler}
                                        value={commandData.commandAuthorizedUser.value}
                                        
                                        isInvalid={
                                          commandData.commandAuthorizedUser.touched &&
                                          !commandData.commandAuthorizedUser.valid &&
                                          commandData.commandAuthorizedUser.value.length > 0
                                        }
                                        />
                                        {commandData.commandAuthorizedUser.error && 
                                        commandData.commandAuthorizedUser.valid === false && (
                                            <FormControl.Feedback type="invalid">
                                              {commandData.commandAuthorizedUser.error}
                                            </FormControl.Feedback>
                                        )}
                                  </FormGroup>
                              </Col>
                            </Row>


                            <Row className="my-1">
                              <Col xs={3}>
                                <Button variant="danger" onClick={() => navigate(-1)}>
                                  Cancel
                                </Button>
                              </Col>
                              <Col xs={4}>
                                <Button variant="secondary" onClick={onClearHandler}>
                                  Reset inputs
                                </Button>
                              </Col>
                              <Col xs={5}>
                                <Button variant="primary" onClick={onSubmitHandler}>
                                  Submit changes
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