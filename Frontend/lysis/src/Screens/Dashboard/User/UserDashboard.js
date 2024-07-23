// UserDashboard.js

import React from 'react';
import UserMainContent from './UserMainContent';
import UserSidebar from './UserSider';

const UserDashboard = () => {
    // Assuming you have a function to handle logout
    const handleLogout = () => {
      // Implement your logout logic here
      console.log('Logout clicked'); // Placeholder for actual logout logic
    };
  
    return (
      <div className="container-fluid">
        {/* Header */}
        <header className="row justify-content-between align-items-center py-2" style={{ backgroundColor: 'rgb(36, 75, 111)', color: 'white' }}>
          <div className="col-auto ml-3">
            {/* Your logo or title could go here */}
            <h2>Lysis</h2>
          </div>
          <div className="col-auto">
            {/* Logout Button with margin-right */}
            <button className="btn btn-danger mr-2" onClick={handleLogout}>Logout</button>
          </div>
        </header>
  
        {/* Main Content */}
        <div className="row">
          <UserSidebar />
          <UserMainContent />
        </div>
      </div>
    );
  };
  
  export default UserDashboard;


