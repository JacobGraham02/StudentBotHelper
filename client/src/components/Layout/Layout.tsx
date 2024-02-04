import { Helmet } from "react-helmet";
import studentBotHelperStarterTabIcon from '../../assets/images/StudentBotHelperStarterIconSmaller.ico';

const Layout = ({ pageTitle, pageLayoutContent } : {pageTitle: string, pageLayoutContent: JSX.Element }) => {
  return (
    <>
     <Helmet>
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="/src/assets/styles.css" type="text/css" />
        <link rel="icon" type="image/x-icon" href={studentBotHelperStarterTabIcon} /> 
      </Helmet>
      {pageLayoutContent}
    </>
  );
};

export default Layout;
