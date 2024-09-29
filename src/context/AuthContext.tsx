"use client";

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { app } from "@/context/firebase";

type AuthContextType = {
  login: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string) => Promise<User | null>;
  user: User | null;
  setUser: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth(app);

  const login = async (email: string, password: string) => {
    console.log(email, password, auth)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Signed in as:", userCredential.user.email);
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing in:", error);
      throw error; // Throw the error so it can be caught
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email
      if (user) {
        await sendEmailVerification(user);
        console.log("Verification email sent to:", user.email);
      }

      console.log("Signed up as:", user.email);
      return user;
    } catch (error: any) {
      console.error("Error signing up:", error);
      // Throw the error to be handled in handleSubmit
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear the user state
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      setUser(userAuth);
      if (userAuth) {
        console.log("User is signed in:", userAuth.email);
      } else {
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [auth]);

  const value = {
    login,
    signUp,
    user,
    setUser,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
