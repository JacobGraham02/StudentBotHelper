import { useEffect, useState } from "react";
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

    const [botCommands, setBotCommands] = useState<any[]>([]); 

    useEffect(() => {
        const fetchBotCommands = async () => {
            try {
                const response = await getAllBotCommands();
                setBotCommands(response.data); // Set response data directly
                console.log("Bot commands:", response.data);
            } catch (error) {
                throw new Error(`There was an error when attempting to fetch all of the bot commands from the database: ${error}`);
            }
        };fetchBotCommands();
    }, []); // Empty dependency array to only run once when component mounts
    
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
  