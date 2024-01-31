import LandingPageContent from '../components/LandingPageContent/LandingPageContent';
import Layout from '../components/Layout/Layout';

const SigninPage = () => {
    return (
        <Layout pageTitle="My page title" pageLayoutContent={<LandingPageContent/>}></Layout>
    )
}

export default SigninPage;