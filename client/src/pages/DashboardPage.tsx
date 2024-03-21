import Layout from '../components/Layout/Layout';
import DashboardPageContent from './user/DashboardPageContent';

const Dashboardpage = ({ isUserLoggedIn }: { isUserLoggedIn: boolean }) => {
    return (
        <Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<DashboardPageContent userLoggedIn={isUserLoggedIn}/>}></Layout>
    )
}

export default Dashboardpage;