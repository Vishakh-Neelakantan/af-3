import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { collection, getDocs, doc, addDoc, updateDoc, query, where, deleteDoc } from 'firebase/firestore';

const StudentAllocation = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsRef = collection(database, 'students');
      const snapshot = await getDocs(studentsRef);
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentList);
    };

    const fetchSubjects = async () => {
      const subjectsRef = collection(database, 'subjects');
      const snapshot = await getDocs(subjectsRef);
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubjects(subjectList);
    };

    const fetchAllocations = async () => {
      const allocationsRef = collection(database, 'allocations');
      const snapshot = await getDocs(allocationsRef);
      const allocationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllocations(allocationList);
    };

    fetchStudents();
    fetchSubjects();
    fetchAllocations();
  }, []);

  const allocateStudent = async () => {
    if (selectedStudent !== '' && selectedSubject !== '') {
      const existingAllocation = allocations.find(
        allocation => allocation.studentId === selectedStudent && allocation.subjectId === selectedSubject
      );

      if (existingAllocation) {
        alert('Student is already allocated to this subject.');
      } else {
        try {
          const allocationRef = collection(database, 'allocations');
          const newAllocation = { studentId: selectedStudent, subjectId: selectedSubject };
          await addDoc(allocationRef, newAllocation);

          setSelectedStudent('');
          setSelectedSubject('');
          setAllocations([...allocations, newAllocation]);
        } catch (error) {
          console.error('Error allocating student to subject:', error);
        }
      }
    }
  };

  const deleteAllocation = async (allocationId) => {
    try {
      await deleteDoc(doc(database, 'allocations', allocationId));
      const updatedAllocations = allocations.filter((allocation) => allocation.id !== allocationId);
      setAllocations(updatedAllocations);
    } catch (error) {
      console.error('Error deleting allocation:', error);
    }
  };

  return (
    <div>
      <h1>Student Allocation</h1>
      <div>
        <label>Student:</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Subject:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select a subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
      </div>
      <button onClick={allocateStudent}>Allocate Student</button>

      <div>
        <h2>Allocations</h2>
        <ul>
          {allocations.map((allocation) => {
            const student = students.find((s) => s.id === allocation.studentId);
            const subject = subjects.find((s) => s.id === allocation.subjectId);

            return (
              <li key={allocation.id}>
                <strong>Student:</strong> {student ? student.name : 'Unknown'}
                <br />
                <strong>Subject:</strong> {subject ? subject.name : 'Unknown'}
                <button onClick={() => deleteAllocation(allocation.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default StudentAllocation;
