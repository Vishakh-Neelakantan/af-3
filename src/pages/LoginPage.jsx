import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const Navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Simulating a successful login
    setLoggedIn(true);
    // Redirect to the home page
    Navigate('/');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
