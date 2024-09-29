"use client";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoginForm = () => {
  const { login, user } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(formData.email, formData.password);
      if (user) {
        console.log("Form Data Submitted:", formData);
        alert("Login successful!");

        // Clear the form data after successful login
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      // Handle errors based on Firebase error codes
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email. Please sign up.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format. Please enter a valid email.");
      } else {
        alert("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">Log In</h2>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Log In
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Not yet registered?</span>{" "}
          <Link
            href="/signup"
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            Signup Here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
