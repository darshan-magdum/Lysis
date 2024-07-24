import React from "react";
import avatarImage from "../../../Images/avatar profile.jpg";

const ManagerHome = () => {
  return (
    <div
      style={{ backgroundColor: "#eee", minHeight: "100vh", padding: "20px 0" }}
    >
      <div className="container py-3">
        <div className="row">
          <div className="col-lg-12">
            <h5
              style={{
                textAlign: "left",
                fontWeight: "bold",
                marginBottom: "10px",
                marginTop: "-10px",
                color: "#20609c",
              }}
            >
              Home
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
