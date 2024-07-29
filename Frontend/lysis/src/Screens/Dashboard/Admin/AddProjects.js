import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import "../../../Styles/UploadDocument.css"; // Import your custom styles if any

const AddProjects = () => {
  // State to manage form inputs and validation
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectNameError, setProjectNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error messages
    setProjectNameError("");
    setDescriptionError("");

    // Validate inputs
    let hasErrors = false;
    if (!projectName) {
      setProjectNameError('Project name is required.');
      hasErrors = true;
    }
    if (!description) {
      setDescriptionError('Description is required.');
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      const response = await axios.post('http://localhost:8080/NewProjects/AddNewProjects', {
        projectName,
        description
      });

      if (response.status === 201) {
        toast.success('Project created successfully');
        setProjectName("");
        setDescription("");
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        error.response.data.errors.forEach(error => toast.error(error));
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-lg-9">
          <h5
            style={{
              textAlign: "left",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#20609c",
            }}
          >
            Add Projects
          </h5>
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="projectName" className="form-label">Project Name</label>
                  <input
                    type="text"
                    id="projectName"
                    className={`form-control ${projectNameError ? 'is-invalid' : ''}`}
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  {projectNameError && (
                    <div className="invalid-feedback">{projectNameError}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Project Description</label>
                  <textarea
                    id="description"
                    className={`form-control ${descriptionError ? 'is-invalid' : ''}`}
                    placeholder="Enter project description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {descriptionError && (
                    <div className="invalid-feedback">{descriptionError}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Add Project</button>
              </form>
            </div>
          </div>

          {/* Toast Container */}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AddProjects;
