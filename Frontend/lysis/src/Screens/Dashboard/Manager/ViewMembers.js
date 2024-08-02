import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../Styles/UploadDocument.css";

const ViewMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [assignedProjects, setAssignedProjects] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  // Editing state
  const [editMember, setEditMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', assignedProjects: [] });
  const [validationErrors, setValidationErrors] = useState({ name: '', email: '', projects: '' });

  useEffect(() => {
    axios.get("http://localhost:8080/TeamMember/Getallteammembers")
      .then(response => {
        setMembers(response.data);
        setFilteredMembers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredMembers(
        members.filter(member =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredMembers(members);
    }
    setCurrentPage(1); // Reset to the first page when search query changes
  }, [searchQuery, members]);

  // Calculate paginated data
  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (member) => {
    setEditMember(member);
    setEditData({
      name: member.name,
      email: member.email,
      assignedProjects: member.assignedProjects
    });
    setAssignedProjects(member.assignedProjects);
    setValidationErrors({ name: '', email: '', projects: '' });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e) => {
    const { value } = e.target;
    if (!editData.assignedProjects.includes(value) && value !== "") {
      setEditData(prev => ({
        ...prev,
        assignedProjects: [...prev.assignedProjects, value]
      }));
    }
  };

  const handleEditSubmit = () => {
    const errors = {
      name: '',
      email: '',
      projects: ''
    };
    let hasErrors = false;

    if (!editData.name) {
      errors.name = 'Name is required.';
      hasErrors = true;
    }
    if (!editData.email) {
      errors.email = 'Email is required.';
      hasErrors = true;
    }
    if (editData.assignedProjects.length === 0) {
      errors.projects = 'At least one project must be assigned.';
      hasErrors = true;
    }

    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    axios.put(`http://localhost:8080/TeamMember/editteammember/${editMember._id}`, editData)
      .then(response => {
        const updatedMember = response.data;
        setMembers((prev) =>
          prev.map((mem) => (mem._id === updatedMember._id ? updatedMember : mem))
        );
        setFilteredMembers((prev) =>
          prev.map((mem) => (mem._id === updatedMember._id ? updatedMember : mem))
        );
        setIsEditing(false);
        toast.success('Member updated successfully!');
      })
      .catch(err => {
    
        setError(err.response.message);
        toast.error('Error updating member!');
      });
  };

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

  // Handle adding selected project 
  const handleAddProject = () => {
    const project = allProjects.find(p => p._id === selectedProject);
    if (project && !assignedProjects.includes(project._id)) {
      setAssignedProjects([...assignedProjects, project._id]);
      setEditData(prev => ({
        ...prev,
        assignedProjects: [...prev.assignedProjects, project._id]
      }));
      setSelectedProject(""); // Clear the selected project after adding
    }
  };

  // Handle removing a project
  const handleRemoveProject = (projectId) => {
    setAssignedProjects(assignedProjects.filter(p => p !== projectId));
    setEditData(prev => ({
      ...prev,
      assignedProjects: prev.assignedProjects.filter(p => p !== projectId)
    }));
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

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
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

  // Map project IDs to names for the table
  const projectMap = allProjects.reduce((acc, project) => {
    acc[project._id] = project.projectName;
    return acc;
  }, {});

  // Total pages
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

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
            View Team Members
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
                placeholder="Search by name"
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
                  <th style={cellStyle}>Name</th>
                  <th style={cellStyle}>Email</th>
                  <th style={cellStyle}>Projects</th>
                  <th style={cellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                      <p style={messageStyle}>No records found</p>
                    </td>
                  </tr>
                ) : (
                  currentMembers.map((member, index) => (
                    <tr key={member._id}>
                      <td style={cellStyle}>{indexOfFirstMember + index + 1}</td>
                      <td style={cellStyle}>{member.name}</td>
                      <td style={cellStyle}>{member.email}</td>
                      <td style={cellStyle}>
                        {member.assignedProjects.map(projectId => projectMap[projectId] || 'Unknown Project').join(', ')}
                      </td>
                      <td style={cellStyle}>
                        <button
                          onClick={() => handleEditClick(member)}
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
          {filteredMembers.length > 0 && (
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
                <h5>Edit Team Member</h5>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                  {validationErrors.name && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                      {validationErrors.name}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                  {validationErrors.email && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                      {validationErrors.email}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="projectDropdown" className="form-label">Select Project</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      id="projectDropdown"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="">Select a project</option>
                      {allProjects.filter(project => !assignedProjects.includes(project._id)).map(project => (
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
                </div>
                {validationErrors.projects && (
                  <div style={{ color: 'red', marginTop: '5px' }}>
                    {validationErrors.projects}
                  </div>
                )}
                <ul className="list-group mt-3">
                  {editData.assignedProjects.map((projectId, index) => {
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
                <div style={buttonContainerStyle}>
                  <button
                    onClick={handleEditSubmit}
                    className="btn btn-primary"
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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewMembers;
