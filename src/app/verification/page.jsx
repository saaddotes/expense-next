"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const VerifyEmailPage = () => {
  const { user, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user && user.emailVerified) {
      router.push("/home");
    }

    if (!user) {
      router.push("/signup");
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Email Verification Required
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Please check your email{" "}
          <span className="font-bold">{user?.email}</span> for a verification
          link.
        </p>

        <div className="flex justify-center">
          <svg
            class="w-[30%] h-[10%] dark:text-gray-800 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 16v-5.5A3.5 3.5 0 0 0 7.5 7m3.5 9H4v-5.5A3.5 3.5 0 0 1 7.5 7m3.5 9v4M7.5 7H14m0 0V4h2.5M14 7v3m-3.5 6H20v-6a3 3 0 0 0-3-3m-2 9v4m-8-6.5h1"
            />
          </svg>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
        >
          Try Another Email
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Didn’t receive the email? Check your spam folder or{" "}
          {/* <a href="#" className="text-blue-500 hover:underline"> */}
          resend the link
          {/* </a> */}.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
