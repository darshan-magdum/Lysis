import React, { useState, useEffect } from "react";
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
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [assignedProjectsError, setAssignedProjectsError] = useState("");

  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/NewProjects/GetAllprojects');
        if (response.data.message === "Projects retrieved successfully") {
          setAllProjects(response.data.projects);
        } else {
          toast.error('Failed to load projects.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching projects.');
      }
    };

    fetchProjects();
  }, []);

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
      setAssignedProjectsError('At least one project must be assigned.');
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
        setSelectedProject("");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  // Handle adding selected project 
  const handleAddProject = () => {
    const project = allProjects.find(p => p._id === selectedProject);
    if (project && !assignedProjects.includes(project._id)) {
      setAssignedProjects([...assignedProjects, project._id]);
    }
    setSelectedProject(""); 
  };

  // Handle removing a project
  const handleRemoveProject = (projectId) => {
    setAssignedProjects(assignedProjects.filter(p => p !== projectId));
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
                  <label htmlFor="assignedProjects" className="form-label">Assign Projects</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      id="projectDropdown"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="">Select a project</option>
                      {allProjects.map(project => (
                        <option key={project._id} value={project._id}>
                          {project.projectName}
                        </option>
                      ))}
                    </select>
                    {selectedProject && (
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={handleAddProject}
                      >
                        Add Project
                      </button>
                    )}
                  </div>
                  <ul className="list-group mt-3">
                    {assignedProjects.map((projectId, index) => {
                      const project = allProjects.find(p => p._id === projectId);
                      return (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {project ? project.projectName : 'Unknown Project'}
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveProject(projectId)}
                          >
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {assignedProjectsError && (
                    <div className="invalid-feedback d-block">{assignedProjectsError}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">Add Manager</button>
              </form>
            </div>
          </div>

          
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AddManagers;
