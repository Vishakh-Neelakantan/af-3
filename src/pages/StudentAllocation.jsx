import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

const StudentAllocation = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [allocations, setAllocations] = useState([]);

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

    const fetchAllocations = async () => {
      const allocationsRef = collection(database, "allocations");
      const snapshot = await getDocs(allocationsRef);
      const allocationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllocations(allocationList);
    };

    fetchStudents();
    fetchSubjects();
    fetchAllocations();
  }, []);

  const allocateStudent = async () => {
    if (selectedStudent !== "" && selectedSubject !== "") {
      const existingAllocation = allocations.find(
        (allocation) =>
          allocation.studentId === selectedStudent &&
          allocation.subjectId === selectedSubject
      );

      if (existingAllocation) {
        alert("Student is already allocated to this subject.");
      } else {
        try {
          const allocationRef = collection(database, "allocations");
          const newAllocation = {
            studentId: selectedStudent,
            subjectId: selectedSubject,
          };
          await addDoc(allocationRef, newAllocation);

          setSelectedStudent("");
          setSelectedSubject("");
          setAllocations([...allocations, newAllocation]);
        } catch (error) {
          console.error("Error allocating student to subject:", error);
        }
      }
    }
  };

  const deleteAllocation = async (allocationId) => {
    try {
      await deleteDoc(doc(database, "allocations", allocationId));
      const updatedAllocations = allocations.filter(
        (allocation) => allocation.id !== allocationId
      );
      setAllocations(updatedAllocations);
    } catch (error) {
      console.error("Error deleting allocation:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-neutral-800 p-12 flex flex-col">
      <div className="w-full text-center text-white">
        <h1 className="text-5xl">Student Allocation</h1>
      </div>
      <br></br>
      <br></br>
      <div className="md:flex h-full">
        <div className="md:w-1/3 bg-violet-800 p-8 md:mr-2 rounded-xl h-full text-white">
          <div>
            <h1 className="text-xl">Allocate a student to a subject:</h1>
          </div>
          <br></br>
          <br></br>
          <div>
          <h1>Student:</h1>
            <select className="bg-black"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <br></br>
          <div>
          <h1>Subject:</h1>
            <select className="bg-black"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <br></br>
          <button className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-48 rounded-3xl" onClick={allocateStudent}>Allocate Student</button>
        </div>

        <div className="p-8 md:w-2/3 flex-grow bg-blue-700 md:ml-2 rounded-xl text-white overflow-y-auto">
  <h2 className="text-3xl"><strong>Allocations</strong></h2>
  <br></br>
  <table className="w-full">
    <thead>
      <tr className="text-2xl">
        <th className="text-left">Student</th>
        <th className="text-left">Subject</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {allocations.map((allocation) => {
        const student = students.find((s) => s.id === allocation.studentId);
        const subject = subjects.find((s) => s.id === allocation.subjectId);

        return (
          <tr className="m-2" key={allocation.id}>
            <td className="text-xl">{student ? student.name : "Unknown"}</td>
            <td className="text-xl">{subject ? subject.name : "Unknown"}</td>
            <td className="flex justify-end">
              <button className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl" onClick={() => deleteAllocation(allocation.id)}>
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>



      </div>
    </div>
  );
};

export default StudentAllocation;
