import React from "react";
import "../../Styles/AboutPage.css";
import aboutImage from "../../Images/AboutImage.jpg"; // Adjust the path to your image

function AboutPage() {
  return (
    <section className="section-about">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="about-info">
              <h2 className="title">
                About <span>Us</span>
              </h2>
              <p className="description">
                Lysis is an advanced AI-driven tool designed to revolutionize the way developers manage and document their codebases. By leveraging cutting-edge technology, Lysis automates the process of code analysis and documentation, providing a seamless experience that saves time and enhances productivity.
              </p>
              <br></br>
              <p className="description">
                With features such as AI-driven code analysis, custom query responses, and team management capabilities, Lysis is tailored to meet the needs of modern development teams and individual developers alike. Our goal is to simplify the documentation process and provide valuable insights into your codebase, so you can focus on what you do best—coding.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="about-image">
              <img src={aboutImage} alt="About Lysis" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
