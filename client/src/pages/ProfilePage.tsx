import Layout from '../components/Layout/Layout';
import ProfilePageContent from './user/ProfilePageContent';

const ProfilePage = ({ isUserLoggedIn }: { isUserLoggedIn: boolean }) => {
    return (
        <Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<ProfilePageContent userLoggedIn={isUserLoggedIn}/>}></Layout>
    )
}

export default ProfilePage;