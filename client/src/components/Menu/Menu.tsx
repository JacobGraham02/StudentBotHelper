import { Link } from 'react-router-dom';
import studentBotHelperStarterIconSmaller from '../../assets/images/StudentBotHelperStarterIconSmaller.png';

const Menu = ({ isUserLoggedIn }: {isUserLoggedIn: boolean}) => {
  return (
    <section id="menu_container">
      <div id="website_menu_username_container">
        <input type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon"></span>
        </label>
        <ul className="menu">
          <li className="menu_list_item">
              <a id="header_menu_bot_link" href="/" title="A link for Student Bot Helper home page">
              <img 
                id="header_menu_bot_icon" 
                src={studentBotHelperStarterIconSmaller}
                alt="An image of Student Bot Helper global site icon" 
              />
            </a> 
          </li>
          <li className="menu_list_item">
            <div id="navbar_welcome_message">
              {isUserLoggedIn ? (
                <>
                  {/* <Link id="index_commands_page" to={`/user/${user.username}`} title="A link that goes to the index page for logged-in users">
                    Home
                  </Link> */}
                  <h1 id="user_name_header">Welcome, username!</h1>
                </>
              ) : (
                <h1 id="user_name_header">Welcome, user</h1>
              )}
            </div>
          </li>
          <li className="menu_list_item">
            <div id="logout_button_container">
              {isUserLoggedIn ? (
                <form id="global_site_navigation_logout_form" action="/logout" method="POST">
                  <button id="global_site_navigation_logout_form_button" type="submit">
                    Log out
                  </button>
                </form>
              ) : (
                <Link id="index_page_login_page_button" to="/login" title="A link that goes to the login page">
                  Log in to your account
                </Link>
              )}
            </div>
          </li>
        </ul>
        {isUserLoggedIn ? (
        <div id="website_menu_username_container_anonymous_user">
            
        </div>
      ) : (
        <div id="website_menu_username_container_anonymous_user">

        </div>
      )}
      </div>
    </section>
  );
};

export default Menu;
