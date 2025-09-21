import React, { useState } from "react";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      toast.success("✅ User registered successfully!");
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Error registering");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 px-4 relative">
      <Toaster position="top-right" />
      {/* Decorative Background Blobs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400 rounded-full filter blur-2xl opacity-30 animate-pulse mix-blend-multiply"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-400 rounded-full filter blur-2xl opacity-30 animate-pulse mix-blend-multiply"></div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-purple-700">
          Create Account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <button
            type="submit"
            className="mt-4 px-4 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-500 transition transform hover:scale-105"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
