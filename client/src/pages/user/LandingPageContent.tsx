import { useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { getAllBotCommands } from "../../services/bot";

const LandingPageContent = ({ userLoggedIn }: {userLoggedIn: boolean}) => {
    const [showModal, setShowModal] = useState(false);

    const [modalContent, setModalContent] = useState<IModalContent>({
      title: "",
      body: "",
      cancelButtonText: "",
      confirmButtonText: "",
      onConfirm: () => {}  
    });

    getAllBotCommands();
    
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
    </main>
)}

export default LandingPageContent;
  