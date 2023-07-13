import React, { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editSubjectCode, setEditSubjectCode] = useState('');
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectDescription, setEditSubjectDescription] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjectsRef = collection(database, 'subjects');
      const snapshot = await getDocs(subjectsRef);
      const subjectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubjects(subjectList);
    };

    fetchSubjects();
  }, []);

  const addSubject = async () => {
    if (newSubjectCode !== '' && newSubjectName !== '' && newSubjectDescription !== '') {
      try {
        const subjectsRef = collection(database, 'subjects');
        const newSubject = {
          code: newSubjectCode,
          name: newSubjectName,
          description: newSubjectDescription
        };
        await addDoc(subjectsRef, newSubject);

        setNewSubjectCode('');
        setNewSubjectName('');
        setNewSubjectDescription('');
        setSubjects([...subjects, newSubject]);
      } catch (error) {
        console.error('Error adding subject:', error);
      }
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      const subjectRef = doc(database, 'subjects', subjectId);
      await deleteDoc(subjectRef);

      const updatedSubjects = subjects.filter((subject) => subject.id !== subjectId);
      setSubjects(updatedSubjects);
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const editSubject = (subjectId, subjectCode, subjectName, subjectDescription) => {
    setEditSubjectId(subjectId);
    setEditSubjectCode(subjectCode);
    setEditSubjectName(subjectName);
    setEditSubjectDescription(subjectDescription);
  };

  const updateSubject = async () => {
    try {
      const subjectRef = doc(database, 'subjects', editSubjectId);
      await updateDoc(subjectRef, {
        code: editSubjectCode,
        name: editSubjectName,
        description: editSubjectDescription
      });

      const updatedSubjects = subjects.map((subject) => {
        if (subject.id === editSubjectId) {
          return {
            ...subject,
            code: editSubjectCode,
            name: editSubjectName,
            description: editSubjectDescription
          };
        }
        return subject;
      });

      setSubjects(updatedSubjects);
      setEditSubjectId('');
      setEditSubjectCode('');
      setEditSubjectName('');
      setEditSubjectDescription('');
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  return (
    <div className='w-full bg-neutral-800 text-white p-12 flex flex-col'>
      <div className='w-full'>
      <h1 className='text-5xl'>Electives</h1>
      </div>
      
      <br></br>
      <div>
        <input
          type="text"
          value={newSubjectCode}
          onChange={(e) => setNewSubjectCode(e.target.value)}
          placeholder="Enter subject code"
        />
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Enter subject name"
        />
        <input
          type="text"
          value={newSubjectDescription}
          onChange={(e) => setNewSubjectDescription(e.target.value)}
          placeholder="Enter subject description"
        />
        <button onClick={addSubject}>Add Subject</button>
      </div>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            {subject.id === editSubjectId ? (
              <>
                <input
                  type="text"
                  value={editSubjectCode}
                  onChange={(e) => setEditSubjectCode(e.target.value)}
                />
                <input
                  type="text"
                  value={editSubjectName}
                  onChange={(e) => setEditSubjectName(e.target.value)}
                />
                <input
                  type="text"
                  value={editSubjectDescription}
                  onChange={(e) => setEditSubjectDescription(e.target.value)}
                />
                <button onClick={updateSubject}>Save</button>
              </>
            ) : (
              <>
                <div>
                  <strong>Code:</strong> {subject.code}
                </div>
                <div>
                  <strong>Name:</strong> {subject.name}
                </div>
                <div>
                  <strong>Description:</strong> {subject.description}
                </div>
                <button onClick={() => editSubject(subject.id, subject.code, subject.name, subject.description)}>
                  Edit
                </button>
                <button onClick={() => deleteSubject(subject.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subjects;