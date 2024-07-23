import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeNavbar = () => {
  const navigate = useNavigate();
  return (
    <header className="landing-page">
      <div className="container">
        <a href="#" className="logo">
          <b>Lysis</b>
        </a>
        <ul className="links">
          <li>Home</li>
          <li>About Us</li>
          <li>Contact Us</li>
          <li>
            <Link to="/Signup">Get Started</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default HomeNavbar;
