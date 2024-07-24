import React from "react";
import avatarImage from "../../../Images/avatar profile.jpg";

const ManagerProfile = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <section
      style={{ backgroundColor: "#eee", minHeight: "100vh", padding: "20px 0" }}
    >
      <div className="container py-3">
        <div className="row">
          <div className="col-lg-4">
            <h5
              style={{
                textAlign: "left",
                fontWeight: "bold",
                marginBottom: "10px",
                marginTop: "-10px",
                color: "#20609c",
              }}
            >
              Your Profile
            </h5>
            <div className="card mb-4">
              <div className="card-body text-center">
                <img
                  src={avatarImage}
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: "180px", borderRadius: "50%" }}
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
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            {/* Add any additional content you want here */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagerProfile;
