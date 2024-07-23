import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../Styles/Accounts.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="Accounts-container">
      <div className="right-section">
        <div className="right-section-wrapper">
          <h1 className="Accounts-title">
            Welcome Back! Please log in to your account.
          </h1>
          <h4 className="Accounts-description">
            We save your time on manual documentation and code reviews.
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
              <input
                type="password"
                className="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="form-btn">
                <span className="form-btn-text">Log In</span>
              </button>
            </form>

            <p className="terms">
              Don't have an account?
              <span className="terms-highlight">
                &nbsp;
                <Link to="/Signup" style={{ color: "rgb(255, 122, 122)" }}>
                  sign up
                </Link>
              </span>
              <br></br>
              <Link to="/Forget">Forgot Password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
