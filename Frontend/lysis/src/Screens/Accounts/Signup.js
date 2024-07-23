import React, { useState } from 'react';
import '../../Styles/Accounts.css'; // Import your CSS file if you have one
import { Link } from 'react-router-dom';
 
const Signup = () => {
  // State hooks for form inputs
  const [name, setName] = useState('');
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 
  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic here
    console.log({ name, emailID, password, confirmPassword });
  };
 
  return (
    <div className="Accounts-container">
      <div className="right-section">
        <div className="right-section-wrapper">
          <h1 className="Accounts-title">
            Welcome! Let's get started by creating your account.
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
                type="text"
                className="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="emailID"
                placeholder="Email ID"
                value={emailID}
                onChange={(e) => setEmailID(e.target.value)}
              />
              <input
                type="password"
                className="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                className="confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" className="form-btn">
                <span className="form-btn-text">Create Account</span>
              </button>
              <p className="terms">
                By clicking the button, you are agreeing to our
                <span className="terms-highlight">
                  &nbsp;Terms and Services
                </span>
              </p>
            </form>
 
            <p className="terms">
              Already have an account?
              <Link to="/Login">&nbsp;Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Signup;
 
 