import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Layout from "../components/Layout/Layout";

const Dashboard = () => {
  const authCtx = useContext(AuthContext);
  return (
    <Layout pageTitle="Welcome to Student Bot Helper!">
      <main id="main" className="mt-3">
        <aside id="bot_interface_welcome_container">
          <h1 id="bot_interface_index_title">
            Welcome back, {authCtx?.userAuthDetails.name.split(" ")[0]}!
          </h1>
          <p id="bot_interface_index_message">
            Please use any option from the left-hand navigation menu or click
            "More information for more information about your Discord server
            bot, and what settings you can create, delete, and modify using this
            web portal"
          </p>
        </aside>
      </main>
    </Layout>
  );
};

export default Dashboard;
