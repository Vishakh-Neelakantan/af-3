import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentMobile, setNewStudentMobile] = useState('');
  const [editStudentId, setEditStudentId] = useState('');
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentMobile, setEditStudentMobile] = useState('');

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

    fetchStudents();
  }, []);

  const addStudent = async () => {
    if (newStudentId !== '' && newStudentName !== '' && newStudentEmail !== '' && newStudentMobile !== '') {
      try {
        const studentsRef = collection(database, 'students');
        const newStudent = {
          id: newStudentId,
          name: newStudentName,
          email: newStudentEmail,
          mobile: newStudentMobile
        };
        await addDoc(studentsRef, newStudent);

        setNewStudentId('');
        setNewStudentName('');
        setNewStudentEmail('');
        setNewStudentMobile('');
        setStudents([...students, newStudent]);
      } catch (error) {
        console.error('Error adding student:', error);
      }
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      const studentRef = doc(database, 'students', studentId);
      await deleteDoc(studentRef);

      const updatedStudents = students.filter((student) => student.id !== studentId);
      setStudents(updatedStudents);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const editStudent = (studentId, studentName, studentEmail, studentMobile) => {
    setEditStudentId(studentId);
    setEditStudentName(studentName);
    setEditStudentEmail(studentEmail);
    setEditStudentMobile(studentMobile);
  };

  const updateStudent = async () => {
    try {
      const studentRef = doc(database, 'students', editStudentId);
      await updateDoc(studentRef, {
        id: editStudentId,
        name: editStudentName,
        email: editStudentEmail,
        mobile: editStudentMobile
      });

      const updatedStudents = students.map((student) => {
        if (student.id === editStudentId) {
          return {
            ...student,
            id: editStudentId,
            name: editStudentName,
            email: editStudentEmail,
            mobile: editStudentMobile
          };
        }
        return student;
      });

      setStudents(updatedStudents);
      setEditStudentId('');
      setEditStudentName('');
      setEditStudentEmail('');
      setEditStudentMobile('');
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <div>
      <h1>Student Management Tool</h1>
      <div>
        <input
          type="text"
          value={newStudentId}
          onChange={(e) => setNewStudentId(e.target.value)}
          placeholder="Enter student ID"
        />
        <input
          type="text"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
          placeholder="Enter student name"
        />
        <input
          type="text"
          value={newStudentEmail}
          onChange={(e) => setNewStudentEmail(e.target.value)}
          placeholder="Enter student email"
        />
        <input
          type="text"
          value={newStudentMobile}
          onChange={(e) => setNewStudentMobile(e.target.value)}
          placeholder="Enter student mobile"
        />
        <button onClick={addStudent}>Add Student</button>
      </div>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.id === editStudentId ? (
              <>
                <input
                  type="text"
                  value={editStudentId}
                  onChange={(e) => setEditStudentId(e.target.value)}
                />
                <input
                  type="text"
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                />
                <input
                  type="text"
                  value={editStudentEmail}
                  onChange={(e) => setEditStudentEmail(e.target.value)}
                />
                <input
                  type="text"
                  value={editStudentMobile}
                  onChange={(e) => setEditStudentMobile(e.target.value)}
                />
                <button onClick={updateStudent}>Save</button>
              </>
            ) : (
              <>
                <div>
                  <strong>ID:</strong> {student.id}
                </div>
                <div>
                  <strong>Name:</strong> {student.name}
                </div>
                <div>
                  <strong>Email:</strong> {student.email}
                </div>
                <div>
                  <strong>Mobile:</strong> {student.mobile}
                </div>
                <button onClick={() => editStudent(student.id, student.name, student.email, student.mobile)}>Edit</button>
                <button onClick={() => deleteStudent(student.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
