import React, { useState } from "react";
import { auth, database } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import elex_logo from '../images/elex_logo.png'


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
    <div className="w-full h-screen bg-neutral-900 flex flex-col  items-center text-white">
      <div className="flex flex-col justify-center">
        <div>
          <img className="scale-50" src={elex_logo} />
        </div>
      <h1 className="text-white text-7xl w-full text-center font-anton">
          <strong>Login</strong>
        </h1>

      </div>
        
      
      <div>
        <br></br>
        <br></br>
        <div className="flex flex-col justify-center-align-center">
          <form onSubmit={handleLogin}>
            <input className="text-black p-2 rounded-xl"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className=""></div>
            <br></br>
            <input className="text-black p-2 rounded-xl"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            
          </form>
          <br></br>
          <div>
            
            <button className="bg-violet-700 outline outline-violet-400 outline-4 hover:bg-pink-500 hover:outline-pink-300  p-2 rounded-3xl" type="submit" onClick={handleLogin}>Login</button>
            </div>
          <div>
            <br></br>
            <Link to="/SignupPage">
              <button>
                Already have an account? <h1 className="text-blue-600">Signup</h1>
              </button>
            </Link>
          </div>
        </div>
      </div>
      {error && <p>{error}</p>}
    </div>
    </div>
  );
};

export default LoginPage;
