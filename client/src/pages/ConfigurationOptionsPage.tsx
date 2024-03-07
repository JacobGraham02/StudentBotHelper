import Layout from "../components/Layout/Layout";
import ConfigurationPageContent from "./user/ConfigurationPageContent";

const ConfigurationsPage = () => {
    return (
        <Layout pageTitle="View bot configurations" pageLayoutContent={<ConfigurationPageContent userLoggedIn={true}/>}></Layout>
    )
}

export default ConfigurationsPage;