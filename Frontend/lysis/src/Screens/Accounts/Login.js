import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../../Styles/Accounts.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  


  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/Manager/login", {
        email,
        password,
      });
      const { managerId } = response.data;
      toast.success("Login successful!", { autoClose: 3000 });
      setTimeout(() => {
        window.location = `/ManagerDashboard?managerId=${managerId}`;
     
      }, 3000);
    } catch (error) {
      console.error("Login Error:", error.response.data);
      setError("Invalid email or password. Please try again.");
    }
  };



  return (
    
    <div className="Accounts-container">
            <ToastContainer position="top-right" autoClose={2000} />
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
                required
              />
              <input
                type="password"
                className="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="form-btn">
                <span className="form-btn-text">Log In</span>
              </button>
            </form>
            {error && <p className="text-danger">{error}</p>}
            <p className="terms">
              Don't have an account?
              <span className="terms-highlight">
                &nbsp;
                <Link to="/Signup" style={{ color: "rgb(255, 122, 122)" }}>
                  sign up
                </Link>
              </span>
              <br />
              <Link to="/ForgotPassword">Forgot Password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
