import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white px-6">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight animate-fadeIn">
          Welcome to{" "}
          <span className="text-yellow-300 drop-shadow-lg">Task Manager</span>
        </h1>

        <p className="text-base md:text-lg text-gray-100">
          Organize your tasks, set priorities, and stay productive with our
          simple task management system. Manage everything in one place with
          ease 🚀
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link
          to="/register"
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl shadow-lg hover:bg-yellow-300 transition transform hover:scale-105"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
        >
          Login
        </Link>
      </div>

      {/* Extra Visuals */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
    </div>
  );
}
