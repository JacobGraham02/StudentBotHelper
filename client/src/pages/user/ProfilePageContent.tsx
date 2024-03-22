import { useContext, useEffect, useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { Form, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ProfileInfoForm } from "../types/BotTypes";
import { Container, Row, Col, FormGroup, FormLabel, FormControl } from "react-bootstrap";

const ProfilePageContent = ({ userLoggedIn }: {userLoggedIn: boolean}) => {
    const navigate = useNavigate();

    const authCtx = useContext(AuthContext);

    let name: string = "";
    let email: string = "";

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
        if (authCtx?.userAuthDetails.email) {
            email = authCtx.userAuthDetails.email;
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
                                        pattern="/^[A-Za-z\s'-]+$/"
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
    
                            <Col xs={12} md={6} className="my-2">
                                <FormGroup>
                                    <FormLabel
                                        className="profile_email_input_label"
                                        htmlFor="email"
                                    >
                                        Email
                                    </FormLabel>
                                    <FormControl
                                        className="profile_email_input"
                                        type="text"
                                        name="email"
                                        placeholder="A real email address: (e.g., johndoe82@gmail.com)"
                                        pattern="/^[^\s@]+@[^\s@]+\.[^\s@]+$/"
                                        title="Please enter a valid email address: (e.g., johndoe82@gmail.com)"
                                        required
                                        onChange={onChangeHandler}
                                        value={profileData.email.value}
                                        isInvalid={
                                            profileData.email.touched &&
                                            !profileData.email.valid &&
                                            profileData.email.value.length > 0
                                        }
                                    />
                                    {profileData.email.error &&
                                        profileData.email.valid === false && (
                                            <FormControl.Feedback type="invalid">
                                                {profileData.email.error}
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

export default ProfilePageContent;