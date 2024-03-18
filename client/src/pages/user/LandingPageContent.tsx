import { useEffect, useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { getAllBotCommands } from "../../services/bot";
import { useNavigate } from "react-router-dom";

const LandingPageContent = ({ userLoggedIn }: {userLoggedIn: boolean}) => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const [modalContent, setModalContent] = useState<IModalContent>({
      title: "",
      body: "",
      cancelButtonText: "",
      confirmButtonText: "",
      onConfirm: () => {}  
    });

    const [botCommands, setBotCommands] = useState<any[]>([]); 

    const [currentPage, setCurrentPage] = useState(1);

    const commandsPerPage = 10;
    const totalPages = Math.ceil(botCommands.length / commandsPerPage);

    const indexOfLastCommand = currentPage * commandsPerPage;
    const indexOfFirstCommand = indexOfLastCommand - commandsPerPage;
    const currentCommands = botCommands.slice(indexOfFirstCommand, indexOfLastCommand);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        const fetchBotCommands = async () => {
            try {
                const response = await getAllBotCommands();
                setBotCommands(response.data); // Set response data directly
                console.log("Bot commands size: ", botCommands.length);
                console.log("Bot commands:", response);
            } catch (error) {
                throw new Error(`There was an error when attempting to fetch all of the bot commands from the database: ${error}`);
            }
        };
        fetchBotCommands();
    }, []); // Empty dependency array to only run once when component mounts

    // botCommands
    // [
    //     {
    //       _id: "65f7899fb911099617e2a4d7",
    //       bot_id: 1,
    //       command_description: 'Test command description',
    //       command_function: 'I want this command to say the word pong when a user types in the command ping',
    //       command_name: 'Test command 1',
    //       command_users: [ 'Auth user 1', 'Auth user 2' ]
    //     }
    //   ]
    const handleClick = (command: any) => {
        console.log("Clicked command:", command);
        navigate(`/commands/${command._id}`, { state: { command }});
    };

    return (
        <main id="main" className="text-center">
            <div>
                <ul> 
                    {currentCommands.map((command, index) => (
                        <li key={index}>
                            <button onClick={() => handleClick(command)}>
                                {command.command_name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
            <CustomModal
                showModal={showModal}
                setShowModal={setShowModal}
                title={modalContent.title}
                body={modalContent.body}
                cancelButtonText={modalContent.cancelButtonText}
                confirmButtonText={modalContent.confirmButtonText!}
                onConfirm={modalContent.onConfirm}
            />
        </main>
    );
}

export default LandingPageContent;
  