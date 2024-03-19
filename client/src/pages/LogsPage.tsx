import Layout from '../components/Layout/Layout';
import LogsPageContent from './user/LogsPageContent';

const LogsPage = () => {
    return (
        <Layout pageTitle="View bot logs" pageLayoutContent={<LogsPageContent userLoggedIn={true} />}></Layout>
    )
}

export default LogsPage;