import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  FormCheck,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CommandsForm } from "../types/BotTypes";
import { postBotConfigurations } from "../../services/bot";

const CommandsPageContent = ({ userLoggedIn }: { userLoggedIn: boolean }) => {
  const navigate = useNavigate();

  const [commandData, setCommandData] = useState<CommandsForm>({
    commandName: {
      value: "",
      error:
        "Invalid command name. Please enter a command name whose length is equal to or less than 32 characters (a-z)",
      valid: false,
      touched: false,
    },

    commandDescription: {
      value: "",
      error:
        "Invalid command description. Please enter a command description whose length is equal to or less than 100 characters (a-z)",
      valid: false,
      touched: false,
    },

    commandRequired: {
      value: false,
      error:
        "Invalid command required option. Please enter either true or false",
      valid: false,
      touched: false,
    },

    commandOptions: {
      value: [
        {
          command_option_name: "",
          command_option_description: "",
          command_option_required: false,
        },
      ],
      error: "Invalid command option. Please enter valid configuration options",
      valid: false,
      touched: false,
    },

    authorizedRoleName: {
      value: [""],
      error:
        "Invalid authorization name. Please enter valid a valid authorization name that is less than 50 characters (a-z)",
      valid: false,
      touched: false,
    },
    commandExecute: {
      value: Function,
      error: "",
      valid: false,
      touched: false,
    },
  });

  const onClearHandler = () => {
    setCommandData({
      commandName: {
        value: "",
        error:
          "Invalid command name. Please enter a command name whose length is equal to or less than 32 characters (a-z)",
        valid: false,
        touched: false,
      },

      commandDescription: {
        value: "",
        error:
          "Invalid command description. Please enter a command description whose length is equal to or less than 100 characters (a-z)",
        valid: false,
        touched: false,
      },

      commandRequired: {
        value: false,
        error:
          "Invalid command required option. Please enter either true or false",
        valid: false,
        touched: false,
      },

      commandOptions: {
        value: [
          {
            command_option_name: "",
            command_option_description: "",
            command_option_required: false,
          },
        ],
        error:
          "Invalid command option. Please enter valid configuration options",
        valid: false,
        touched: false,
      },

      authorizedRoleName: {
        value: [""],
        error:
          "Invalid authorization name. Please enter valid a valid authorization name that is less than 50 characters (a-z)",
        valid: false,
        touched: false,
      },
      commandExecute: {
        value: Function,
        error:
          "Invalid command name. Please enter a command name whose length is equal to or less than 32 characters",
        valid: false,
        touched: false,
      },
    });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target; // Destructure name and value from the event target

    const commandNameRegexPattern = /^[a-zA-Z0-9]{1,32}$/;
    const commandDescriptionRegexPattern = /^[a-zA-Z0-9]{1,100}$/;
    const commandRoleRegexPattern = /^[a-zA-Z0-9]{1,50}$/;

    let newValue = value;
    let isValid = false;

    if (name === "command_required") {
      newValue = value === true;

      isValid = newValue === true || newValue === false;
    }

    // Update your form state here with newValue and isValid
    // Example:
    setCommandData({
      ...commandData,
      [name]: {
        ...commandData[name],
        value: newValue,
        valid: isValid,
        touched: true, // Mark as touched to show feedback if needed
      },
    });
  };

  const onSubmitHandler = (e: any) => {
    e.preventDefault();
  };
  if (userLoggedIn) {
    return (
      <main id="main">
        <aside id="bot_command_options_page_content">
          <h1 id="bot_command_options_page_title">Bot command options</h1>
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
                      htmlFor="command_name_input"
                    >
                      Command name
                    </FormLabel>
                    <FormControl
                      id="bot_commands_name_input"
                      type="text"
                      onChange={onChangeHandler}
                      value={commandData.commandName.value}
                      name="command_name_input"
                      placeholder="1-32 letters and/or numbers (e.g., Bot role 2)"
                      pattern="[a-zA-Z0-9]{0,32}"
                      title="Please enter 1-32 letters and/or numbers (e.g., Bot role 2)"
                      required
                      isInvalid={
                        commandData.commandName.touched &&
                        commandData.commandName.valid === false &&
                        commandData.commandName.value.length <= 0
                      }
                    />
                    {commandData.commandName.error &&
                      commandData.commandName.valid == false && (
                        <FormControl.Feedback type="invalid">
                          {commandData.commandName.error}
                        </FormControl.Feedback>
                      )}
                    ;
                  </FormGroup>
                </Col>

                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="command_description_label"
                      htmlFor="command_description_input"
                    ></FormLabel>
                    <FormControl
                      className="bot_command_description_input"
                      type="text"
                      name="command_description_input"
                      placeholder="1-100 letters and/or numbers (e.g., This commands allows customization of a bot)"
                      pattern="[a-zA-Z0-9]{0,100}"
                      title="1-100 letters and.or numbers (e.g., This command allows customization of a bot)"
                      required
                      onChange={onChangeHandler}
                      value={commandData.commandDescription.value}
                      isInvalid={
                        commandData.commandDescription.touched &&
                        commandData.commandDescription.valid === false &&
                        commandData.commandDescription.value.length > 0
                      }
                    />
                    {commandData.commandDescription.error &&
                      commandData.commandDescription.valid === false && (
                        <FormControl.Feedback type="invalid">
                          {commandData.commandDescription.error}
                        </FormControl.Feedback>
                      )}
                    ;
                  </FormGroup>
                </Col>
              </Row>

              <Row className="my-2">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="command_required_label"
                      htmlFor="command_required_switch"
                    >
                      Command required
                    </FormLabel>
                    <FormCheck
                      id="command_required_switch"
                      type="switch"
                      label={commandData.commandRequired.value ? "Yes" : "No"}
                      checked={commandData.commandRequired.value}
                      onChange={(e) =>
                        onChangeHandler({
                          target: {
                            name: "command_required",
                            value: e.target.checked.toString(),
                          },
                        })
                      }
                      name="command_required"
                      isInvalid={
                        commandData.commandRequired.touched &&
                        !commandData.commandRequired.valid
                      }
                    />
                    {commandData.commandRequired.error &&
                      !commandData.commandRequired.valid && (
                        <FormControl.Feedback type="invalid">
                          {commandData.commandRequired.error}
                        </FormControl.Feedback>
                      )}
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Container>
        </section>
      </main>
    );
  }
};

export default CommandsPageContent;
