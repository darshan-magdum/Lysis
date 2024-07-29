import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../Styles/UploadDocument.css";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [editProject, setEditProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ projectName: '', description: '' });
  const [validationErrors, setValidationErrors] = useState({ projectName: '', description: '' });

  useEffect(() => {
    axios.get("http://localhost:8080/NewProjects/GetAllprojects")
      .then(response => {
        setProjects(response.data.projects);
        setFilteredProjects(response.data.projects);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProjects(
        projects.filter(project =>
          project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProjects(projects);
    }
    setCurrentPage(1);
  }, [searchQuery, projects]);

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (project) => {
    setEditProject(project);
    setEditData({
      projectName: project.projectName,
      description: project.description
    });
    setValidationErrors({ projectName: '', description: '' });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = () => {
    const errors = {
      projectName: '',
      description: ''
    };
    let hasErrors = false;

    if (!editData.projectName) {
      errors.projectName = 'Project name is required.';
      hasErrors = true;
    }
    if (!editData.description) {
      errors.description = 'Description is required.';
      hasErrors = true;
    }

    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    axios.put(`http://localhost:8080/NewProjects/editprojects/${editProject._id}`, editData)
      .then(response => {
        const updatedProject = response.data.project;
        setProjects((prev) =>
          prev.map((proj) => (proj._id === updatedProject._id ? updatedProject : proj))
        );
        setFilteredProjects((prev) =>
          prev.map((proj) => (proj._id === updatedProject._id ? updatedProject : proj))
        );
        setIsEditing(false);
        toast.success('Project updated successfully!');
      })
      .catch(err => {
        setError(err);
        toast.error('Error updating project!');
      });
  };

  const lightGray = "#d3d3d3";
  const textColor = "#205C9C";

  const tableStyle = {
    border: `1px solid ${lightGray}`,
    borderCollapse: "collapse"
  };

  const cellStyle = {
    border: `1px solid ${lightGray}`
  };

  const centeredStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center'
  };

  const messageStyle = {
    color: textColor,
    fontSize: '1rem',
    fontWeight: 'bold'
  };

  const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    zIndex: 999
  };

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    zIndex: 1000,
    width: '80%',
    maxWidth: '600px'
  };

  const buttonStyle = {
    marginRight: '10px'
  };

  if (loading) {
    return (
      <div style={centeredStyle}>
        <p style={messageStyle}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={centeredStyle}>
        <p style={messageStyle}>Error fetching data: {error.message}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

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
            View Project Details
          </h5>
          <div className="mb-3">
            <div className="input-group" style={{ maxWidth: '500px' }}>
              <span
                className="input-group-text"
                style={{
                  backgroundColor: "#f1f1f1",
                  border: `1px solid ${lightGray}`,
                  borderRadius: "4px 0 0 4px",
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px'
                }}
              >
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                type="text"
                placeholder="Search by project name"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-control"
                style={{
                  borderLeft: 'none',
                  borderRadius: '0 4px 4px 0',
                  width: '100%'
                }}
              />
            </div>
          </div>
          <div className="table-responsive card">
            <table className="table table-striped table-bordered" style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>SR.NO</th>
                  <th style={cellStyle}>Project Name</th>
                  <th style={cellStyle}>Description</th>
                  <th style={cellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                      <p style={messageStyle}>No records found</p>
                    </td>
                  </tr>
                ) : (
                  currentProjects.map((project, index) => (
                    <tr key={project._id}>
                      <td style={cellStyle}>{indexOfFirstProject + index + 1}</td>
                      <td style={cellStyle}>{project.projectName}</td>
                      <td style={cellStyle}>{project.description}</td>
                      <td style={cellStyle}>
                        <button
                          onClick={() => handleEditClick(project)}
                          style={{
                            backgroundColor: '#20609c',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredProjects.length > 0 && (
            <div className="pagination" style={{ marginTop: "20px", display: 'flex', justifyContent: 'flex-end' }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: currentPage === index + 1 ? '#20609c' : '#f1f1f1',
                    color: currentPage === index + 1 ? '#fff' : '#000',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
          {isEditing && (
            <div style={modalBackdropStyle}>
              <div style={modalStyle}>
                <h5>Edit Project</h5>
                <div className="mb-3">
                  <label htmlFor="projectName" className="form-label">Project Name</label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={editData.projectName}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                  {validationErrors.projectName && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                      {validationErrors.projectName}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                  {validationErrors.description && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                      {validationErrors.description}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={handleEditSubmit}
                    className="btn btn-primary"
                    style={buttonStyle}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ViewProjects;
