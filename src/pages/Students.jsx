import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    email: '',
    mobile: ''
  });
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const studentsRef = collection(database, 'students');
      const snapshot = await getDocs(studentsRef);
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async () => {
    if (newStudent.id !== '' && newStudent.name !== '' && newStudent.email !== '' && newStudent.mobile !== '') {
      try {
        const studentsRef = collection(database, 'students');
        await addDoc(studentsRef, newStudent);

        setNewStudent({
          id: '',
          name: '',
          email: '',
          mobile: ''
        });

        fetchStudents();
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

  const editStudent = (student) => {
    setEditingStudent(student);
  };

  const updateStudent = async () => {
    try {
      const studentRef = doc(database, 'students', editingStudent.id);
      await updateDoc(studentRef, {
        id: editingStudent.id,
        name: editingStudent.name,
        email: editingStudent.email,
        mobile: editingStudent.mobile
      });

      const updatedStudents = students.map((student) => {
        if (student.id === editingStudent.id) {
          return { ...editingStudent };
        }
        return student;
      });

      setStudents(updatedStudents);
      setEditingStudent(null);
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
          value={newStudent.id}
          onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
          placeholder="Enter student ID"
        />
        <input
          type="text"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          placeholder="Enter student name"
        />
        <input
          type="text"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          placeholder="Enter student email"
        />
        <input
          type="text"
          value={newStudent.mobile}
          onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
          placeholder="Enter student mobile"
        />
        <button onClick={addStudent}>Add Student</button>
      </div>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {editingStudent && editingStudent.id === student.id ? (
              <>
                <input
                  type="text"
                  value={editingStudent.id}
                  onChange={(e) => setEditingStudent({ ...editingStudent, id: e.target.value })}
                />
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                />
                <input
                  type="text"
                  value={editingStudent.mobile}
                  onChange={(e) => setEditingStudent({ ...editingStudent, mobile: e.target.value })}
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
                <button onClick={() => editStudent(student)}>Edit</button>
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
