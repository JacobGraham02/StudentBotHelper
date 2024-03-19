import React, { ReactElement, useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import StudentBotHelperStarterIconSmaller from "../../assets/images/StudentBotHelperStarterIconSmaller.png"

// Context
import { AuthContext } from "../../contexts/AuthContext";

const DefaultLayout = (): ReactElement => {
  const authCtx = useContext(AuthContext);
  let sideBar;

  if (authCtx?.userAuthDetails.refreshToken === "") {
    sideBar = (
      <div className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar full-height-sidebar">
        <ul className="nav flex-column">
          <li className="nav-item">
            <img
              id="defaultLayoutSidebarImage"
              src={StudentBotHelperStarterIconSmaller}
              alt="An image icon of our bot icon"
            />
          </li>
          <li className="nav-item">
            <NavLink to="/home" className="nav-link">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/commands" className="nav-link">
              Commands
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/configurations" className="nav-link">
              Configurations
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/logs" className="nav-link">
              Log files
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

      {/* Footer */}
      {/* <footer className="footer mt-auto py-3 bg-light">
        <div className="container">
          <span>Footer</span>
        </div>
      </footer> */}
    </div>
  );
};

export default DefaultLayout;
