"use client";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SignupForm = () => {
  const { signUp, user } = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push("/home");
    }
    if (user && !user.emailVerified) {
      router.push("/verification");
    }
  }, [user]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const user = await signUp(formData.email, formData.password);
      if (user) {
        console.log("Form Data Submitted:", formData);
        alert("Sign-up successful! Check your email for verification.");

        // Clear the form data after successful sign-up
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      // Handle errors, but don't clear the form
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already in use. Please use a different one.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak. Please use a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format. Please provide a valid email.");
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
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Sign Up
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Sign Up
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600">Already Registerd?</span>{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-600 font-semibold"
          >
            Login Here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
