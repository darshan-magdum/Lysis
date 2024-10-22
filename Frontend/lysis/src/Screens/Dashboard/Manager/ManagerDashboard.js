import React, { useState, useRef, useEffect } from "react";
import ManagerSider from "./ManagerSider";
import ProfileAvatar from "../../../Images/avatar profile.jpg";
import ManagerHome from "./ManagerHome"; // Import new components
import ViewDocumentation from "./ViewDocumentation";
import CustomPrompt from "./CustomPrompt";

const user = {
  name: "John Doe", // Replace with dynamic user name
  email: "john.doe@example.com" // Replace with dynamic user email
};

const ManagerDashboard = () => {
  const [profileCardOpen, setProfileCardOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // Add state to manage current page
  const dropdownRef = useRef(null);
  const profileCardRef = useRef(null);

  const toggleDropdown = () => {
    setProfileCardOpen(!profileCardOpen);
  };

  const handleClickOutside = (event) => {
    if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
      setProfileCardOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    // Add your sign-out logic here
    console.log("Sign out clicked");
    setProfileCardOpen(false);
  };

  // Handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page); // Set the current page
  };

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return <ManagerHome />;
      case "documentation":
        return <ViewDocumentation />;
      case "customPrompt":
        return <CustomPrompt />;
      default:
        return ""; // Default content if no page matches
    }
  };

  return (
    <div className="container-fluid" style={{ padding: 0 }}>
      <header
        className="row justify-content-between align-items-center py-2"
        style={{
          backgroundColor: "rgb(36, 75, 111)",
          color: "white",
          zIndex: 1000,
          position: "fixed",
          width: "100%",
          top: 0,
          left: 0,
          right: 0,
          margin: 0,
          padding: 0,
        }}
      >
        <div className="col-auto ml-3">
          <h2>Lysis</h2>
        </div>
        <div className="col-auto" ref={dropdownRef}>
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
        </div>
      </header>

      {profileCardOpen && (
        <div
          className="card mb-4"
          style={{
            position: "absolute",
            top: "55px",
            right: "10px",
            width: "250px",
            zIndex: "1000",
          }}
          ref={profileCardRef}
        >
          <div className="card-body text-center">
            <img
              src={ProfileAvatar}
              alt="avatar"
              className="rounded-circle img-fluid"
              style={{ width: "150px", borderRadius: "50%", marginTop: "-20px" }}
            />
            <hr
              style={{
                border: "0",
                borderTop: "1px solid #ddd",
                margin: "5px 0",
              }}
            />
            <h5 className="my-3" style={{ marginTop: "15px" }}>
              {user.name}
            </h5>
            <p
              className="text-muted mb-1"
              style={{ color: "#6c757d", marginBottom: "0" }}
            >
              {user.email}
            </p>

            <button
              onClick={handleSignOut}
              className="btn mt-3 d-flex align-items-center"
              style={{
                width: "100%",
                backgroundColor: "#20609c",
                color: "white",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  marginRight: "8px",
                  fontSize: "18px",
                }}
              >
                logout
              </span>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}

      <div className="row" style={{ marginTop: "55px", height: "100vh" }}>
        <div
          className="col-lg-3"
          style={{
            backgroundColor: "rgb(32, 96, 156)",
            position: "fixed",
            top: "65px",
            bottom: 0,
            overflowY: "auto",
            height: "100vh",
            padding: "20px",
            fontSize:"Large",
          }}
        >
          <ManagerSider handleNavigation={handleNavigation} /> {/* Pass navigation handler */}
        </div>
        <div
          className="col-lg-9 offset-lg-3"
          style={{
            backgroundColor: "#eee",
            padding: "20px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {renderContent()} {/* Render content based on state */}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
