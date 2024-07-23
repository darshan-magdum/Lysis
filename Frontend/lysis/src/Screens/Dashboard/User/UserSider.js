// Sidebar.js

import React from 'react';

const UserSidebar = () => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-5" style={{ backgroundColor: "rgb(32, 96, 156)", minHeight: "100vh" }}>
      <div className="d-flex flex-column flex-shrink-0 p-3 text-light" style={{ height: "100%" }}>
        <p className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-light text-decoration-none">
          <svg className="bi me-2" width="40" height="32">
            <use xlinkHref="#bootstrap"></use>
          </svg>
          <span className="fs-6">User Dashboard</span>
        </p>
        <hr className="text-light" />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a href="#" className="nav-link text-light">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="material-symbols-outlined text-light">home</span>
                <svg className="bi me-2 text-light" width="16" height="16">
                  <use xlinkHref="#home"></use>
                </svg>
                <span>Home</span>
              </div>
            </a>
          </li>
        
          <li className="nav-item">
            <a href="#" className="nav-link text-light">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="material-symbols-outlined text-light">visibility</span>
                <svg className="bi me-2 text-light" width="16" height="16">
                  <use xlinkHref="#table"></use>
                </svg>
                <span>View Documentation</span>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-light">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="material-symbols-outlined text-light">info</span>
                <svg className="bi me-2 text-light" width="16" height="16">
                  <use xlinkHref="#table"></use>
                </svg>
                <span>Custom Prompt</span>
              </div>
            </a>
          </li>
        </ul>
        <hr className="text-light" />
      </div>
    </div>
  );
};

export default UserSidebar;
