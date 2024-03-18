import Layout from '../components/Layout/Layout';
import LogsPageContent from '../components/LogFiles/LogsPageContent';

const LogsPage = () => {
    return (
        <Layout pageTitle="Get support" pageLayoutContent={<LogsPageContent isUserLoggedIn={false} />}></Layout>
    )
}

export default LogsPage;