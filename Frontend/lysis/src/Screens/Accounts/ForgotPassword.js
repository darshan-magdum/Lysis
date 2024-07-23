import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../Styles/Accounts.css";

const ForgotPassword = () => {
  // State hooks for form inputs
  const [email, setEmail] = useState("");

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic here
    console.log({ email });
  };

  return (
    <div className="Accounts-container">
      <div className="right-section">
        <div className="right-section-wrapper">
          <h1 className="Accounts-title">Forgot Your Password?</h1>
          <h4 className="Accounts-description">
            No worries! Enter your email address below and we will send you a
            reset link.
          </h4>
        </div>
      </div>

      <div className="left-section">
        <div className="left-section-wrapper">
          <div className="form">
            <form autoComplete="off" onSubmit={handleSubmit}>
              <input
                type="email"
                className="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="form-btn">
                <span className="form-btn-text">Send Reset Link</span>
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

export default ForgotPassword;
