import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";


const ElectiveSelection = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [electiveSubjects, setElectiveSubjects] = useState([]);

  useEffect(() => {
    // Fetch students from Firebase database
    const fetchStudents = async () => {
        try {
          const studentsSnapshot = await getDocs(collection(database, "students"));
          const studentsData = studentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStudents(studentsData);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };
      

      const fetchElectiveSubjects = async () => {
        try {
          const subjectsSnapshot = await getDocs(collection(database, "electiveSubjects"));
          const subjectsData = subjectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setElectiveSubjects(subjectsData);
        } catch (error) {
          console.error("Error fetching elective subjects:", error);
        }
      };
  

    fetchStudents();
    fetchElectiveSubjects();
  }, []);

  const handleStudentSelect = (event) => {
    const selectedStudentId = event.target.value;
    setSelectedStudent(selectedStudentId);
    setSelectedSubjects([]);

    // Fetch elective subjects for the selected student
    const fetchSelectedSubjects = async () => {
        try {
          const selectedSubjectsSnapshot = await getDocs(collection(database, "selectedSubjects"));
          const selectedSubjectsData = selectedSubjectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSelectedSubjects(selectedSubjectsData);
        } catch (error) {
          console.error("Error fetching selected subjects:", error);
        }
      };
      

    fetchSelectedSubjects();
  };

  const handleSubjectSelect = (event) => {
    const selectedSubjectId = event.target.value;
    setSelectedSubjects((prevSelectedSubjects) => {
      if (prevSelectedSubjects.includes(selectedSubjectId)) {
        // Subject already selected, remove it
        return prevSelectedSubjects.filter((subjectId) => subjectId !== selectedSubjectId);
      } else {
        // Subject not selected, add it
        return [...prevSelectedSubjects, selectedSubjectId];
      }
    });
  };

  const handleSaveSubjects = async () => {
    try {
      await updateDoc(doc(database, "students", selectedStudent), {
        electiveSubjects: selectedSubjects,
      });
      console.log("Subjects saved successfully!");
    } catch (error) {
      console.error("Error saving subjects:", error);
    }
  };
  const handleDeleteSubjects = async () => {
    try {
        await updateDoc(doc(database,"students", selectedStudent), {
        electiveSubjects: [],
      });
      console.log("Subjects deleted successfully!");
      setSelectedSubjects([]);
    } catch (error) {
      console.error("Error deleting subjects:", error);
    }
  };

  return (
    <div>
      <h2>Student Page</h2>
      <label htmlFor="students">Select a student:</label>
      <select id="students" value={selectedStudent} onChange={handleStudentSelect}>
        <option value="">-- Select Student --</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </select>

      {selectedStudent && (
        <div>
          <h3>Selected Subjects:</h3>
          {selectedSubjects.length === 0 ? (
            <p>No subjects selected.</p>
          ) : (
            <ul>
              {selectedSubjects.map((subjectId) => (
                <li key={subjectId}>{subjectId}</li>
              ))}
            </ul>
          )}

          <label htmlFor="subjects">Select a subject:</label>
          <select id="subjects" onChange={handleSubjectSelect}>
            <option value="">-- Select Subject --</option>
            {electiveSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <button onClick={handleSaveSubjects}>Save Subjects</button>
          <button onClick={handleDeleteSubjects}>Delete Subjects</button>
        </div>
      )}
    </div>
  );
};

export default ElectiveSelection;
