import React from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const HomeNavbar = () => {
  return (
    <header className="landing-page">
      <div className="container">
        <a href="#" className="logo">
          <b>Lysis</b>
        </a>
        <ul className="links">
          <li>
            <ScrollLink to="home-section" smooth={true} duration={500}>
              Home
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="about-section" smooth={true} duration={500}>
              About Us
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="contact-section" smooth={true} duration={500}>
              Contact Us
            </ScrollLink>
          </li>
          <li>
            <Link to="/Login">Get Started</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default HomeNavbar;
