import { Helmet } from 'react-helmet'; // This library manages the document head
import Menu from '../Menu/Menu';
import studentBotHelperStarterTabIcon from '../../assets/images/StudentBotHelperStarterIconSmaller.ico';

const Header = ({ pageTitle }: {pageTitle: string}) => {
  return (
    <header id="header">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={studentBotHelperStarterTabIcon} />
      </Helmet>
      <Menu user={undefined} />
    </header>
  );
};

export default Header;
