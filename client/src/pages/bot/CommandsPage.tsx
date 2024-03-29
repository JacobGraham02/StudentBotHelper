import Layout from "../../components/Layout/Layout";
import CommandsPageContent from "./CommandsPageContent";

const CommandsPage = () => {
  return (
    <Layout
      pageTitle="View bot commands"
      pageLayoutContent={<CommandsPageContent userLoggedIn={true} />}
    ></Layout>
  );
};

export default CommandsPage;
