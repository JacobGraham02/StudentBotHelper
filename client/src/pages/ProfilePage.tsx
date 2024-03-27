import Layout from "../components/Layout/Layout";
import ProfilePageContent from "./user/ProfilePageContent";

const ProfilePage = () => {
  return (
    <Layout
      pageTitle="Welcome to Student Bot Helper!"
      pageLayoutContent={<ProfilePageContent />}
    ></Layout>
  );
};

export default ProfilePage;
