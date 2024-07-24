import React from "react";

const ManagerSider = () => {
  return (
   
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-light"
        style={{ height: "100%" }}
      >
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a href="#" className="nav-link text-light">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="material-symbols-outlined text-light">
                  home
                </span>
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
                <span className="material-symbols-outlined text-light">
                  visibility
                </span>
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
                <span className="material-symbols-outlined text-light">
                  info
                </span>
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
  
  );
};

export default ManagerSider;
