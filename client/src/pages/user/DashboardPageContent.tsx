import { useEffect, useState, useMemo } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { getAllBotCommands } from "../../services/bot";
import { NavLink, useNavigate } from "react-router-dom";

const DashboardPageContent = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [modalContent] = useState<IModalContent>({
    title: "",
    body: "",
    cancelButtonText: "",
    confirmButtonText: "",
    onConfirm: () => {},
  });

  const [botCommands, setBotCommands] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const commandsPerPage = 10;

  useEffect(() => {
    const fetchBotCommands = async () => {
      try {
        const commands = await getAllBotCommands();
        setBotCommands(commands.data.data);
        console.log(commands.data.data[0].data);
      } catch (error) {
        console.error(`There was an error fetching bot commands: ${error}`);
      }
    };
    fetchBotCommands();
  }, []);

  const totalPages = Math.ceil(botCommands.length / commandsPerPage);
  const indexOfLastCommand = currentPage * commandsPerPage;
  const indexOfFirstCommand = indexOfLastCommand - commandsPerPage;

  const currentCommands = useMemo(
    () => botCommands.slice(indexOfFirstCommand, indexOfLastCommand),
    [botCommands, indexOfFirstCommand, indexOfLastCommand]
  );

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

  const handleCommandClick = (command: any) => {
    navigate("/command", {
      state: { command_object: command, command_data: command.data },
    });
  };

  return (
    <main id="main" className="text-center">
      <aside id="bot_configuration_options_page_content">
        <h1 id="dashboard_h1_title">Your dashboard</h1>
        <h3 id="dashboard_h3_title">
          Below are a list of commands available to you:
        </h3>
      </aside>
      <div>
        <ul>
          {currentCommands.map((command, index) => (
            <li key={index}>
              <NavLink
                to="/command"
                state={{ command_object: command, command_data: command.data }}
                className="nav-link"
                onClick={() => handleCommandClick(command)}
              >
                {command.data.name}
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
};

export default DashboardPageContent;
