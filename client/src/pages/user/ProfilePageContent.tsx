import { useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { useNavigate } from "react-router-dom";

const ProfilePageContent = ({ userLoggedIn }: {userLoggedIn: boolean}) => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const [modalContent, setModalContent] = useState<IModalContent>({
      title: "",
      body: "",
      cancelButtonText: "",
      confirmButtonText: "",
      onConfirm: () => {}  
    });
    
    return (
        <CustomModal
            showModal={showModal}
            setShowModal={setShowModal}
            title={modalContent.title}
            body={modalContent.body}
            cancelButtonText={modalContent.cancelButtonText}
            confirmButtonText={modalContent.confirmButtonText!}
            onConfirm={modalContent.onConfirm}
        />
    );
}

export default ProfilePageContent;