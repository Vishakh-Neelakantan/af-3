import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import Navbar from "../components/Navbar";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
  });
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const studentsRef = collection(database, "students");
      const snapshot = await getDocs(studentsRef);
      const studentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async () => {
    if (
      newStudent.id !== "" &&
      newStudent.name !== "" &&
      newStudent.email !== "" &&
      newStudent.mobile !== ""
    ) {
      try {
        const studentsRef = doc(database, "students", newStudent.id);
        await setDoc(studentsRef, newStudent);

        setNewStudent({
          id: "",
          name: "",
          email: "",
          mobile: "",
        });

        fetchStudents();
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      const studentRef = doc(database, "students", studentId);
      await deleteDoc(studentRef);

      const updatedStudents = students.filter(
        (student) => student.id !== studentId
      );
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const editStudent = (student) => {
    setEditingStudent(student);
  };

  const updateStudent = async () => {
    try {
      const studentRef = doc(database, "students", editingStudent.id);
      await updateDoc(studentRef, {
        id: editingStudent.id,
        name: editingStudent.name,
        email: editingStudent.email,
        mobile: editingStudent.mobile,
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
      console.error("Error updating student:", error);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="w-full bg-neutral-800 p-12 flex flex-col">
      <div className="w-full text-center text-white ">
        <h1 className="text-7xl font-anton">Students</h1>
      </div>
      <br></br>
      <br></br>
      <div className="md:flex">
        <div className="md:w-1/3 bg-violet-800 p-16 md:mr-2 rounded-xl">
          <div className="text-white">
            <h1 className="text-5xl">Add a Student here</h1>
            <br></br>
            <h1 className="text-2xl">Enter student details:</h1>
          </div>
          <br></br>
          <div>
            <h1 className="text-white">Enter student ID</h1>
            <input
              className="m-2  h-8 rounded-xl"
              type="text"
              value={newStudent.id}
              onChange={(e) =>
                setNewStudent({ ...newStudent, id: e.target.value })
              }
              placeholder="Enter student ID"
            />
            <br></br>
            <h1 className="text-white">Enter student name</h1>
            <input
              className="m-2  h-8 rounded-xl"
              type="text"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
              placeholder="Enter student name"
            />
            <br></br>
            <h1 className="text-white">Enter student email</h1>
            <input className="m-2  h-8 rounded-xl"
              type="text"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              placeholder="Enter student email"
            />
            <br></br>
            <h1 className="text-white">Enter student mobile</h1>
            <input className="m-2  h-8 rounded-xl"
              type="text"
              value={newStudent.mobile}
              onChange={(e) =>
                setNewStudent({ ...newStudent, mobile: e.target.value })
              }
              placeholder="Enter student mobile"
            />
          </div>
          <div className="text-white m-4">
            <button
              className="bg-violet-700 outline outline-violet-400 outline-4 hover:bg-pink-500 hover:outline-pink-300  p-2 rounded-3xl"
              onClick={addStudent}
            >
              Add Student
            </button>
          </div>
        </div>
        <div className="p-16 md:w-2/3 bg-blue-700 md:ml-2 rounded-xl text-white overflow-x-auto">
          <table className="w-full table-auto max-h-full overflow-y-auto">
            <thead>
              <tr className="md:text-3xl text-xl">
                <th className="text-left">ID</th>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Mobile</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <br></br>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  {editingStudent && editingStudent.id === student.id ? (
                    <>
                      <td>
                        <input className="text-black p-2 rounded-xl"
                          type="text"
                          value={editingStudent.id}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              id: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input className="text-black p-2 rounded-xl"
                          type="text"
                          value={editingStudent.name}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              name: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input className="text-black p-2 rounded-xl"
                          type="text"
                          value={editingStudent.email}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              email: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input className="text-black p-2 rounded-xl"
                          type="text"
                          value={editingStudent.mobile}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              mobile: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <button className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300  rounded-3xl w-24" onClick={updateStudent}>Save</button>
                      </td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.mobile}</td>
                      <td>
                        <button className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-12  rounded-3xl" onClick={() => editStudent(student)}>
                          Edit
                        </button>
                      </td>
                      <td>
                        <button className="bg-violet-700 outline outline-violet-400 outline-2 hover:bg-pink-500 hover:outline-pink-300 w-24 rounded-3xl" onClick={() => deleteStudent(student.id)}>
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Students;
