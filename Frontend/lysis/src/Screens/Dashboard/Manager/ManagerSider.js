import React from "react";

const ManagerSider = ({ handleNavigation }) => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-light"
      style={{ height: "100%" }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-light"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              handleNavigation("home"); // Navigate to Home
            }}
          >
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
          <a
            href="#"
            className="nav-link text-light"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              handleNavigation("analyze"); // Navigate to Home
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="material-symbols-outlined text-light">
              search
              </span>
              <svg className="bi me-2 text-light" width="16" height="16">
                <use xlinkHref="#Analyze"></use>
              </svg>
              <span>Analyze</span>
            </div>
          </a>
        </li>

        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-light"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              handleNavigation("documentation"); // Navigate to View Documentation
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="material-symbols-outlined text-light">
              article
              </span>
              <svg className="bi me-2 text-light" width="16" height="16">
                <use xlinkHref="#table"></use>
              </svg>
              <span>Documentation</span>
            </div>
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-light"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              handleNavigation("customPrompt"); // Navigate to Custom Prompt
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="material-symbols-outlined text-light">
              keyboard
              </span>
              <svg className="bi me-2 text-light" width="16" height="16">
                <use xlinkHref="#table"></use>
              </svg>
              <span>Custom Prompt</span>
            </div>
          </a>
        </li>


        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-light"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              handleNavigation("UMLDiagram"); // Navigate to Custom Prompt
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
            <span class="material-symbols-outlined">
family_history
</span>
              <svg className="bi me-2 text-light" width="16" height="16">
                <use xlinkHref="#table"></use>
              </svg>
              <span>UML Diagram</span>
            </div>
          </a>
        </li>
        
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-light"
            onClick={(e) => {
              e.preventDefault(); 
              handleNavigation("AddMembers"); // Navigate to Add Members
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="material-symbols-outlined text-light">
              group_add
              </span>
              <svg className="bi me-2 text-light" width="16" height="16">
                <use xlinkHref="#home"></use>
              </svg>
              <span>Add Members</span>
            </div>
          </a>
        </li>


        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-light"
            onClick={(e) => {
              e.preventDefault(); 
              handleNavigation("ViewMembers"); // Navigate to View Members
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="material-symbols-outlined text-light">
              person_4
              </span>
              <svg className="bi me-2 text-light" width="16" height="16">
                <use xlinkHref="#table"></use>
              </svg>
              <span>View Members</span>
            </div>
          </a>
        </li>
      </ul>
      <hr className="text-light" />
    </div>
  );
};

export default ManagerSider;
