import Layout from '../components/Layout/Layout';
import CommandPageContent from './user/CommandPageContent';

const CommandPage = ({ isUserLoggedIn }: { isUserLoggedIn: boolean }) => {
    return (
        <Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<CommandPageContent userLoggedIn={isUserLoggedIn}/>}></Layout>
    )
}

export default CommandPage;