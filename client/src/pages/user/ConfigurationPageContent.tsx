import { useState } from "react";
import { ConfigurationForm } from "../types/BotTypes";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { postBotConfigurations } from "../../services/bot/index";

const ConfigurationPageContent = ({
  userLoggedIn,
}: {
  userLoggedIn: boolean;
}) => {
  const navigate = useNavigate();
  const [configurationData, setConfigurationData] = useState<ConfigurationForm>(
    {
      guildId: {
        value: "",
        error: "Invalid guild id. Please input a string of 18 numbers",
        valid: false,
        touched: false,
      },
      commandChannelId: {
        value: "",
        error: "Invalid bot command channel id. Please input a string of 18 numbers",
        valid: false,
        touched: false,
      },
      buttonChannelId: {
        value: "",
        error: "Invalid bot role button channel id. Please input a string of 18 numbers",
        valid: false,
        touched: false,
      },
      botInfoChannelId: {
        value: "",
        error: "Invalid info channel id. Please input a string of 18 numbers",
        valid: false,
        touched: false,
      },
      botErrorChannelId: {
        value: "",
        error: "Invalid error channel id. Please input a string of 18 numbers",
        valid: false,
        touched: false,
      },
    }
  );

  const onClearHandler = () => {
    setConfigurationData({
      guildId: {
        value: "",
        error: "Invalid guild id",
        valid: false,
        touched: false,
      },
      commandChannelId: {
        value: "",
        error: "Invalid command channel id",
        valid: false,
        touched: false,
      },
      buttonChannelId: {
        value: "",
        error: "Invalid bot role button channel id",
        valid: false,
        touched: false,
      },
      botInfoChannelId: {
        value: "",
        error: "Invalid info channel id",
        valid: false,
        touched: false,
      },
      botErrorChannelId: {
        value: "",
        error: "Invalid error channel id",
        valid: false,
        touched: false,
      },
    });
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;

    const channelIdRegexPattern = /^[0-9]{18}$/;

    const isTextValid = channelIdRegexPattern.test(value);

    setConfigurationData((prevState) => ({
      ...prevState,
      [name]: { 
        ...prevState[name],
        valid: isTextValid,
        value: value,
        touched: true
      }
    }));
  };

  const onSubmitHandler = (e: any) => {
    e.preventDefault();

    const configurationResponse = postBotConfigurations({
      guildId: configurationData.guildId.value,
      commandChannelId: configurationData.commandChannelId.value,
      buttonChannelId: configurationData.buttonChannelId.value,
      botInfoChannelId: configurationData.botInfoChannelId.value,
      botErrorChannelId: configurationData.botErrorChannelId.value,
    });
  };

  if (userLoggedIn) {
    return (
      <main id="main">
        <aside id="bot_configuration_options_page_content">
          <h1 id="bot_onfiguration_options_page_title">
            Bot configuration options
          </h1>
        </aside>
        <p id="bot_configuration_options_page_message">
          Modify the configuration options for your Discord bot below:
        </p>

        <section className="bot_configuration_options_form_section">
          <Container>
            <Form>
              <Row className="my-2">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="discord_guild_id_input"
                    >
                      Guild id
                    </FormLabel>
                    <FormControl
                      id="bot_configuration_options"
                      type="text"
                      onChange={onChangeHandler}
                      value={configurationData.guildId.value}
                      name="discord_guild_id_input"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      isInvalid={
                        configurationData.guildId.touched &&
                        configurationData.guildId.valid === false &&
                        configurationData.guildId.value.length <= 0
                      }
                    />
                     {configurationData.guildId.error &&
                      configurationData.guildId.valid === false && (
                        <FormControl.Feedback type="invalid">
                          {configurationData.guildId.error}
                        </FormControl.Feedback>
                      )}
                  </FormGroup>
                </Col>

                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="discord_command_channel_input"
                    >
                      Command channel id
                    </FormLabel>
                    <FormControl
                      className="bot_configuration_options_input"
                      type="text"
                      name="discord_command_channel_input"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      onChange={onChangeHandler}
                      value={configurationData.commandChannelId.value}
                      isInvalid={
                        configurationData.commandChannelId.touched &&
                        configurationData.commandChannelId.valid === false &&
                        configurationData.commandChannelId.value.length > 0
                      }
                    />
                    {configurationData.commandChannelId.error &&
                      configurationData.commandChannelId.valid === false && (
                        <FormControl.Feedback type="invalid">
                          {configurationData.commandChannelId.error}
                        </FormControl.Feedback>
                      )}
                  </FormGroup>
                </Col>
              </Row>

              <Row className="my-2">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="bot_role_button_channel_id_input"
                    >
                      Bot role button channel id
                    </FormLabel>
                    <FormControl
                      className="bot_configuration_options_input"
                      type="text"
                      name="bot_role_button_channel_id_input"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      onChange={onChangeHandler}
                      value={configurationData.buttonChannelId.value}
                      isInvalid={
                        configurationData.buttonChannelId.touched &&
                        configurationData.buttonChannelId.valid === false &&
                        configurationData.buttonChannelId.value.length > 0
                      }
                      />
                     {configurationData.buttonChannelId.error &&
                      configurationData.buttonChannelId.valid === false && (
                        <FormControl.Feedback type="invalid">
                          {configurationData.buttonChannelId.error}
                        </FormControl.Feedback>
                      )}
                  </FormGroup>
                </Col>

                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="information_messages_channel_id_input"
                    >
                      Bot info messages channel id
                    </FormLabel>
                    <FormControl
                      className="bot_configuration_options_input"
                      type="text"
                      name="information_messages_channel_id_input"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      onChange={onChangeHandler}
                      value={configurationData.botInfoChannelId.value}
                      isInvalid={
                        configurationData.botInfoChannelId.touched &&
                        configurationData.botInfoChannelId.valid === false &&
                        configurationData.botInfoChannelId.value.length > 0
                      }
                      />
                     {configurationData.botInfoChannelId.error &&
                      configurationData.botInfoChannelId.valid === false && (
                        <FormControl.Feedback type="invalid">
                          {configurationData.botInfoChannelId.error}
                        </FormControl.Feedback>
                      )}
                  </FormGroup>
                </Col>
              </Row>

              <Row className="my-2">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="error_messages_channel_id_input"
                    >
                      Bot error messages channel id
                    </FormLabel>
                    <FormControl
                      className="bot_configuration_options_input"
                      type="text"
                      name="error_messages_channel_id_input"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      onChange={onChangeHandler}
                      value={configurationData.botErrorChannelId.value}
                      isInvalid={
                        configurationData.botErrorChannelId.touched &&
                        configurationData.botErrorChannelId.valid === false &&
                        configurationData.botErrorChannelId.value.length > 0
                      }
                      />
                     {configurationData.botErrorChannelId.error &&
                      configurationData.botErrorChannelId.valid === false && (
                        <FormControl.Feedback type="invalid">
                          {configurationData.botErrorChannelId.error}
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

          <form
            id="bot_configuration_options_form"
            onSubmit={onSubmitHandler}
          >
          </form>
        </section>
      </main>
    );
  }
};

export default ConfigurationPageContent;
