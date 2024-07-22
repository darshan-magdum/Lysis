import React from "react";
import "../../Styles/Service.css";

function ServicesSection() {
  return (
    <section className="section-services">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-md-10 col-lg-8">
            <div className="header-section">
              <h2 className="title">
               Why<span> Lysis ?</span>
              </h2>
              <p className="description">
              Our AI-driven tool
                saves time on manual documentation and code reviews by
                automatically analyzing your codebase and generating detailed
                documentation.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <SingleService
            title="AI-Driven Code Analysis"
            description="Lysis automatically analyzes your entire codebase to provide detailed insights and understanding, saving you hours of manual review."
          />

          <SingleService
            title="Comprehensive Documentation"
            description="Generate detailed and structured documentation for your codebase effortlessly. Lysis handles the documentation so you can focus on development."
          />

          <SingleService
            title="Custom Query Responses"
            description="Ask Lysis specific questions about your code. Our tool provides accurate answers to help you understand and navigate your codebase more efficiently."
          />

          <SingleService
            title="Time-Saving Automation"
            description="Eliminate the need for manual documentation and code reviews. Lysis automates these processes, allowing you to concentrate on writing code."
          />

          <SingleService
            title="User-Friendly Interface"
            description="Lysis features an intuitive interface designed to make code analysis and documentation as straightforward as possible for developers of all levels."
          />

          <SingleService
            title="Team Access and Management"
            description="Managers can create accounts and manage team access to codebase documentation. Team members can ask prompts regarding the code, facilitating collaborative and efficient code analysis."
          />
        </div>
      </div>
    </section>
  );
}

function SingleService({ title, description }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="single-service">
        <div className="part-1">
          <h3 className="title">{title}</h3>
        </div>
        <div className="part-2">
          <p className="description">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default ServicesSection;
