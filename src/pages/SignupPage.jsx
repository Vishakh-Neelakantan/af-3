import React, { useState } from "react";
import { auth, database } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [name, setName] = useState("");
  const [adminRegNo, setAdminRegNo] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

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
      const newLogin = { email, password, mobileNo, name, adminRegNo };
      await addDoc(loginRef, newLogin);

      // Perform signup action (e.g., send confirmation email)
      // ...

      // Clear form inputs and error message
      setEmail("");
      setPassword("");
      setMobileNo("");
      setName("");
      setAdminRegNo("");
      setError("");
      setLoggedIn(true);
    } catch (error) {
      console.error("Error signing up:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Signup Page</h1>
      <form onSubmit={handleSignup}>
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
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Admin Registration Number"
          value={adminRegNo}
          onChange={(e) => setAdminRegNo(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignupPage;
