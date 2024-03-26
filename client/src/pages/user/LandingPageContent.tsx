import { useContext, useState } from "react";
import CustomModal from "../../components/Modal/CustomModal";
import IModalContent from "./interfaces/IModalContent";
import { AuthContext } from "../../contexts/AuthContext";
import { updateBotId } from "../../services/bot";

const LandingPageContent = () => {
  const authCtx = useContext(AuthContext);

  if (authCtx?.userAuthDetails.id) {
    updateBotId(authCtx.userAuthDetails.id);
  }

  const [showModal, setShowModal] = useState(false);

  const [modalContent] = useState<IModalContent>({
    title: "",
    body: "",
    cancelButtonText: "",
    confirmButtonText: "",
    onConfirm: () => {},
  });

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
      <section id="landing_page_section">
        <article id="landing_page_article">
          <h1 id="landing_page_h1">Welcome back, username!</h1>
          <p id="landing_page_welcome_paragraph">
            Please use any option from the left-hand navigation menu or click
            More information for more information about your Discord server bot,
            and what settings you can create, delete, and modify using this web
            portal
          </p>
        </article>
      </section>
    </main>
  );
};

export default LandingPageContent;
