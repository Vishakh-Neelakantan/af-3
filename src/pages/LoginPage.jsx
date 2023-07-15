import React, { useState } from "react";
import { auth, database } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import {Link} from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const querySnapshot = await getDocs(
        query(collection(database, "logins"), where("email", "==", email))
      );
      if (querySnapshot.empty) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      const loginData = querySnapshot.docs[0].data();
      if (loginData.password !== password) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      // Perform login action
      // ...

      // Clear form inputs and error message
      setEmail("");
      setPassword("");
      setError("");
      setLoggedIn(true);
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Check if the user already exists
      const querySnapshot = await getDocs(
        query(collection(database, "logins"), where("email", "==", email))
      );
      if (!querySnapshot.empty) {
        setError("An account with this email already exists.");
        return;
      }

      // Create a new login document
      const loginRef = collection(database, "logins");
      const newLogin = { email, password };
      await addDoc(loginRef, newLogin);

      // Perform signup action (e.g., send confirmation email)
      // ...

      // Clear form inputs and error message
      setEmail("");
      setPassword("");
      setError("");
      setLoggedIn(true);
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  if (loggedIn) {
    return <Navigate to="/Home" />;
  }

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <Link to ="/SignupPage">
      <button>Signup</button>
      </Link>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;