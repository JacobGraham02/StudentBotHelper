import React, { ReactElement } from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout = (): ReactElement => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar full-height-sidebar">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Dashboard
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Dashboard
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Dashboard
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Dashboard
              </a>
            </li>
            {/* Add more nav items here */}
          </ul>
        </div>

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
