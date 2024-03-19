import Layout from '../components/Layout/Layout';
import LogsPageContent from './user/LogsPageContent';

const LogsPage = () => {
    return (
        <Layout pageTitle="View bot logs" pageLayoutContent={<LogsPageContent userLoggedIn={false} />}></Layout>
    )
}

export default LogsPage;