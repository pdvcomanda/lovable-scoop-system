
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Automatically redirect to Dashboard
    navigate('/');
  }, [navigate]);

  return null;
};

export default Index;
