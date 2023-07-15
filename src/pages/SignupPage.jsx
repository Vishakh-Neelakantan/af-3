import React, { useState } from "react";
import { auth, database } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import elex_logo from '../images/elex_logo.png'



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
    <div className="w-full h-screen bg-neutral-900 flex flex-col  items-center p-12 text-white">
      <h1 className="text-white text-7xl w-full text-center font-anton">
          <strong>Sign up</strong>
        </h1>
        <br></br>
        <br></br>
        <br></br>
        <div className="flex flex-col justify-center align-center items-center">
      <form onSubmit={handleSignup}>
        <input className="text-black p-2 rounded-xl"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <input className="text-black p-2 rounded-xl"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <input className="text-black p-2 rounded-xl"
          type="text"
          placeholder="Mobile Number"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <input className="text-black p-2 rounded-xl"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <input className="text-black p-2 rounded-xl"
          type="text"
          placeholder="Admin Registration Number"
          value={adminRegNo}
          onChange={(e) => setAdminRegNo(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <button className="bg-violet-700 outline outline-violet-400 outline-4 hover:bg-pink-500 hover:outline-pink-300  p-2 rounded-3xl" type="submit">Signup</button>
      </form>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignupPage;
