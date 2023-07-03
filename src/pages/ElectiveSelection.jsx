import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const ElectiveSelection = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(database, "students");
        const studentsSnapshot = await getDocs(studentsCollection);
        const studentsData = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          enrolledSubjects: [], // Initialize enrolled subjects as an empty array
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };

    fetchStudents();
  }, []);

  const handleViewSubjects = async (studentId) => {
    try {
      const studentDoc = doc(database, "students", studentId);
      const studentSnapshot = await getDoc(studentDoc);
      const studentData = studentSnapshot.data();

      // Fetch enrolled subjects
      const enrolledSubjects = [];
      for (const subjectId of studentData.electiveSubjects) {
        const subjectDoc = doc(database, "electiveSubjects", subjectId);
        const subjectSnapshot = await getDoc(subjectDoc);
        const subjectData = subjectSnapshot.data();
        enrolledSubjects.push(subjectData.name);
      }

      // Update the enrolledSubjects array for the selected student
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? { ...student, enrolledSubjects: enrolledSubjects }
            : student
        )
      );

    } catch (error) {
      console.error("Error fetching enrolled subjects: ", error);
    }
  };

  return (
    <div>
      {students.map((student) => (
        <div key={student.id}>
          <p>Name: {student.name}</p>
          <button onClick={() => handleViewSubjects(student.id)}>
            View Enrolled Subjects
          </button>
          {student.enrolledSubjects.length > 0 && (
            <ul>
              {student.enrolledSubjects.map((subject) => (
                <li key={subject}>{subject}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ElectiveSelection;
