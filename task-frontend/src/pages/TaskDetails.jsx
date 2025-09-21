import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/task/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(res.data);
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };
    fetchTask();
  }, [id]);

  if (!task)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading task...</p>
      </div>
    );

  // Priority color tag
  const priorityColor = {
    high: "bg-red-500",
    medium: "bg-yellow-400",
    low: "bg-green-400",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-purple-700 mb-4 text-center">
          {task.title}
        </h2>

        {/* Description */}
        <p className="mb-6 text-gray-700 leading-relaxed text-justify">
          {task.description}
        </p>

        {/* Task Info */}
        <div className="space-y-3">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Due:</span>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>

          {/* Priority */}
          <p>
            <span className="font-semibold text-gray-800">Priority:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${priorityColor[task.priority]}`}
            >
              {task.priority.toUpperCase()}
            </span>
          </p>

          {/* Status */}
          <p>
            <span className="font-semibold text-gray-800">Status:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${
                task.status === "completed" ? "bg-green-600" : "bg-yellow-500"
              }`}
            >
              {task.status.toUpperCase()}
            </span>
          </p>
        </div>

        {/* Back button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-500 transition"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
