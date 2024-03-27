import Layout from "../components/Layout/Layout";
import DashboardPageContent from "./user/DashboardPageContent";

const Dashboardpage = () => {
  return (
    <Layout
      pageTitle="Welcome to Student Bot Helper!"
      pageLayoutContent={<DashboardPageContent />}
    ></Layout>
  );
};

export default Dashboardpage;
