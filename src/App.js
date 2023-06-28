import './App.css';
import React from 'react';
// import { app } from './firebaseConfig';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Electives from './pages/Electives';
import Students from './pages/Students';
import ElectiveSelection from './pages/ElectiveSelection';



function App() {
  return (
    <div className="App-header">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/electives" element={<Electives />} /> 
          <Route path="/students" element={<Students />} />
          <Route path="/electiveselection" element={<ElectiveSelection />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;