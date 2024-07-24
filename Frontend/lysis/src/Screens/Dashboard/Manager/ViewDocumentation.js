import React from "react";

const ViewDocumentation = () => {
  return (
    <section
      style={{ backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "20px 0" }}
    >
      <div className="container py-3">
        <div className="row">
          <div className="col-lg-12">
            <h5
              style={{
                textAlign: "left",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#20609c",
              }}
            >
              View Documentation
            </h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h6
                style={{
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "10px",
                }}
              >
                Document Title
              </h6>
              <p
                style={{
                  color: "#666",
                  marginBottom: "15px",
                }}
              >
                Brief description of the document goes here. This text can be a summary or a short overview of what the document is about.
              </p>
              <a
                href="#"
                style={{
                  color: "#20609c",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                View Document
              </a>
            </div>
          </div>
          {/* Repeat the above card structure for more documents */}
        </div>
      </div>
    </section>
  );
};

export default ViewDocumentation;
