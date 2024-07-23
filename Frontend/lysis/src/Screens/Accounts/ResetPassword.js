import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../Styles/Accounts.css";

const ResetPassword = () => {
  // State hooks for form inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Add form submission logic here
    console.log({ password });
  };

  return (
    <div className="Accounts-container">
      <div className="right-section">
        <div className="right-section-wrapper">
          <h1 className="Accounts-title">Reset Your Password</h1>
          <h4 className="Accounts-description">
            Enter your new password below.
          </h4>
        </div>
      </div>

      <div className="left-section">
        <div className="left-section-wrapper">
          <div className="form">
            <form autoComplete="off" onSubmit={handleSubmit}>
              <input
                type="password"
                className="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                className="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" className="form-btn">
                <span className="form-btn-text">Reset Password</span>
              </button>
            </form>
            <p className="terms">
              Go Back to -
              <Link to="/Login" style={{ color: "rgb(255, 122, 122)",fontWeight:"bold" }}>
                &nbsp;Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
