import React, { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import styles from "../../assets/css/Sidebar.module.css";
import StudentBotHelperStarterIconSmaller from "../../assets/images/StudentBotHelperStarterIconSmaller.png";

// Context
import { AuthContext } from "../../contexts/AuthContext";

const DefaultLayout = () => {
  const authCtx = useContext(AuthContext);
  let sidebar;

  if (authCtx?.isLoggedIn()) {
    sidebar = (
      <>
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
          id="menu"
        >
          <li className="nav-item">
            <NavLink to="/" className="nav-link align-middle px-0 text-black">
              <i className="fs-4 bi-house"></i>
              <span className="ms-1 d-none d-sm-inline">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className="nav-link px-0 align-middle text-black"
            >
              <i className="fs-4 bi-speedometer2"></i>{" "}
              <span className="ms-1 d-none d-sm-inline">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/commands"
              className="nav-link px-0 align-middle text-black"
            >
              <i className="fs-4 bi-terminal"></i>
              <span className="ms-1 d-none d-sm-inline">Commands</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/configurations"
              className="nav-link px-0 align-middle text-black"
            >
              <i className="fs-4 bi-cogs"></i>
              <span className="ms-1 d-none d-sm-inline">Configurations</span>
            </NavLink>
          </li>

          {authCtx?.userAuthDetails.role === 4 && (
            <li>
              <NavLink
                to="/users"
                className="nav-link px-0 align-middle text-black"
              >
                <i className="fs-4 bi-terminal"></i>
                <span className="ms-1 d-none d-sm-inline">Users</span>
              </NavLink>
            </li>
          )}
        </ul>
        <hr />
        <Dropdown
          as="li"
          className="nav-item mt-auto mb-4"
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
              {authCtx.userAuthDetails.name}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
            <Dropdown.Item as={NavLink} to="/profile">
              Profile
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/settings">
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={authCtx.logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  } else {
    sidebar = (
      <>
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
          id="menu"
        >
          <li className="nav-item">
            <NavLink
              to="/login"
              className="nav-link align-middle px-0 text-black"
            >
              {/* <i className="fs-4 bi-house"></i> */}
              <span className="ms-1 d-none d-sm-inline">Login</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className="nav-link px-0 align-middle text-black"
            >
              {/* <i className="fs-4 bi-speedometer2"></i>{" "} */}
              <span className="ms-1 d-none d-sm-inline">Register</span>
            </NavLink>
          </li>
        </ul>
      </>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-black min-vh-100">
            <a
              href="/"
              className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-black text-decoration-none"
            >
              <img
                src={StudentBotHelperStarterIconSmaller}
                alt="Logo"
                className={styles.profileImage}
              />
              <span className="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            {sidebar}
          </div>
        </div>
        <div className="col py-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
