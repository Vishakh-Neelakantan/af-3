import React from 'react';
import { app } from './firebaseConfig';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Electives from './pages/Electives';
import Students from './pages/Students';
import ElectiveSelection from './pages/SubjectAllocation';
import Allocations from './pages/Allocations';
import StudentAllocation from './pages/StudentAllocation';
import SubjectAllocation from './pages/SubjectAllocation';
import Navbar from './components/Navbar';



function App() {
  return (
    <div className="App-header">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/electives" element={<Electives />} /> 
          <Route path="/students" element={<Students />} />
          <Route path="/allocations" element={<Allocations />} /> 
          <Route path="/studentallocation" element={<StudentAllocation />} /> 
          <Route path="/subjectallocation" element={<SubjectAllocation />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;