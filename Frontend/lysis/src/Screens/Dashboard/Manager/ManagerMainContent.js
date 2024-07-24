import React from "react";
import avatarImage from "../../../Images/avatar profile.jpg"

const ManagerMainContent = () => {
  const user = {
    Name: "John Doe",
    email: "john.doe@example.com",
    contact: "+1234567890",
  };



  return (
    <div className="col-lg-9 col-md-8 col-sm-7">
      <section style={{ backgroundColor: "#eee", minHeight: "100vh" }}>
        <div className="container py-3">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <img
                    src={avatarImage}
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: "180px" }}
                  />

                  <h5 className="my-3">{user.Name}</h5>
                  <p className="text-muted mb-1">{user.email}</p>


                
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagerMainContent;
