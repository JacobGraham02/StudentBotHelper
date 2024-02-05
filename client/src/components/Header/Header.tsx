import Menu from '../Menu/Menu';

const Header = ({ isUserLoggedIn }: { isUserLoggedIn: boolean}) => {
  return (
    <header id="header">
      <Menu isUserLoggedIn={isUserLoggedIn} />
    </header>
  );
};

export default Header;
