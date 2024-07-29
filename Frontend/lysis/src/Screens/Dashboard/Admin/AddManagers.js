import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import "../../../Styles/UploadDocument.css"; 

const AddManagers = () => {
  // State to manage form inputs and validation
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [assignedProjects, setAssignedProjects] = useState([]);
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [assignedProjectsError, setAssignedProjectsError] = useState("");

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error messages
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setAssignedProjectsError("");

    // Validate inputs
    let hasErrors = false;
    if (!name) {
      setNameError('Manager name is required.');
      hasErrors = true;
    }
    if (!email) {
      setEmailError('Email is required.');
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid.');
      hasErrors = true;
    }
    if (!password) {
      setPasswordError('Password is required.');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      hasErrors = true;
    }
    if (!assignedProjects.length) {
      setAssignedProjectsError('At least one assigned project is required.');
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      const response = await axios.post('http://localhost:8080/Manager/signup', {
        name,
        email,
        password,
        AssignedProjects: assignedProjects
      });

      if (response.status === 201) {
        toast.success('Manager account created successfully');
        setName("");
        setEmail("");
        setPassword("");
        setAssignedProjects([]);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  // Handle adding/removing assigned projects
  const handleAddProject = () => {
    const newProject = prompt("Enter project name:");
    if (newProject && !assignedProjects.includes(newProject)) {
      setAssignedProjects([...assignedProjects, newProject]);
    }
  };

  const handleRemoveProject = (project) => {
    setAssignedProjects(assignedProjects.filter(p => p !== project));
  };

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-lg-7">
          <h5
            style={{
              textAlign: "left",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#20609c",
            }}
          >
            Add Manager
          </h5>
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Manager Name</label>
                  <input
                    type="text"
                    id="name"
                    className={`form-control ${nameError ? 'is-invalid' : ''}`}
                    placeholder="Enter manager name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {nameError && (
                    <div className="invalid-feedback">{nameError}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <div className="invalid-feedback">{passwordError}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="assignedProjects" className="form-label">Assigned Projects</label>
                  <button type="button" className="btn btn-secondary" onClick={handleAddProject}>
                    Add Project
                  </button>
                  <ul className="list-group mt-2">
                    {assignedProjects.map((project, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {project}
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveProject(project)}>
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  {assignedProjectsError && (
                    <div className="invalid-feedback d-block">{assignedProjectsError}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Add Manager</button>
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

export default AddManagers;
