import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming useNavigate is available via another package or setup

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate the delay and then navigate
    const timeout = setTimeout(() => {
      navigate('/ManagerDashboard');
    }, 3000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div style={{
      opacity: 1,
      transition: 'opacity 1s ease-in',
      backgroundColor: 'rgb(32, 96, 156)',
      color: 'white',
      minHeight: '100vh',  // Ensures the div takes up the full height of the viewport
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px' // Adds padding around the content
    }}>
      <h3 style={{ marginBottom: '10px' }}>Welcome John Doe</h3>
      <h5 style={{ marginTop: '10px' }}>Getting ready for you...</h5>
    </div>
  );
};

export default SplashScreen;
