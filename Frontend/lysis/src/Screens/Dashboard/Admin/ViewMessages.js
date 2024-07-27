import React, { useEffect, useState } from "react";
import "../../../Styles/UploadDocument.css";

const ViewMessages = () => {
  return (
    <div>
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
              View Messages
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMessages;
