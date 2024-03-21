
import LandingPageContent from './user/LandingPageContent';
import Layout from '../components/Layout/Layout';


const LandingPage = () => {
  return (
    <Layout
      pageTitle="Welcome to Student Bot Helper!"
      pageLayoutContent={<LandingPageContent />}
    ></Layout>
  );
};

export default LandingPage;
