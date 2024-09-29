"use client";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/context/firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Home() {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const [model, setModel] = useState(2);
  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0];

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, logout]);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        collection(db, "users", user?.uid, "expenses"),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") {
              console.log("Removed Data: ", change.doc.data());
            }
          });
          const updatedTodos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTodosForm(updatedTodos);
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  const [todosForm, setTodosForm] = useState([]);

  const [editForm, setEditForm] = useState([
    {
      title: "",
      amount: 0,
      category: "Select Category",
      date: formattedDate,
      note: "",
    },
  ]);

  async function AddExpense() {
    const colRef = collection(db, "users", user?.uid, "expenses");

    const pushData = await addDoc(colRef, {
      ...editForm,
      userId: user?.uid,
    });

    console.log(colRef, pushData);

    setEditForm({
      title: "",
      amount: 0,
      category: "Select Category",
      date: formattedDate,
      note: "",
    });
    setModel(-1);
  }

  async function deleteEntry(id) {
    const entryToDelete = doc(db, "users", user.uid, "expenses", id);
    await deleteDoc(entryToDelete);
    console.log("Delete", id);
  }

  return (
    // <div className="min-h-screen flex flex-col gap-3 items-center justify-center bg-gray-100 p-6">
    //   <button
    //     onClick={logout}
    //     className="absolute top-1 left-1 mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
    //   >
    //     Logout
    //   </button>
    <>
      <header>
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">NexExpense</a>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">8</span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <span className="text-lg font-bold">8 Items</span>
                  <span className="text-info">Subtotal: $999</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block">
                      View cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn-warning" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Welcome to the Expense Management
        </h1>
        <div className="overflow-x-auto">
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
                <tr key={todo?.id || index}>
                  <td>{todo?.title}</td>
                  <td>{todo?.amount}</td>
                  <td>{todo?.category}</td>
                  <td>{todo?.date}</td>
                  {/* <td>Test</td> */}
                  <td>{todo?.note}</td>
                  <td>
                    <button
                      onClick={() => {
                        setModel(index);
                        setEditForm(todosForm[index]);
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
                    <button onClick={() => deleteEntry(todo?.id)}>
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
        </div>
        <button
          onClick={() => {
            setModel(todosForm.length);
            setEditForm({
              title: "",
              amount: 0,
              category: "Select Category",
              date: formattedDate,
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
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Pizza"
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
                  setEditForm({ ...editForm, amount: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="550"
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
                  setEditForm({ ...editForm, category: e.target.value })
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
                type="date"
                value={editForm?.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
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
                  setEditForm({ ...editForm, note: e.target.value })
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
                  AddExpense();
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
    </>
    // </div>
  );
}

export default Home;
