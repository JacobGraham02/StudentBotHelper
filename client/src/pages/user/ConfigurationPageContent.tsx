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
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

type ConfigurationForm = {
  guildId: {
    value: string;
    valid: boolean;
    touched: boolean;
    error: string;
  };
  commandChannelId: {
    value: string;
    valid: boolean;
    touched: boolean;
    error: string;
  };
  buttonChannelId: {
    value: string;
    valid: boolean;
    touched: boolean;
    error: string;
  };
  botInfoChannelId: {
    value: string;
    valid: boolean;
    touched: boolean;
    error: string;
  };
  botErrorChannelId: {
    value: string;
    valid: boolean;
    touched: boolean;
    error: string;
  };
};

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
        error: "",
        valid: false,
        touched: false,
      },
      commandChannelId: {
        value: "",
        error: "Invalid Command Channel Id",
        valid: false,
        touched: true,
      },
      buttonChannelId: {
        value: "",
        error: "",
        valid: false,
        touched: false,
      },
      botInfoChannelId: {
        value: "",
        error: "",
        valid: false,
        touched: false,
      },
      botErrorChannelId: {
        value: "",
        error: "",
        valid: false,
        touched: false,
      },
    }
  );

  const onClearHandler = () => {
    setConfigurationData({
      guildId: {
        value: "",
        error: "",
        valid: false,
        touched: false,
      },
      commandChannelId: {
        value: "",
        error: "",
        valid: false,
        touched: false,
      },
      buttonChannelId: {
        value: "",
        error: "",
        valid: false,
        touched: false,
      },
      botInfoChannelId: {
        value: "",
        error: "",
        valid: false,
        touched: false,
      },
      botErrorChannelId: {
        value: "",
        error: "",
        valid: false,
        touched: false,
      },
    });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    console.log(name);

    setConfigurationData((prevState) => ({
      ...prevState,
      [name]: { value },
    }));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Had validations
    console.log(configurationData);
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
          Modify the configuration options for your bot below:
        </p>

        <section className="bot_configuration_options_form_section">
          <Container>
            <Form>
              <Row className="my-2">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="bot_configurations_discord_guild_id_input"
                    >
                      Guild Id
                    </FormLabel>
                    <FormControl
                      id="bot_configuration_options"
                      type="text"
                      onChange={onChangeHandler}
                      value={configurationData.guildId.value}
                      name="guildId"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="bot_configurations_discord_command_channel_input"
                    >
                      Command Channel Id
                    </FormLabel>
                    <FormControl
                      className="bot_configuration_options_input"
                      type="text"
                      name="commandChannelId"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      onChange={onChangeHandler}
                      value={configurationData.commandChannelId.value}
                      isInvalid={
                        configurationData.commandChannelId.touched &&
                        configurationData.commandChannelId.valid === false
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
                      htmlFor="bot_configurations_discord_bot_role_button_channel_id_input"
                    >
                      Button Channel Id
                    </FormLabel>
                    <FormControl
                      className="bot_configuration_options_input"
                      type="text"
                      name="buttonChannelId"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      onChange={onChangeHandler}
                      value={configurationData.buttonChannelId.value}
                    />
                  </FormGroup>
                </Col>

                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="bot_configurations_discord_information_messages_channel_id_input"
                    >
                      Bot-Info Channel Id
                    </FormLabel>
                    <FormControl
                      className="bot_configuration_options_input"
                      type="text"
                      name="botInfoChannelId"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      onChange={onChangeHandler}
                      value={configurationData.botInfoChannelId.value}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row className="my-2">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="bot_configurations_discord_error_messages_channel_id_input"
                    >
                      Bot-Error Channel Id
                    </FormLabel>
                    <FormControl
                      className="bot_configuration_options_input"
                      type="text"
                      name="botErrorChannelId"
                      placeholder="18 digits (e.g., 123456789123456789)"
                      pattern="[0-9]{18}"
                      title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                      required
                      onChange={onChangeHandler}
                      value={configurationData.botErrorChannelId.value}
                    />
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
                    Clear Inputs
                  </Button>
                </Col>
                <Col xs={5}>
                  <Button variant="primary" onClick={onSubmitHandler}>
                    Submit Configuration
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>

          <form
            id="bot_configuration_options_form"
            // method="POST"
            // action="http://localhost:8080/api/testroute"
            onSubmit={onSubmitHandler}
          >
            {/* <fieldset className="bot_configuration_options_form_fieldset">
              <label
                className="bot_configuration_options_label"
                htmlFor="bot_configurations_discord_guild_id_input"
              />
              <input
                className="bot_configuration_options_input"
                type="text"
                onChange={onChangeHandler}
                value={configurationData.guildId.value}
                name="guildId"
                placeholder="18 digits (e.g., 123456789123456789)"
                pattern="[0-9]{18}"
                title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                required
              />
            </fieldset> */}

            {/* <fieldset className="bot_configuration_options_form_fieldset">
              <label
                className="bot_configuration_options_label"
                htmlFor="bot_configurations_discord_command_channel_input"
              />
              <input
                className="bot_configuration_options_input"
                type="text"
                name="bot_configurations_discord_command_channel_input"
                placeholder="18 digits (e.g., 123456789123456789)"
                pattern="[0-9]{18}"
                title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                required
              />
            </fieldset>

            <fieldset className="bot_configuration_options_form_fieldset">
              <label
                className="bot_configuration_options_label"
                htmlFor="bot_configurations_discord_database_responses_id_input"
              />
              <input
                className="bot_configuration_options_input"
                type="text"
                name="bot_configurations_discord_database_responses_id_input"
                placeholder="18 digits (e.g., 123456789123456789)"
                pattern="[0-9]{18}"
                title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                required
              />
            </fieldset>

            <fieldset className="bot_configuration_options_form_fieldset">
              <label
                className="bot_configuration_options_label"
                htmlFor="bot_configurations_discord_bot_role_button_channel_id_input"
              />
              <input
                className="bot_configuration_options_input"
                type="text"
                name="bot_configurations_discord_bot_role_button_channel_id_input"
                placeholder="18 digits (e.g., 123456789123456789)"
                pattern="[0-9]{18}"
                title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                required
              />
            </fieldset> */}
            {/* 
            <fieldset className="bot_configuration_options_form_fieldset">
              <label
                className="bot_configuration_options_label"
                htmlFor="bot_configurations_discord_voice_channel_category_id_input"
              />
              <input
                className="bot_configuration_options_input"
                type="text"
                name="bot_configurations_discord_voice_channel_category_id_input"
                placeholder="18 digits (e.g., 123456789123456789)"
                pattern="[0-9]{18}"
                title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                required
              />
            </fieldset>

            <fieldset className="bot_configuration_options_form_fieldset">
              <label
                className="bot_configuration_options_label"
                htmlFor="bot_configurations_discord_information_messages_channel_id_input"
              />
              <input
                className="bot_configuration_options_input"
                type="text"
                name="bot_configurations_discord_information_messages_channel_id_input"
                placeholder="18 digits (e.g., 123456789123456789)"
                pattern="[0-9]{18}"
                title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                required
              />
            </fieldset>

            <fieldset className="bot_configuration_options_form_fieldset">
              <label
                className="bot_configuration_options_label"
                htmlFor="bot_configurations_discord_error_messages_channel_id_input"
              />
              <input
                className="bot_configuration_options_input"
                type="text"
                name="bot_configurations_discord_error_messages_channel_id_input"
                placeholder="18 digits (e.g., 123456789123456789)"
                pattern="[0-9]{18}"
                title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                required
              />
            </fieldset> */}

            {/* <aside id="bot_configuration_options_form_buttons_article">
              <button className="bot_form_button" type="submit">
                Change bot settings
              </button>
              <button className="bot_form_button" type="reset">
                Erase input fields
              </button>
              <button className="bot_form_button" type="button">
                Cancel
              </button>
            </aside> */}
          </form>
        </section>
      </main>
    );
  }
};

export default ConfigurationPageContent;
