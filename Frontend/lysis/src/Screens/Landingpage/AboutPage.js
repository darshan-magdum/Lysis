import React from "react";
import "../../Styles/AboutPage.css";
import aboutVideo from "../../Images/AboutVideo.mp4"; 

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
                Lysis is an advanced AI-driven tool designed to revolutionize the way developers manage and document their codebases. Lysis automates the process of code analysis and documentation, providing a seamless experience that saves time and enhances productivity.
              </p>
              <br />
              <p className="description">
                With features such as AI-driven code analysis, custom query responses, and team management capabilities, Lysis is tailored to meet the needs of modern development teams and individual developers alike. Our goal is to simplify the documentation process and provide valuable insights into your codebase, so you can focus on what you do best—coding.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="about-video">
              <video width="100%" height="auto" autoPlay loop muted>
                <source src={aboutVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
