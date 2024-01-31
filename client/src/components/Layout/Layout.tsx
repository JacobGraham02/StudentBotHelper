import Header from '../Header/Header'
import Footer from '../Footer/Footer';
import LandingPageContent from '../LandingPageContent/LandingPageContent';
import { Helmet } from 'react-helmet';

const Layout = ({ pageTitle } : {pageTitle: string}) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="/src/assets/styles.css" type="text/css" />
        <link rel="icon" type="image/x-icon" href="/images/StudentBotHelperStarterIconSmaller.ico" /> 
      </Helmet>
      <Header pageTitle={pageTitle} />
      <LandingPageContent/>
      <Footer />
    </>
  );
};

export default Layout;
