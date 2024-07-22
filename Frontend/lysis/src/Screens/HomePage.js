import React from 'react';
import '../Styles/HomePage.css'; 
import HomeNavbar from '../Components/HomeNavbar';
import CodeGirl from "../../src/Images/CodeGirl.png"

const HomePage = () => {
  return (
    <div className="main-container">
      <div className="blur-circle1"></div>
      <div className="blur-circle2"></div>
      <div className="landing-page">
        <HomeNavbar/>
        <div className="content">
          <div className="container">
            <div className="info">
              <h1>Unveil Code Complexity</h1>
              <p>
              Enhance code understanding with AI-driven analysis and detailed documentation.
 We Save time on manual documentation and code reviews.

              </p>
              <button>Explore More</button>
            </div>
            <div className="image">
              <img
                className="main-image"
                src={CodeGirl}
                alt="Coding Girl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
