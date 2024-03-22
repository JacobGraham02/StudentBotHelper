import Layout from '../components/Layout/Layout';
import ProfilePageContent from './user/ProfilePageContent';

const Dashboardpage = ({ isUserLoggedIn }: { isUserLoggedIn: boolean }) => {
    return (
        <Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<ProfilePageContent userLoggedIn={isUserLoggedIn}/>}></Layout>
    )
}

export default Dashboardpage;