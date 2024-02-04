import LandingPageContent from '../components/LandingPageContent/LandingPageContent';
import Layout from '../components/Layout/Layout';

const LandingPage = () => {
    return (
        <Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<LandingPageContent/>}></Layout>
    )
}

export default LandingPage;