import LandingPageContent from '../components/LandingPageContent/LandingPageContent';
import Layout from '../components/Layout/Layout';

const LandingPage = ({ isUserLoggedIn }: { isUserLoggedIn: boolean }) => {
    return (
        <Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<LandingPageContent userLoggedIn={isUserLoggedIn}/>}></Layout>
    )
}

export default LandingPage;