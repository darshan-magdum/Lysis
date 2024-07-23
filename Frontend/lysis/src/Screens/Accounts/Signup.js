import React, { useState } from 'react';
import '../../Styles/Accounts.css'; // Import your CSS file if you have one

const Signup = () => {
  // State hooks for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic here
    console.log({ firstName, lastName, email, password });
  };

  return (
    <div className="Accounts-container">
      <div className="right-section">
        <div className="right-section-wrapper">
          <h1 className="Accounts-title">
          Welcome! Let's get started by creating your account.
          </h1>
          <h4 className="Accounts-description">
          We Save your time on manual documentation and code reviews.
          </h4>
        </div>
      </div>

      <div className="left-section">
        <div className="left-section-wrapper">
          <div className="form">
            <form autoComplete="off" onSubmit={handleSubmit}>
              <input 
                type="text" 
                className="first-name" 
                placeholder="First Name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
              />
              <input 
                type="text" 
                className="last-name" 
                placeholder="Last Name" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
              />
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
                <span className="form-btn-text">Create Account</span>
              </button>
              <p className="terms">
                By clicking the button, you are agreeing to our
                <span className="terms-highlight">
                  Terms and Services
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
