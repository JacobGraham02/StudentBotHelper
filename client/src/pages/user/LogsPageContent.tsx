import { useEffect, useState } from "react";
import { LogsForm } from "../types/BotTypes";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { getAllBotLogFiles, writeBotLogFile } from "../../services/bot";

const LogsPageContent = ({ userLoggedIn }: {userLoggedIn: boolean}) => {
    const [showModal, setShowModal] = useState(false);

    const [botLogFiles, setBotLogFiles] = useState<any[]>([]);

    const [logsData, setLogsData] = useState<LogsForm>(
        {
            infoLog: {
                name: "",
                uri: ""
            },
            errorLog: {
                name: "",
                uri: ""
            }
        }
    );

    useEffect(() => {
        const fetchBotLogs = async () => {
            try {
                const botLogsResponse = await getAllBotLogFiles(`studentbothelperinfo`);
                setBotLogFiles(botLogsResponse.data);
                console.log(botLogsResponse.data);
            } catch (error) {
                throw new Error(`There was an error when attempting to fetch all of the bot commands from the database: ${error}`);
            }
        };
        fetchBotLogs();
        // writeBotLogFile(`Test log file name`, `Test log file contents`, `studentbothelperinfo`);
    }, []); // Empty dependency array to only run once when component mounts

    const [modalContent, setModalContent] = useState<IModalContent>({
        title: "",
        body: "",
        cancelButtonText: "",
        confirmButtonText: "",
        onConfirm: () => {} 
    });

    const downloadLogFileConfirmation = () => {
        setModalContent({
            title: `Download confirmation`,
            body: `Are you sure you want to download this log file?`,
            cancelButtonText: `Cancel`,
            confirmButtonText: `Confirm`,
            onConfirm: () => {

            }
        });
        setShowModal(true);
    }
    
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
                >
                </CustomModal>
                <section id="information_logs_section">
                    
                </section>

                <section id="error_logs_section">

                </section>
            </main>
        )
    }
}

export default LogsPageContent;
  