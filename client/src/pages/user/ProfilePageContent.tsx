import { useContext, useEffect, useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { Form, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ProfileInfoForm } from "../types/BotTypes";
import { Container, Row, Col, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";
import { faXmark, faEraser, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { postChangeUserOptions } from "../../services/bot";

const ProfilePageContent = ({ userLoggedIn }: {userLoggedIn: boolean}) => {
    const navigate = useNavigate();

    const authCtx = useContext(AuthContext);

    let name: string = "";

    const [showModal, setShowModal] = useState(false);

    const [modalContent, setModalContent] = useState<IModalContent>({
      title: "",
      body: "",
      cancelButtonText: "",
      confirmButtonText: "",
      onConfirm: () => {}  
    });

    type authUserDetailsType = {
        name: string;
        email: string;
    }

    useEffect(() => {
        if (authCtx?.userAuthDetails.name) {
            name = authCtx.userAuthDetails.name;
        } 
    }); 

    const [profileData, setProfileData] = useState<ProfileInfoForm>(
        {
          name: {
            value: "",
            error: "Invalid username. Please provide a name that has at least one character (e.g., Jacob Graham)",
            valid: false,
            touched: false,
          },
          email: {
            value: "",
            error: "Invalid email. Please enter a valid email address: (e.g., johnsmith2@gmail.com) ",
            valid: false,
            touched: false,
          },
        }
      );

      const onClearHandler = () => {
        setProfileData({
          name: {
            value: "",
            error: "",
            valid: false,
            touched: false,
          },
          email: {
            value: "",
            error: "",
            valid: false,
            touched: false,
          }
        });
    }
    
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
    
        const nameRegex = /^[A-Za-z\s'-]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        let isTextValid = false;

        if (name === "name") {
            isTextValid = nameRegex.test(value);
        } else if (name === "email") {
            isTextValid = emailRegex.test(value);
        }
    
        setProfileData(prevState => ({
            ...prevState,
            [name]: { 
                ...prevState[name],
                valid: isTextValid,
                value: value,
                touched: true
            }
        }));
    };    

    const showCancelConfirmation = () => {
    setModalContent({
      title: `Cancel confirmation`,
      body: `Are you sure you want to cancel? Confirming will bring you to the last page you were on`,
      cancelButtonText: `Cancel`,
      confirmButtonText: `Confirm`,
      onConfirm: () => {
        navigate(-1);
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
        title: `Submit new bot configuration confirmation`,
        body: `Are you sure you want to submit configuration changes?`,
        cancelButtonText: `No`,
        confirmButtonText: `Yes`,
        onConfirm: () => {
            onSubmitHandler(formSubmitEvent);
        }
        });
        setShowModal(true);
    }

    const formHasErrorsConfirmation = (formSubmitEvent: any) => {
        setModalContent({
          title: `Submission errors`,
          body: `There were some errors in the form fields! Please fix the errors in the input fields indicated on the form.`,
          confirmButtonText: `Ok`,
          onConfirm: () => {
            onSubmitHandler(formSubmitEvent);
            setShowModal(false);
          }
        });
        setShowModal(true);
    }

    const showSuccessSubmissionConfirmation = () => {
        setModalContent({
          title: `Channel id modifications successful`,
          body: `You have successfully changed the Discord bot channel ids`,
          confirmButtonText: `Ok`,
          onConfirm: () => {
            setShowModal(false);
          }
        });
        setShowModal(true);
    }
    
      const showErrorSubmissionConfirmation = (error) => {
        setModalContent({
          title: `Channel id modifications unsuccessful`,
          body: `There was an error attempting to change the channel ids. Please try again or inform the server administrator if you believe this is an error: ${error}`,
          confirmButtonText: `Ok`,
          onConfirm: () => {
            setShowModal(false);
          }
        });
        setShowModal(true);
    }

    const onSubmitHandler = async (formSubmitEvent: any) => {
        formSubmitEvent.preventDefault();
    
        const allFieldsValid = Object.values(profileData).every(field => field.valid);
    
        if (!allFieldsValid) {
          formHasErrorsConfirmation(formSubmitEvent)
          return;
        }
    
        const newProfileData = {
            name: profileData.name.value,
            email: profileData.email.value
        }
    
        try {
          const postChannelIdsResponse = await postChangeUserOptions(
            newProfileData
          );
          if (postChannelIdsResponse) {
            onClearHandler();
            showSuccessSubmissionConfirmation();
          }
        } catch (error) {
          showErrorSubmissionConfirmation
        }
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
    
            <aside id="bot_configuration_options_page_content">
                <h1 id="bot_onfiguration_options_page_title">
                    {authCtx?.userAuthDetails.name}'s profile options
                </h1>
                <p id="bot_configuration_options_page_message">
                    Modify your profile options below:
                </p>
            </aside>

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
    
            <section className="user_profile_section">
                <Container>
                    <Form>
                        <Row className="my-2 text-start">
                            <Col xs={12} md={6} className="my-2">
                                <FormGroup>
                                    <FormLabel
                                        className="profile_name_input_label"
                                        htmlFor="name"
                                    >
                                        Name
                                    </FormLabel>
                                    <FormControl
                                        id="profile_name_input"
                                        type="text"
                                        onChange={onChangeHandler}
                                        value={profileData.name.value}
                                        name="name"
                                        placeholder="A real name (e.g., Jacob Graham)"
                                        pattern="^[A-Za-z\\s'-]+$"
                                        title="Please enter a valid real name: (e.g., Jacob Graham)"
                                        required
                                        isInvalid={
                                            profileData.name.touched &&
                                            !profileData.name.valid &&
                                            profileData.name.value.length > 0
                                        }
                                    />
                                    {profileData.name.error &&
                                        profileData.name.valid === false && (
                                            <FormControl.Feedback type="invalid">
                                                {profileData.name.error}
                                            </FormControl.Feedback>
                                        )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="my-1 justify-content-center mt-5">
                            <Col xs={6} md={3}>
                            <Button className="btn btn-info" onClick={(formSubmitEvent) => {submitFormConfirmation(formSubmitEvent)}}>
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="mx-1"/>
                                Submit changes  
                            </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>
        </main>
    );
}

export default ProfilePageContent;