import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { auth } from "../firebase";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { MessageResponse } from "../types/api-types";
import type { User } from "../types/types";

// New user shape is represented by `User` from types

const Login = () => {
  const dispatch = useDispatch();
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const userData: User = {
        name: user.displayName ?? "",
        email: user.email ?? "",
        photo: user.photoURL ?? "",
        role: "user",
        _id: user.uid,
        gender: gender || "",
        dob: date || "",
      };

      const res = await login(userData);

      if ("data" in res) {
        toast.success(res.data.message);
        const data = await getUser(user.uid);
        if (data && data.user) dispatch(userExist(data.user));
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Sign In Failed");
    }
  };

  return (
    <section className="bg-salmon dark:bg-gray-900 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white/70 dark:bg-gray-800/80 shadow-xl rounded-2xl p-8 backdrop-blur-lg">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h1>

        {/* Gender Selection */}
        <div className="mt-6">
          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full mt-2 p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Date of Birth Input */}
        <div className="mt-4">
          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Date of Birth
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-2 p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="mt-6 flex items-center justify-between">
          <label className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Remember me
            </span>
          </label>
          <a href="#" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Google Sign-in Button */}
        <div className="mt-6">
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">
            Already Signed In Once?
          </p>
          <button
            onClick={loginHandler}
            className="w-full mt-4 flex items-center justify-center gap-3 p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
          >
            <FcGoogle size={28} />{" "}
            <span className="text-lg font-semibold">Quick Sign in</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
