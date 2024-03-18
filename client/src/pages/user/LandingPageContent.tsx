import { useEffect, useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { getAllBotCommands } from "../../services/bot";
import { NavLink, NavLinkProps, useNavigate } from "react-router-dom";
import ICommandState from "./interfaces/ICommandState";

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
            } catch (error) {
                throw new Error(`There was an error when attempting to fetch all of the bot commands from the database: ${error}`);
            }
        };
        fetchBotCommands();
    }, []); // Empty dependency array to only run once when component mounts
    
    return (
        <main id="main" className="text-center">
            <div>
                <ul> 
                    {currentCommands.map((command, index) => (
                        <li key={index}>
                        <NavLink
                            to="/commands"
                            state={{ command_object: command}}
                            className="nav-link"
                            >
                            {command.command_name}
                        </NavLink>
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
  