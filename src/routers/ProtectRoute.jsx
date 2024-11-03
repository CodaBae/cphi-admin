import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const navigate = useNavigate();

  const userLoginData = useSelector((state) => state.adminLogin)
  const loginUser = userLoginData?.user

  useEffect(() => {
    const checkAuth = () => {
      // const isLoggedIn = localStorage.getItem('isLoggedIn');
      // const userRole = localStorage.getItem('userRole'); 

      if (loginUser?.userType) {
        setIsUser(true);
      } else {
        navigate('/');
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return isUser ? children : null;
};

export default ProtectRoute;
