import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc
} from 'firebase/firestore';

const SubjectAllocation = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectStudents, setSubjectStudents] = useState([]);
  const [newStudentId, setNewStudentId] = useState('');

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

    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchSubjectStudents = async (subjectId) => {
    try {
      const allocationsRef = collection(database, 'allocations');
      const q = query(allocationsRef, where('subjectId', '==', subjectId));
      const snapshot = await getDocs(q);
      const studentIds = snapshot.docs.map((doc) => doc.data().studentId);

      const enrolledStudents = students.filter((student) =>
        studentIds.includes(student.id)
      );

      setSubjectStudents(enrolledStudents);
    } catch (error) {
      console.error('Error fetching subject students:', error);
    }
  };

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    fetchSubjectStudents(subjectId);
  };

  const addStudentToSubject = async () => {
    try {
      const allocationRef = collection(database, 'allocations');
      const newAllocation = {
        studentId: newStudentId,
        subjectId: selectedSubject
      };
      await addDoc(allocationRef, newAllocation);

      setNewStudentId('');
      fetchSubjectStudents(selectedSubject);
    } catch (error) {
      console.error('Error adding student to subject:', error);
    }
  };

  const deleteStudentFromSubject = async (studentId) => {
    try {
      const allocationsRef = collection(database, 'allocations');
      const q = query(
        allocationsRef,
        where('subjectId', '==', selectedSubject),
        where('studentId', '==', studentId)
      );
      const snapshot = await getDocs(q);

      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      fetchSubjectStudents(selectedSubject);
    } catch (error) {
      console.error('Error deleting student from subject:', error);
    }
  };

  return (
    <div>
      <h1>Subject Allocation</h1>
      <div>
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => handleSubjectClick(subject.id)}
            style={{
              background: selectedSubject === subject.id ? 'blue' : 'none',
              color: selectedSubject === subject.id ? 'white' : 'black',
              margin: '5px',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {subject.name}
          </button>
        ))}
      </div>

      {selectedSubject && (
        <div>
          <h2>Students Enrolled in {subjects.find((s) => s.id === selectedSubject)?.name}</h2>
          {subjectStudents.length === 0 ? (
            <p>No students enrolled in this subject.</p>
          ) : (
            <ol>
              {subjectStudents.map((student) => (
                <li key={student.id}>
                  {student.name}{' '}
                  <button onClick={() => deleteStudentFromSubject(student.id)}>Delete</button>
                </li>
              ))}
            </ol>
          )}

          <h2>Add Student</h2>
          <div>
            <select
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              style={{ marginRight: '10px' }}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
            <button onClick={addStudentToSubject}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectAllocation;
