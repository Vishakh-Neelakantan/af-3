import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Simulating a successful login
    setLoggedIn(true);
    // Redirect to the home page
    history.push('/');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
