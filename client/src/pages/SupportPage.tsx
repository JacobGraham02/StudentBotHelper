import Layout from '../components/Layout/Layout';
import SupportPage from '../components/LoginForm/LoginForm';

const LoginPage = () => {
    return (
        <Layout pageTitle="Get support" pageLayoutContent={<SupportPage/>}></Layout>
    )
}

export default LoginPage;