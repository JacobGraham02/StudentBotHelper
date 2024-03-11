import { Helmet } from "react-helmet";
import studentBotHelperStarterTabIcon from '../../assets/images/StudentBotHelperStarterIconSmaller.ico';
import Footer from "../Footer/Footer";

const Layout = ({
  pageTitle,
  pageLayoutContent,
  children,
}: {
  pageTitle: string;
  pageLayoutContent?: JSX.Element;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="/src/assets/styles.css" type="text/css" />
        <link
          rel="icon"
          type="image/x-icon"
          href={studentBotHelperStarterTabIcon}
        />
      </Helmet>
      {pageLayoutContent}
      <Footer />
    </>
  );
};

export default Layout;
