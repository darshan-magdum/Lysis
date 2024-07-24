import React from "react";

const ManagerMainContent = () => {
  const user = {
    Name: "John Doe",
    email: "john.doe@example.com",
    contact: "+1234567890",
  };

  const handleUpdateButtonClick = () => {
    console.log("Update button clicked");
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
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: "150px" }}
                  />

                  <h5 className="my-3">{user.Name}</h5>
                  <p className="text-muted mb-1">{user.email}</p>
                  <p className="text-muted mb-4">{user.contact}</p>

                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleUpdateButtonClick}
                    >
                      Update
                    </button>
                  </div>
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
