import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../Styles/UploadDocument.css";

const ViewManagers = () => {
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/Manager/managers")
      .then(response => {
        setManagers(response.data);
        setFilteredManagers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredManagers(
        managers.filter(manager =>
          manager.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredManagers(managers);
    }
  }, [searchQuery, managers]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  // Light gray color
  const lightGray = "#d3d3d3";

  const tableStyle = {
    border: `1px solid ${lightGray}`,  // Light gray border for the table
    borderCollapse: "collapse"
  };

  const cellStyle = {
    border: `1px solid ${lightGray}`  // Light gray border for each cell
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
            View Manager Details
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
                  <th style={cellStyle}>SR.NO</th> {/* New column header for Serial Number */}
                  <th style={cellStyle}>Name</th>
                  <th style={cellStyle}>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredManagers.map((manager, index) => (
                  <tr key={manager._id}>
                    <td style={cellStyle}>{index + 1}</td> {/* Serial Number */}
                    <td style={cellStyle}>{manager.name}</td>
                    <td style={cellStyle}>{manager.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewManagers;
