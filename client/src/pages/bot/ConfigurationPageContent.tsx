import { useContext, useEffect, useState } from "react";
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
import { updateBotLoggingChannels } from "../../services/bot/index";
import {
  faArrowUpRightFromSquare,
  faEraser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "../user/interfaces/IModalContent";
import { AuthContext } from "../../contexts/AuthContext";

const ConfigurationPageContent = ({
  userLoggedIn,
}: {
  userLoggedIn: boolean;
}) => {
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  let guild_id = undefined;
  let command_error_channel_id = undefined;
  let command_info_channel_id = undefined;
  let command_channel_id = undefined;
  let bot_role_button_channel_id = undefined;

<<<<<<< HEAD
  if (authCtx?.userAuthDetails.bot.bot_guild_id) {
    guild_id = authCtx.userAuthDetails.bot.bot_guild_id;
  }
  if (authCtx?.userAuthDetails.bot.bot_commands_channel) {
    command_channel_id = authCtx.userAuthDetails.bot.bot_commands_channel;
  }
  if (authCtx?.userAuthDetails.bot.bot_command_usage_error_channel) {
    command_error_channel_id =
      authCtx.userAuthDetails.bot.bot_command_usage_error_channel;
  }
  if (authCtx?.userAuthDetails.bot.bot_command_usage_information_channel) {
    command_info_channel_id =
      authCtx.userAuthDetails.bot.bot_command_usage_information_channel;
  }
  if (authCtx?.userAuthDetails.bot.bot_role_button_channel_id) {
    bot_role_button_channel_id =
      authCtx.userAuthDetails.bot.bot_role_button_channel_id;
=======
  if (authCtx?.userAuthDetails.bot) {
    if (authCtx?.userAuthDetails.bot.bot_guild_id) {
      guild_id = authCtx.userAuthDetails.bot.bot_guild_id;
    }
    if (authCtx?.userAuthDetails.bot.bot_commands_channel) {
      command_channel_id = authCtx.userAuthDetails.bot.bot_commands_channel;
    } 
    if (authCtx?.userAuthDetails.bot.bot_command_usage_error_channel) {
      command_error_channel_id = authCtx.userAuthDetails.bot.bot_command_usage_error_channel;
    }
    if (authCtx?.userAuthDetails.bot.bot_command_usage_information_channel) {
      command_info_channel_id = authCtx.userAuthDetails.bot.bot_command_usage_information_channel;
    }
    if (authCtx?.userAuthDetails.bot.bot_role_button_channel_id) {
      bot_role_button_channel_id = authCtx.userAuthDetails.bot.bot_role_button_channel_id;
    }
>>>>>>> 36d372802614ee6e7c2b5d0d698136d45da65cd3
  }

  const [confirmClear, setConfirmClear] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [modalContent, setModalContent] = useState<IModalContent>({
    title: "",
    body: "",
    cancelButtonText: "",
    confirmButtonText: "",
    onConfirm: () => {},
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
        navigate(-1);
      },
    });
    setShowModal(true);
  };

  const showClearConfirmation = () => {
    setModalContent({
      title: `Clear input fields confirmation`,
      body: `Are you sure you want to clear the input fields on this form?`,
      cancelButtonText: `No`,
      confirmButtonText: `Yes`,
      onConfirm: () => {
        onClearHandler();
        setShowModal(false);
      },
    });
    setShowModal(true);
  };

  const submitFormConfirmation = (formSubmitEvent: any) => {
    setModalContent({
      title: `Submit new bot configuration confirmation`,
      body: `Are you sure you want to submit configuration changes?`,
      cancelButtonText: `No`,
      confirmButtonText: `Yes`,
      onConfirm: () => {
        onSubmitHandler(formSubmitEvent);
      },
    });
    setShowModal(true);
  };

  const formHasErrorsConfirmation = (formSubmitEvent: any) => {
    setModalContent({
      title: `Submission errors`,
      body: `There were some errors in the form fields! Please fix the errors in the input fields indicated on the form.`,
      confirmButtonText: `Ok`,
      onConfirm: () => {
        onSubmitHandler(formSubmitEvent);
        setShowModal(false);
      },
    });
    setShowModal(true);
  };

  const showSuccessSubmissionConfirmation = () => {
    setModalContent({
      title: `Channel id modifications successful`,
      body: `You have successfully changed the Discord bot channel ids`,
      confirmButtonText: `Ok`,
      onConfirm: () => {
        setShowModal(false);
      },
    });
    setShowModal(true);
  };

  const showErrorSubmissionConfirmation = (error: any) => {
    setModalContent({
      title: `Channel id modifications unsuccessful`,
      body: `There was an error attempting to change the channel ids. Please try again or inform the server administrator if you believe this is an error: ${error}`,
      confirmButtonText: `Ok`,
      onConfirm: () => {
        setShowModal(false);
      },
    });
    setShowModal(true);
  };

  const [configurationData, setConfigurationData] = useState<ConfigurationForm>(
    {
      guildId: {
        value: guild_id ?? "",
        error:
          "Invalid guild id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: guild_id ? true : false,
        touched: false,
      },
      commandChannelId: {
        value: command_channel_id ?? "",
        error:
          "Invalid bot command channel id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: command_channel_id ? true : false,
        touched: false,
      },
      buttonChannelId: {
        value: bot_role_button_channel_id ?? "",
        error:
          "Invalid bot role button channel id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: bot_role_button_channel_id ? true : false,
        touched: false,
      },
      botInfoChannelId: {
        value: command_info_channel_id ?? "",
        error:
          "Invalid info channel id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: command_info_channel_id ? true : false,
        touched: false,
      },
      botErrorChannelId: {
        value: command_error_channel_id ?? "",
        error:
          "Invalid error channel id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: command_error_channel_id ? true : false,
        touched: false,
      },
    }
  );

  const onClearHandler = () => {
    setConfigurationData({
      guildId: {
        value: "",
        error:
          "Invalid guild id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: false,
        touched: false,
      },
      commandChannelId: {
        value: "",
        error:
          "Invalid command channel id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: false,
        touched: false,
      },
      buttonChannelId: {
        value: "",
        error:
          "Invalid bot role button channel id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: false,
        touched: false,
      },
      botInfoChannelId: {
        value: "",
        error:
          "Invalid info channel id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: false,
        touched: false,
      },
      botErrorChannelId: {
        value: "",
        error:
          "Invalid error channel id. Please input a string of 18 numbers ranging from 0 to 9",
        valid: false,
        touched: false,
      },
    });
  };

  // const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target as HTMLInputElement;

  //   const channelIdRegexPattern = /^[0-9]{18}$/;

  //   const isTextValid = channelIdRegexPattern.test(value);

  //   setConfigurationData((prevState) => ({
  //     ...prevState,
  //     [name]: {
  //       ...prevState[name],
  //       valid: isTextValid,
  //       value: value,
  //       touched: true,
  //     },
  //   }));
  // };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const channelIdRegexPattern = /^[0-9]{18}$/;
    const isTextValid = channelIdRegexPattern.test(value);

    setConfigurationData((prevState: any) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        valid: isTextValid,
        value: value,
        touched: true,
      },
    }));
  };

  const onSubmitHandler = async (formSubmitEvent: any) => {
    formSubmitEvent.preventDefault();

    const allFieldsValid = Object.values(configurationData).every(
      (field) => field.valid
    );

    if (!allFieldsValid) {
      formHasErrorsConfirmation(formSubmitEvent);
      return;
    }

    const commandChannelIds = {
      bot_id: authCtx?.userAuthDetails.bot.bot_id,
      bot_guild_id: configurationData.guildId.value,
      bot_command_channel_id: configurationData.commandChannelId.value,
      bot_button_channel_id: configurationData.buttonChannelId.value,
      bot_info_channel_id: configurationData.botInfoChannelId.value,
      bot_error_channel_id: configurationData.botErrorChannelId.value,
    };

    try {
      const patchChannelIdsResponse = await updateBotLoggingChannels(
        commandChannelIds
      );

      if (patchChannelIdsResponse) {
        onClearHandler();
        showSuccessSubmissionConfirmation();

        const newChannels = {
          bot_guild_id: configurationData.guildId.value,
          bot_command_channel_id: configurationData.commandChannelId.value,
          bot_button_channel_id: configurationData.buttonChannelId.value,
          bot_info_channel_id: configurationData.botInfoChannelId.value,
          bot_error_channel_id: configurationData.botErrorChannelId.value,
        };

        authCtx?.updateBotChannels(newChannels);
      }
    } catch (error) {
      showErrorSubmissionConfirmation;
    }
  };

  if (userLoggedIn) {
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
        ></CustomModal>

        <aside id="bot_configuration_options_page_content">
          <h1 id="bot_onfiguration_options_page_title">
            Bot configuration options
          </h1>
        </aside>
        <p id="bot_configuration_options_page_message">
          Modify the configuration options for your Discord bot below:
        </p>

        <Container>
          <Row className="my-1 justify-content-between mt-5">
            <Col xs="auto">
              <Button
                className="btn btn-danger"
                onClick={() => showCancelConfirmation()}
              >
                <FontAwesomeIcon icon={faXmark} className="mx-1" />
                Cancel
              </Button>
            </Col>

            <Col xs="auto">
              <Button
                className="btn btn-secondary"
                onClick={() => showClearConfirmation()}
              >
                <FontAwesomeIcon icon={faEraser} className="mx-1" />
                Reset
              </Button>
            </Col>
          </Row>
        </Container>

        <section className="bot_configuration_options_form_section">
          <Container>
            <Form>
              <Row className="my-2 text-start">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="guildId"
                    >
                      Guild id
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
                      isInvalid={
                        configurationData.guildId.touched &&
                        !configurationData.guildId.valid &&
                        configurationData.guildId.value.length > 0
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
                      htmlFor="commandChannelId"
                    >
                      Command channel id
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
                        !configurationData.commandChannelId.valid &&
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

              <Row className="my-2 text-start">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="buttonChannelId"
                    >
                      Bot role button channel id
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
                      isInvalid={
                        configurationData.buttonChannelId.touched &&
                        !configurationData.buttonChannelId.valid &&
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
                      htmlFor="botInfoChannelId"
                    >
                      Bot info messages channel id
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
                      isInvalid={
                        configurationData.botInfoChannelId.touched &&
                        !configurationData.botInfoChannelId.valid &&
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

              <Row className="my-2 text-start">
                <Col xs={12} md={6} className="my-2">
                  <FormGroup>
                    <FormLabel
                      className="bot_configuration_options_label"
                      htmlFor="botErrorChannelId"
                    >
                      Bot error messages channel id
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
                      isInvalid={
                        configurationData.botErrorChannelId.touched &&
                        !configurationData.botErrorChannelId.valid &&
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
              <Row className="my-1 justify-content-center mt-5">
                <Col xs={6} md={3}>
                  <Button
                    className="btn btn-info"
                    onClick={(formSubmitEvent) => {
                      submitFormConfirmation(formSubmitEvent);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="mx-1"
                    />
                    Submit changes
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>

          <form
            id="bot_configuration_options_form"
            onSubmit={onSubmitHandler}
          ></form>
        </section>
      </main>
    );
  }
};

export default ConfigurationPageContent;
