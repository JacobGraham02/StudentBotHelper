import { useEffect, useState } from "react";
import { LogsForm } from "../types/BotTypes";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { getAllBotLogFiles, writeBotLogFile } from "../../services/bot";

const LogsPageContent = ({ userLoggedIn }: {userLoggedIn: boolean}) => {
    const [showModal, setShowModal] = useState(false);

    const [botLogFiles, setBotLogFiles] = useState<any[]>([]);

    const logFileData: any[] = [];

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


    const logFileDownload = ({ fileName, fileContents }: { fileName: string, fileContents: string}) => {
        // Encapsulates the download logic within an inner function.
        const handleDownload = () => {
            // Creates a new Blob object from the fileContents string, specifying the MIME type as plain text.
            const fileDataBlob = new Blob([fileContents], { type: "text/plain" });
            // Generates a URL for the created Blob, allowing it to be referenced within the browser's environment.
            const url = URL.createObjectURL(fileDataBlob);
            // Creates an anchor (`<a>`) element programmatically. This element is used to trigger the download.
            const a = document.createElement("a");
            // Sets the `href` attribute of the anchor to the Blob URL, enabling the browser to download the Blob when the link is clicked.
            a.href = url;
            // Sets the `download` attribute with the desired file name, instructing the browser to download the Blob as a file with this name.
            a.download = fileName;
            // Programmatically clicks the anchor element, triggering the download process.
            a.click(); 
            // Revokes the created Blob URL to release browser resources, as it's no longer needed after the download is initiated.
            URL.revokeObjectURL(url); 
        }
        handleDownload(); 
    }

    
    
    const downloadLogFileConfirmation = (logFileName: string, logFileContents: string) => {
        setModalContent({
            title: `Download ${logFileName}`,
            body: `Are you sure you want to download this log file?`,
            cancelButtonText: `Cancel`,
            confirmButtonText: `Confirm`,
            onConfirm: () => {
                logFileDownload({ fileName: logFileName, fileContents: logFileContents }); 
                setShowModal(false);
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
                    <h2>Command information logs</h2>
                    <ul>
                    {botLogFiles.map((logFile, index) => (
                        <li key={index}>
                        <a href="#" onClick={(e) => {
                            e.preventDefault(); 
                            downloadLogFileConfirmation(logFile.name, logFile.content);
                        }}>
                            {logFile.name}
                        </a>
                        </li>
                    ))}
                    </ul>
                </section>

                <section id="error_logs_section">

                </section>
            </main>
        )
    }
}

export default LogsPageContent;
  