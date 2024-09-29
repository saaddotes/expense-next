"use client";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/context/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Home() {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const now = new Date();
  const [model, setModel] = useState(2);

  const [todosForm, setTodosForm] = useState([
    {
      title: "",
      amount: 0,
      category: "Select Category",
      date: now.getDate(),
      note: "",
    },
  ]);

  const [editForm, setEditFrom] = useState([
    {
      title: "",
      amount: 0,
      category: "Select Category",
      date: now,
      note: "",
    },
  ]);
  const [backupState, setBackupState] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tools"), (snapshot) => {
      const updatedTodos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodosForm(
        updatedTodos.length > 0
          ? updatedTodos
          : [
              {
                title: "",
                amount: 0,
                category: "Select Category",
                date: new Date(),
                note: "",
              },
            ]
      );
      setBackupState(
        updatedTodos.length > 0
          ? updatedTodos
          : [
              {
                title: "",
                amount: 0,
                category: "Select Category",
                date: new Date(),
                note: "",
              },
            ]
      );
    });
    return () => unsubscribe();
  }, []);

  function newTodo() {
    setTodosForm([
      ...todosForm,
      {
        title: "",
        amount: 0,
        category: "Select Category",
        date: new Date(),
        note: "",
      },
    ]);
  }

  async function backupData() {
    const colRef = collection(db, "tools");
    const snapshot = await getDocs(colRef);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    todosForm.forEach(async (todo) => {
      if (todo.title) {
        await addDoc(colRef, todo);
      }
    });
  }

  function handleInputChange(event, index, type) {
    console.log(event, type);

    if (type === "title") {
      // setModel({...model, title : event.target.value})
      updatedData[index] = {
        ...updatedData[index],
        title: event.target.value,
      };
    }

    if (type === "amount") {
      updatedData[index] = {
        ...updatedData[index],
        amount: event.target.value,
      };
    }

    if (type === "category") {
      updatedData[index] = {
        ...updatedData[index],
        category: event.target.value,
      };
    }

    if (type === "date") {
      updatedData[index] = {
        ...updatedData[index],
        date: event.target.value,
      };
    }

    if (type === "note") {
      updatedData[index] = {
        ...updatedData[index],
        note: event.target.value,
      };
    }

    if (type === "delete") {
      updatedData.splice(index, 1);
    }

    setTodosForm([...updatedData]);
  }
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, logout]);

  return (
    <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-gray-100 p-6">
      <button
        onClick={logout}
        className="absolute top-1 left-1 mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
      >
        Logout
      </button>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <button
          onClick={backupData}
          className="bg-blue-500 mb-5 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:hover:bg-slate-500 disabled:bg-slate-500"
          disabled={backupState == todosForm ? true : false}
          // disabled
        >
          {backupState == todosForm ? "Updated" : "Backup Now"}
        </button>
        <div className="text-end">{editForm?.title}</div>
        <div className="text-end">{editForm?.amount}</div>
        <div className="text-end">{editForm?.category}</div>
        <div className="text-end">{editForm?.note}</div>

        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Welcome to the Expense Management
        </h1>
        <div className="overflow-x-auto">
          {/* <div className="flex flex-col gap-2"> */}
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {todosForm.map((todo, index) => (
                <tr>
                  <td>{todo.title}</td>
                  <td>{todo.amount}</td>
                  <td>{todo.category}</td>
                  <td>{todo.date}</td>
                  <td>{todo.note}</td>
                  <td>
                    <button
                      onClick={() => {
                        setModel(index);
                        setEditFrom(todosForm[index]);
                      }}
                    >
                      <svg
                        className="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleInputChange(e, index, "delete")}
                    >
                      <svg
                        class="w-6 h-6 text-red-500 hover:text-red-700 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* </div> */}
        </div>
        <button
          onClick={() => {
            setModel(todosForm.length);
            setEditFrom({
              title: "",
              amount: 0,
              category: "Select Category",
              date: now.getDate(),
              note: "",
            });
          }}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Add Expense
        </button>
      </div>

      {model != -1 && (
        <div className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-[#aaaaaaaa]">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-3">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Title</span>
              </div>
              <input
                type="text"
                value={editForm?.title}
                onChange={(e) =>
                  setEditFrom({ ...editForm, title: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Daisy"
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">Amount</span>
              </div>
              <input
                type="number"
                value={editForm?.amount}
                onChange={(e) =>
                  setEditFrom({ ...editForm, amount: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Daisy"
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Category</span>
              </div>
              <select
                className="select select-bordered"
                value={editForm?.category}
                onChange={(e) =>
                  setEditFrom({ ...editForm, category: e.target.value })
                }
              >
                <option disabled selected>
                  Select the Category
                </option>
                <option value="Select Category">Select Category</option>
                <option value="Food">Food</option>
                <option value="Tansport">Tansport</option>
                <option value="Bills">Bills</option>
                <option value="Education">Education</option>
                <option value="Investments">Investments</option>
                <option value="Luxuries">Luxuries</option>
                <option value="Others">Others</option>
              </select>
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Date</span>
              </div>
              <input
                className="input input-bordered w-full"
                type="datetime-local"
                value={editForm?.date}
                onChange={(e) =>
                  setEditFrom({ ...editForm, date: e.target.value })
                }
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Note"
                value={editForm?.note}
                onChange={(e) =>
                  setEditFrom({ ...editForm, note: e.target.value })
                }
              ></textarea>
            </label>

            <div className="flex justify-end gap-2">
              <button className="btn" onClick={() => setModel(-1)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  let updatedData = [...todosForm];
                  updatedData[model] = { ...editForm };
                  setTodosForm(updatedData);
                  setEditFrom({
                    title: "",
                    amount: 0,
                    category: "Select Category",
                    date: now.getDate(),
                    note: "",
                  });
                  setModel(-1);
                }}
              >
                Save
              </button>
            </div>

            {/* <button
              onClick={(e) =>
                handleInputChange(e, model, "delete")
              }
            >
              <svg
                class="w-6 h-6 text-red-500 hover:text-red-700 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                />
              </svg>
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
