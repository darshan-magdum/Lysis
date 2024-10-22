import React, { useRef } from "react";
import { useInView } from "react-intersection-observer";
import "../../Styles/HomePage.css";
import HomeNavbar from "../../Components/HomeNavbar";
import CodeGirl from "../../../src/Images/CodeGirl.png";
import ServicesSection from "./ServicesSection";
import ContactPage from "./ContactPage";
import AboutPage from "./AboutPage";
import HomeFooter from "../../Components/HomeFooter";

const HomePage = () => {
  const { ref: homeRef, inView: homeInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const aboutRef = useRef(null);

  const handleExploreClick = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="blur-circle1"></div>
        <div className="blur-circle2"></div>
        <div className="landing-page" id="home-section">
          <HomeNavbar />
          <div
            className={`content slide-up-section ${homeInView ? "visible" : ""}`}
            ref={homeRef}
          >
            <div className="container">
              <div className="info">
                <h1>Unveil Code Complexity</h1>
                <p>
                  Enhance code understanding with AI-driven analysis and detailed
                  documentation. We Save time on manual documentation and code
                  reviews.
                </p>
                <button onClick={handleExploreClick}>Explore More</button>
              </div>
              <div className="image">
                <img className="main-image" src={CodeGirl} alt="Coding Girl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="about-section" ref={aboutRef}>
        <AboutPage />
      </div>
      <div id="services-section">
        <ServicesSection />
      </div>
      <div id="contact-section">
        <ContactPage />
      </div>
      <HomeFooter/>
    </>
  );
};

export default HomePage;
