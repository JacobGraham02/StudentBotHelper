import React, { ReactElement, useContext } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import StudentBotHelperStarterIconSmaller from "../../assets/images/StudentBotHelperStarterIconSmaller.png"

// Context
import { AuthContext } from "../../contexts/AuthContext";
import Footer from "../../components/Footer/Footer";

const DefaultLayout = (): ReactElement => {
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  let sideBar;

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

  const navLinkActiveStyle = {
    fontWeight: "bold",
    color: "red"
  };

  if (authCtx?.userAuthDetails.refreshToken === "") {
    sideBar = (
      <div className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar full-height-sidebar container-fluid">
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
            style={{ ...navLinkStyle, ...navLinkHoverStyle, ...(location.pathname === "/home" && navLinkActiveStyle) }}
          >
            <p id="home_link">Home</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard" 
            className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`} 
            style={{ ...navLinkStyle, ...navLinkHoverStyle, ...(location.pathname === "/dashboard" && navLinkActiveStyle) }}
          >
              <p id="dashboard_link">Dashboard</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/commands" 
              className={`nav-link ${location.pathname === "/commands" ? "active" : ""}`} 
              style={{ ...navLinkStyle, ...navLinkHoverStyle, ...(location.pathname === "/commands" && navLinkActiveStyle) }}
          >
              <p id="commands_link">Commands</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/configurations" 
              className={`nav-link ${location.pathname === "/configurations" ? "active" : ""}`} 
              style={{ ...navLinkStyle, ...navLinkHoverStyle, ...(location.pathname === "/configurations" && navLinkActiveStyle) }}
          >
              <p id="configurations_link">Configurations</p>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/logs" 
              className={`nav-link ${location.pathname === "/logs" ? "active" : ""}`} 
              style={{ ...navLinkStyle, ...navLinkHoverStyle, ...(location.pathname === "/logs" && navLinkActiveStyle) }}
          >
              <p id="log_files_link">Log files</p>
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
  if (authCtx?.userAuthDetails.refreshToken !== "") {
    sideBar = (
      <div className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar full-height-sidebar">
        {/* Placeholder for an image at the top of the sidebar */}
        <div className="mb-4 pt-3 text-center">
          <img
            src="/path-to-your-image.jpg"
            alt="Placeholder"
            style={{ maxWidth: "80%", borderRadius: "50%" }}
          />
        </div>

        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}

        {sideBar}

        {/* Main content */}
        <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
