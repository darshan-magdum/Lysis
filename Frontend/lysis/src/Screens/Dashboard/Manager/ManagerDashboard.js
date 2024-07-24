import React, { useState, useRef, useEffect } from "react";
import ManagerMainContent from "./ManagerMainContent";
import ManagerSider from "./ManagerSider";

const ManagerDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to toggle dropdown open/close
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container-fluid">
      {/* Header */}
      <header
        className="row justify-content-between align-items-center py-2"
        style={{ backgroundColor: "rgb(36, 75, 111)", color: "white" }}
      >
        <div className="col-auto ml-3">
          {/* Your logo or title could go here */}
          <h2>Lysis</h2>
        </div>
        <div className="col-auto" ref={dropdownRef}>
          {/* Google icon */}
          <span
            className="material-symbols-outlined"
            onClick={toggleDropdown}
            style={{
              cursor: "pointer",
              marginRight: "10px",
              fontSize: "37px",
              color: "white",
              backgroundColor: "rgb(36, 75, 111)",
              padding: "8px",
              borderRadius: "50%",
            }}
          >
            account_circle
          </span>

          {dropdownOpen && (
            <div className="dropdown">
              <ul
                className="dropdown-menu dropdown-menu-dark text-small shadow show"
                style={{
                  marginTop: "-2px",
                  marginLeft: "-110px",
                  position: "absolute",
                  zIndex: "1000",
                }}
              >
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <span className="material-symbols-outlined" style={{ marginRight: '4px' }}>
                      contact_page
                    </span>
                    Profile
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider"></div>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <span className="material-symbols-outlined" style={{ marginRight: '4px' }}>
                      logout
                    </span>
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="row">
      <div
      className="col-lg-3"
      style={{ backgroundColor: "rgb(32, 96, 156)", minHeight: "100vh" }}
    >
        <ManagerSider />
        </div>
        <div className="col-lg-9"  style={{ backgroundColor: "#eee", minHeight: "100vh", padding: "20px 0" }}>
        <ManagerMainContent />
        </div>
      </div>
    
      
    </div>
  );
};

export default ManagerDashboard;
