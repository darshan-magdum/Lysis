import React, { useState, useRef, useEffect } from "react";
import ManagerSider from "./ManagerSider";
import ProfileAvatar from "../../../Images/avatar profile.jpg";
import ManagerHome from "./ManagerHome"; // Import new components
import Analyze from "./Analyze"; // Import new components
import ViewDocumentation from "./ViewDocumentation";
import CustomPrompt from "./CustomPrompt";
import { useLocation } from 'react-router-dom';
import axios from "axios"
import UMLDiagram from "./UMLDiagram";
import SequenceDiagram from "./SequenceDiagram";
import AddMembers from "./AddMembers";
import ViewMembers from "./ViewMembers";


const ManagerDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const managerId = searchParams.get('managerId');
  const [profileCardOpen, setProfileCardOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // Add state to manage current page
  const dropdownRef = useRef(null);
  const profileCardRef = useRef(null);
  const [managerData, setManagerData] = useState(null);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/Manager/manager/${managerId}`);
        setManagerData(response.data);
      } catch (error) {
        console.error("Error fetching manager data:", error);
      }
    };

    fetchManagerData();
  }, [managerId]);


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
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location = "/";
  };

  // Handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return <ManagerHome />;
      case "analyze":
        return <Analyze />;
      case "documentation":
        return <ViewDocumentation />;
      case "customPrompt":
        return <CustomPrompt />;
      case "UMLDiagram":
        return <UMLDiagram />;
      case "SequenceDiagram":
        return <SequenceDiagram />;
      case "AddMembers":
        return <AddMembers />;
      case "ViewMembers":
        return <ViewMembers />;
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
            position: "fixed",
            top: "55px",
            right: "10px",
            width: "240px",
            zIndex: "1000",
          }}
          ref={profileCardRef}
        >
          <div className="card-body text-center">
            <img
              src={ProfileAvatar}
              alt="avatar"
              className="rounded-circle img-fluid"
              style={{ width: "110px", borderRadius: "50%", marginTop: "-20px" }}
            />
            <hr
              style={{
                border: "0",
                borderTop: "1px solid #ddd",
                margin: "5px 0",
              }}
            />
            <h6 className="my-3" style={{ marginTop: "15px" }}>
              {managerData ? managerData.name : ""}
            </h6>
            <p
              className="text-muted mb-1"
              style={{ color: "#6c757d", marginBottom: "0", fontSize: "15px" }}
            >
              {managerData ? managerData.email : ""}
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
                padding: "5px",
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
            fontSize: "Large",
          }}
        >
          <ManagerSider handleNavigation={handleNavigation} />
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
