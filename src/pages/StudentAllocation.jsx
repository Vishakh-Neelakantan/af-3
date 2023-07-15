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

const StudentAllocation = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [newSubjectId, setNewSubjectId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsRef = collection(database, "subjects");
      const snapshot = await getDocs(subjectsRef);
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectList);
    };

    const fetchStudents = async () => {
      const studentsRef = collection(database, "students");
      const snapshot = await getDocs(studentsRef);
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    };

    fetchSubjects();
    fetchStudents();
  }, []);

  const fetchStudentSubjects = async (studentId) => {
    try {
      const allocationsRef = collection(database, "allocations");
      const q = query(allocationsRef, where("studentId", "==", studentId));
      const snapshot = await getDocs(q);
      const subjectIds = snapshot.docs.map((doc) => doc.data().subjectId);

      const enrolledSubjects = subjects.filter((subject) =>
        subjectIds.includes(subject.id)
      );

      setStudentSubjects(enrolledSubjects);
    } catch (error) {
      console.error("Error fetching student subjects:", error);
    }
  };

  const handleStudentClick = (studentId) => {
    setSelectedStudent(studentId);
    fetchStudentSubjects(studentId);
  };

  const addSubjectToStudent = async () => {
    try {
      const allocationRef = collection(database, "allocations");
      const newAllocation = {
        studentId: selectedStudent,
        subjectId: newSubjectId,
      };
      await addDoc(allocationRef, newAllocation);

      setNewSubjectId("");
      fetchStudentSubjects(selectedStudent);
    } catch (error) {
      console.error("Error adding subject to student:", error);
    }
  };

  const deleteSubjectFromStudent = async (subjectId) => {
    try {
      const allocationsRef = collection(database, "allocations");
      const q = query(
        allocationsRef,
        where("studentId", "==", selectedStudent),
        where("subjectId", "==", subjectId)
      );
      const snapshot = await getDocs(q);

      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      fetchStudentSubjects(selectedStudent);
    } catch (error) {
      console.error("Error deleting subject from student:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar/>
    <div className="w-full h-screen bg-neutral-800 p-12 flex flex-col">
      <div className="w-full text-center text-white">
        <h1 className="text-5xl font-anton">Student Allocation</h1>
      </div>
      <br></br>
      <br></br>
      <div className="md:flex h-full">
        <div className="md:w-1/3 bg-violet-800 p-8 md:mr-2 rounded-xl h-full">
          <div className="text-3xl text-white">All Students</div>
          <br></br>
          <div className="h-[1px] w-full bg-white"></div>
          <br></br>
          <div className="overflow-y-auto">
            <input
              type="text"
              placeholder="Search Students"
              value={searchQuery}
              onChange={handleSearch}
              className="bg-black text-white px-3 py-2 rounded"
            />
          </div>
          <br></br>
          {filteredStudents.map((student) => (
            <div className="overflow-y-auto" key={student.id}>
              <button
                onClick={() => handleStudentClick(student.id)}
                style={{
                  background:
                    selectedStudent === student.id ? "white" : "black",
                  color: selectedStudent === student.id ? "black" : "white",
                  margin: "5px",
                  padding: "5px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <h1 className="text-l">{student.name}</h1>
              </button>
            </div>
          ))}
        </div>
        <div className="p-8 md:w-2/3 bg-blue-700 md:ml-2 rounded-xl text-white overflow-x-auto h-full overflow-y-auto">
          <div>Select a student to view allocations</div>
          <br></br>
          {selectedStudent && (
            <div className="w-full">
              <div className="w-full flex">
                <h2 className="text-3xl">
                  Subjects Enrolled by{" "}
                  {students.find((s) => s.id === selectedStudent)?.name}
                </h2>
                <div className="ml-auto">
                  <h2 className="text-xl">Add Subject:</h2>
                  <select
                    className="bg-black"
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    style={{ marginRight: "10px" }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl"
                    onClick={addSubjectToStudent}
                  >
                    Add
                  </button>
                </div>
              </div>
              <br></br>
              <div className="overflow-y-auto w-full">
                {studentSubjects.length === 0 ? (
                  <p>No subjects enrolled by this student.</p>
                ) : (
                  <ol>
                    {studentSubjects.map((subject) => (
                      <li className="m-2 flex justify-between" key={subject.id}>
                        <div className="text-xl">{subject.name}</div>
                        <button
                          className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl"
                          onClick={() =>
                            deleteSubjectFromStudent(subject.id)
                          }
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

export default StudentAllocation;
