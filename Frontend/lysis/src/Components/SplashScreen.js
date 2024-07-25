import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [managerData, setManagerData] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const managerId = searchParams.get('managerId');

  useEffect(() => {
    const fetchDataAndNavigate = async () => {
      try {
        // Check if managerId is valid
        if (!managerId) {
          throw new Error('Manager ID is missing or invalid');
        }

    

        const response = await axios.get(`  http://localhost:8080/Manager/manager/${managerId}`);
        setManagerData(response.data);

        // Delay for 5 seconds before navigating to ManagerDashboard
        await new Promise(resolve => setTimeout(resolve, 5000));
        navigate(`/ManagerDashboard?managerId=${managerId}`);
      } catch (error) {
        console.error('Error:', error.message);
        // Handle error scenarios, e.g., redirect to an error page
        navigate('/ErrorPage');
      }
    };

    // Start animation after 1 second (adjust as needed)
    const delayAnimation = setTimeout(() => {
      setIsVisible(true);
      fetchDataAndNavigate();
    }, 1000); // 1000 milliseconds = 1 second


    return () => {
      clearTimeout(delayAnimation);
      setIsVisible(false);
    };
  }, [navigate, managerId]);

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
      {managerData ? (
        <>
          <h3 style={{ marginBottom: '10px', fontSize: '25px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px' }}>
            Welcome {managerData.name}
          </h3>
          <h5 style={{ marginTop: '10px', fontSize: '20px', fontWeight: '500', lineHeight: '24px' }}>
            Getting ready for you...
          </h5>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SplashScreen;











