import Header from '../Header/Header'
import Footer from '../Footer/Footer';
import { Helmet } from 'react-helmet';

const Layout = ({ pageTitle, pageLayoutContent } : {pageTitle: string, pageLayoutContent: JSX.Element }) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="/src/assets/styles.css" type="text/css" />
        <link rel="icon" type="image/x-icon" href="/images/StudentBotHelperStarterIconSmaller.ico" /> 
      </Helmet>
      <Header pageTitle={pageTitle} />
      {pageLayoutContent}
      <Footer />
    </>
  );
};

export default Layout;
