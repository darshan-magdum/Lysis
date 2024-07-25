import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming useNavigate is available via another package or setup
import axios from 'axios';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataAndNavigate = async () => {
      try {
        // Simulate fetching user details
        // Replace with your actual data fetching logic
        await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate delay
  
        // Navigate to ManagerDashboard after delay
        navigate('/ManagerDashboard');
      } catch (error) {
        console.error('Error:', error);
        // Handle error scenarios
      }
    };
  
    // Start animation after 3 seconds
    const delayAnimation = setTimeout(() => {
      setIsVisible(true);
      fetchDataAndNavigate();
    }, 1000); // 3000 milliseconds = 3 seconds
  
    // Clean up function
    return () => {
      clearTimeout(delayAnimation);
      setIsVisible(false);
    };
  }, [navigate]);
  
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
        backgroundColor: 'rgb(32, 96, 156)',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <h3 style={{ marginBottom: '10px', fontSize: '25px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px' }}>
        Welcome John Doe
      </h3>
      <h5 style={{ marginTop: '10px', fontSize: '20px', fontWeight: '500', lineHeight: '24px' }}>
        Getting ready for you...
      </h5>
    </div>
  );
};

export default SplashScreen;
