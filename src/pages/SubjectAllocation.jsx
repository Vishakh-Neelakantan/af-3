import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import Navbar from "../components/Navbar";

const SubjectAllocation = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectStudents, setSubjectStudents] = useState([]);
  const [newStudentId, setNewStudentId] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsRef = collection(database, "students");
      const snapshot = await getDocs(studentsRef);
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    };

    const fetchSubjects = async () => {
      const subjectsRef = collection(database, "subjects");
      const snapshot = await getDocs(subjectsRef);
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectList);
    };

    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchSubjectStudents = async (subjectId) => {
    try {
      const allocationsRef = collection(database, "allocations");
      const q = query(allocationsRef, where("subjectId", "==", subjectId));
      const snapshot = await getDocs(q);
      const studentIds = snapshot.docs.map((doc) => doc.data().studentId);

      const enrolledStudents = students.filter((student) =>
        studentIds.includes(student.id)
      );

      setSubjectStudents(enrolledStudents);
    } catch (error) {
      console.error("Error fetching subject students:", error);
    }
  };

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    fetchSubjectStudents(subjectId);
  };

  const addStudentToSubject = async () => {
    try {
      const allocationRef = collection(database, "allocations");
      const newAllocation = {
        studentId: newStudentId,
        subjectId: selectedSubject,
      };
      await addDoc(allocationRef, newAllocation);

      setNewStudentId("");
      fetchSubjectStudents(selectedSubject);
    } catch (error) {
      console.error("Error adding student to subject:", error);
    }
  };

  const deleteStudentFromSubject = async (studentId) => {
    try {
      const allocationsRef = collection(database, "allocations");
      const q = query(
        allocationsRef,
        where("subjectId", "==", selectedSubject),
        where("studentId", "==", studentId)
      );
      const snapshot = await getDocs(q);

      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      fetchSubjectStudents(selectedSubject);
    } catch (error) {
      console.error("Error deleting student from subject:", error);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="w-full h-screen bg-neutral-800 p-12 flex flex-col">
      <div className="w-full text-center text-white">
        <h1 className="text-5xl font-anton">Subject Allocation</h1>
      </div>
      <br></br>
      <br></br>
      <div className="md:flex h-full">
        <div className="md:w-1/3 bg-violet-800 p-8 md:mr-2 rounded-xl h-full ">
          <div className="text-3xl text-white">All Subjects</div>
          <br></br>
          <div className="h-[1px] w-full bg-white"></div>
          <br></br>
          {subjects.map((subject) => (
            <div className="overflow-y-auto">
              <button
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id)}
                style={{
                  background:
                    selectedSubject === subject.id ? "white" : "black",
                  color: selectedSubject === subject.id ? "black" : "white",
                  margin: "5px",
                  padding: "5px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <h1 className="text-l">{subject.name}</h1>
              </button>
            </div>
          ))}
        </div>
        <div className="p-8 md:w-2/3 bg-blue-700 md:ml-2 rounded-xl text-white overflow-x-auto h-full overflow-y-auto">
          <div>Select a subject to view allocations</div>
          <br></br>
  {selectedSubject && (
    <div className="w-full">
      <div className="w-full flex">
        <h2 className="text-3xl">
          Students Enrolled in{" "}
          {subjects.find((s) => s.id === selectedSubject)?.name}
        </h2>
        <div className="ml-auto">
          <h2 className="text-xl">Add Student:</h2>
          <select
            className="bg-black"
            value={newStudentId}
            onChange={(e) => setNewStudentId(e.target.value)}
            style={{ marginRight: "10px" }}
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <button
            className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl"
            onClick={addStudentToSubject}
          >
            Add
          </button>
        </div>
      </div>
      <br></br>
      <div className="overflow-y-auto w-full">
        {subjectStudents.length === 0 ? (
          <p>No students enrolled in this subject.</p>
        ) : (
          <ol>
            {subjectStudents.map((student) => (
              <li className="m-2 flex justify-between" key={student.id}>
                <div className="text-xl">{student.name}</div>
                <button
                  className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl"
                  onClick={() => deleteStudentFromSubject(student.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )}
</div>

      </div>
    </div>
    </div>
  );
};

export default SubjectAllocation;