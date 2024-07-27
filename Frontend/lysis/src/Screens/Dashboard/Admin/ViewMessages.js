import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../Styles/UploadDocument.css";

const ViewMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  useEffect(() => {
    axios.get("http://localhost:8080/Contact/GetAll")
      .then(response => {
        setMessages(response.data);
        setFilteredMessages(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredMessages(
        messages.filter(message =>
          message.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredMessages(messages);
    }
    setCurrentPage(1);
  }, [searchQuery, messages]);

  // Calculate paginated data
  const indexOfLastMessage = currentPage * itemsPerPage;
  const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const lightGray = "#d3d3d3";

  // Text color for messages
  const textColor = "#205C9C";

  const tableStyle = {
    border: `1px solid ${lightGray}`,  // Light gray border for the table
    borderCollapse: "collapse"
  };

  const cellStyle = {
    border: `1px solid ${lightGray}`  // Light gray border for each cell
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

  // Total pages
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

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
            View Messages
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
                  <th style={cellStyle}>Contact No</th>
                  <th style={cellStyle}>Description</th>
                  <th style={cellStyle}>Date</th> 
                </tr>
              </thead>
              <tbody>
                {currentMessages.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      <p style={messageStyle}>No records found</p>
                    </td>
                  </tr>
                ) : (
                  currentMessages.map((message, index) => (
                    <tr key={message._id}>
                      <td style={cellStyle}>{indexOfFirstMessage + index + 1}</td> 
                      <td style={cellStyle}>{message.name}</td>
                      <td style={cellStyle}>{message.email}</td>
                      <td style={cellStyle}>{message.contactNo}</td>
                      <td style={cellStyle}>{message.description}</td>
                      <td style={cellStyle}>{new Date(message.createdAt).toLocaleDateString()}</td> 
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredMessages.length > 0 && (
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
        </div>
      </div>
    </div>
  );
};

export default ViewMessages;
