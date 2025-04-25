"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SIGNUP_URL = "/api/signup"; // ✅ calls your own Next.js server action


export default function Page() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target); //get form data
    const objectFormForm = Object.fromEntries(formData); //make into Object
    const jsonData = JSON.stringify(objectFormForm);  //turn into JSON

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    };

    try {
      const response = await fetch(SIGNUP_URL, requestOptions);
      const data = await response.json();
      if (response.ok) {
        setStatus("Account created successfully! ✅");
      } else {
        setStatus(data.detail || "Signup failed ❌");
      }
    } catch (err) {
      setStatus("Network error. Please try again later. ⚠️");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-800 py-20 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="username" required placeholder="Username" className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <input type="email" name="email" required placeholder="Email" className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <input type="password" name="password" required placeholder="Password" className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <input type="text" name="first_name" required placeholder="First Name" className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <input type="text" name="last_name" required placeholder="Last Name" className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <input type="text" name="phone_number" required placeholder="Phone Number" className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-all">
            Sign Up
          </button>
        </form>
        {status && <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">{status}</p>}
      </motion.div>
    </div>
  );
}
