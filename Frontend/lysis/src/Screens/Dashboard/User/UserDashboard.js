import React, { useState, useRef, useEffect } from "react";
import UserMainContent from "./UserMainContent";
import UserSidebar from "./UserSider";

const UserDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to toggle dropdown open/close
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
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

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div class="dropdown">
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
                  {" "}
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  {" "}
                  <div className="dropdown-divider"></div>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="row">
        <UserSidebar />
        <UserMainContent />
      </div>
    </div>
  );
};

export default UserDashboard;
