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

  // Add event listener when component mounts
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
              color: "white", // Icon color
              backgroundColor: "rgb(36, 75, 111)", // Background color of the icon area
              padding: "8px", // Padding around the icon
              borderRadius: "50%", // Rounded shape
            }}
          >
            account_circle
          </span>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              className="dropdown-menu dropdown-menu-dark text-small shadow show"
              style={{
                backgroundColor: "black",
                marginTop: "10px",
                marginLeft: "-100px",
                position: "absolute", // Ensure dropdown position is absolute
                zIndex: "1000", // Set a high z-index to ensure it appears on top
              }}
            >
              <a className="dropdown-item text-white" href="#">
                Profile
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item text-white" href="#">
                Sign out
              </a>
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
