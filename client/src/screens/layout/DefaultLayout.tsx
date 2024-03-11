import React, { useContext } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import styles from "../../assets/css/Sidebar.module.css";
import StudentBotHelperStarterIconSmaller from "../../assets/images/StudentBotHelperStarterIconSmaller.png";

// Context
import { AuthContext } from "../../contexts/AuthContext";
import { faFolder, faGear, faHouse, faPerson, faRightToBracket, faTableColumns, faTerminal, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DefaultLayout = () => {
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  let sideBar;

  /*
  const navLinkStyle = {
    fontWeight: "bold"
  };

  const navLinkHoverStyle = {
    transition: "all 0.3s ease",
    ":hover": {
      fontSize: "1.2em",
      color: "blue"
    }
  };
  */

  const linkIconMargin = {
    marginRight: "1%"
  };

  const navLinkActiveStyle = {
    fontWeight: "bold",
    color: "red"
  };

  const sideBarLoggedIn = (
    <div className={`col-md-3 col-lg-2 d-none d-md-block bg-light sidebar full-height-sidebar container-fluid`}>
      <ul className="nav flex-column flex-fill d-flex flex-column justify-content-center text-center">
        <li className="nav-item">
          <img
            id="defaultLayoutSidebarImage"
            src={StudentBotHelperStarterIconSmaller}
            alt="An image icon of our bot icon"
            className="p-3"
          />
        </li>
        <li className="nav-item">
          <NavLink to="/home" 
          className={`nav-link ${location.pathname === "/home" ? "active" : ""}`} 
          style={{ ...(location.pathname === "/home" && navLinkActiveStyle) }}
        >
          <FontAwesomeIcon icon={faHouse} />
          <span className="ms-1 d-none d-sm-inline">Home</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard" 
          className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`} 
          style={{ ...(location.pathname === "/dashboard" && navLinkActiveStyle) }}
        >
          <FontAwesomeIcon icon={faTableColumns} />
          <span className="ms-1 d-none d-sm-inline">Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/commands" 
            className={`nav-link ${location.pathname === "/commands" ? "active" : ""}`} 
            style={{ ...(location.pathname === "/commands" && navLinkActiveStyle) }}
        >
            <FontAwesomeIcon icon={faTerminal} />
            <span className="ms-1 d-none d-sm-inline">Commands</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/configurations" 
            className={`nav-link ${location.pathname === "/configurations" ? "active" : ""}`} 
            style={{ ...(location.pathname === "/configurations" && navLinkActiveStyle) }}
        >
            <FontAwesomeIcon icon={faGear} />
            <span className="ms-1 d-none d-sm-inline">Configurations</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/logs" 
            className={`nav-link ${location.pathname === "/logs" ? "active" : ""}`} 
            style={{ ...(location.pathname === "/logs" && navLinkActiveStyle) }}
        >
            <FontAwesomeIcon icon={faFolder} style={linkIconMargin}/>
            <span id="log_files_link">Log files</span>
          </NavLink>
        </li>

        {authCtx?.userAuthDetails.role === 4 && (
            <li>
              <NavLink
                to="/users"
                className="nav-link px-0 align-middle text-black"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="ms-1 d-none d-sm-inline">Users</span>
              </NavLink>
            </li>
          )}
      <hr />
        <Dropdown
            as="li"
            className="nav-item mt-auto mb-4"
            drop="down"
            style={{ listStyleType: "none" }}
          >
            <Dropdown.Toggle
              as="a"
              className={`d-flex align-items-center text-black text-decoration-none ${styles.profileDropdownToggle}`}
              id="dropdownUser1"
            >
              <img
                src="http://localhost:8080/images/users/profile/default.png"
                alt="Profile"
                className={styles.profileImage}
              />
              <span className="ms-2 d-none d-sm-inline text-black-50">
                {authCtx!.userAuthDetails.name}
              </span>
            </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
                <Dropdown.Item as={NavLink} to="/profile">
                  Profile
                </Dropdown.Item>
                {/* <Dropdown.Item as={NavLink} to="/settings">
                  Settings
                </Dropdown.Item> */}
                <Dropdown.Divider />
                <Dropdown.Item onClick={authCtx!.logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
        </ul>
    </div>
  );

  const sideBarNotLoggedIn = (
      <div className={`col-md-3 col-lg-2 d-none d-md-block bg-light sidebar full-height-sidebar container-fluid`}>
        <ul className="nav flex-column flex-fill d-flex flex-column justify-content-center text-center">
          <li className="nav-item">
            <img
              id="defaultLayoutSidebarImage"
              src={StudentBotHelperStarterIconSmaller}
              alt="An image icon of our bot icon"
              className="p-3"
            />
          </li>
          <li className="nav-item">
            <NavLink
              to="/login"
              className={`nav-link ${location.pathname === '/login' ? "active" : ""}`}
              style={{ ...(location.pathname === "/login" && navLinkActiveStyle) }}
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              <span className="ms-1 d-none d-sm-inline">Login</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className={`nav-link ${location.pathname === '/register' ? "active" : ""}`}
              style={{ ...(location.pathname === "/register" && navLinkActiveStyle) }}
            >
              <FontAwesomeIcon icon={faPerson} />
              <span className="ms-1 d-none d-sm-inline">Register</span>
            </NavLink>
          </li>
        </ul>
    </div>
  );

  if (authCtx?.isLoggedIn()) {
    sideBar = {...sideBarLoggedIn}
      
  } else {
    sideBar = {...sideBarNotLoggedIn}
  }
    
  return (
    <div className="container-fluid">
      <div className="row">

        {sideBar}

        <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
