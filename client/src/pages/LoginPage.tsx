import LoginForm from '../components/LoginForm/LoginForm';
import Layout from '../components/Layout/Layout';

const LoginPage = () => {
    return (
        <Layout pageTitle="Log in to your account" pageLayoutContent={<LoginForm/>}></Layout>
    )
}

export default LoginPage;