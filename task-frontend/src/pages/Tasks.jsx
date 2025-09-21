import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 4;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const truncateText = (text, limit = 80) =>
    text.length > limit ? text.slice(0, limit) + "..." : text;

  const fetchTasks = async () => {
    try {
      const res = await API.get("/task/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(sortTasksByPriority(res.data.tasks));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const sortTasksByPriority = (tasks) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return tasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };

  const handleChange = (e) =>
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await API.put(`/task/tasks/${editingTask._id}`, taskForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task updated successfully!");
      } else {
        await API.post("/task/tasks", taskForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task created successfully!");
      }
      setShowModal(false);
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/task/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleComplete = async (id) => {
    try {
      await API.patch(
        `/task/tasks/${id}/status`,
        { status: "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Task marked as completed!");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    try {
      await API.put(
        `/task/tasks/${id}`,
        { priority: newPriority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Priority updated to ${newPriority}`);
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update priority");
    }
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 p-6 overflow-y-auto">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 drop-shadow">
          📋 My Tasks
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-500 transition"
          >
            + Add Task
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              toast.success("Logged out successfully!");
              window.location.href = "/";
            }}
            className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="flex justify-center">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-5xl">
          {currentTasks.length === 0 && (
            <p className="text-center text-gray-500 col-span-full mt-10">
              No tasks found. Add some tasks to get started!
            </p>
          )}

          {currentTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white/90 backdrop-blur-md border border-gray-200 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-2 ${priorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority.toUpperCase()}
                </div>
                <h3 className="text-lg font-bold mb-1 text-gray-800">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {truncateText(task.description)}
                </p>
                {task.description.length > 80 && (
                  <button
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="text-purple-600 hover:underline text-xs font-medium"
                  >
                    Show more
                  </button>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p
                  className={`font-semibold text-sm mt-2 ${
                    task.status === "completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {task.status.toUpperCase()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditingTask(task);
                    setTaskForm({
                      title: task.title,
                      description: task.description,
                      dueDate: task.dueDate.split("T")[0],
                      priority: task.priority,
                    });
                    setShowModal(true);
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-base"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleComplete(task._id)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 text-base"
                >
                  Complete
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 text-base"
                >
                  Delete
                </button>

                <select
                  value={task.priority}
                  onChange={(e) =>
                    handlePriorityChange(task._id, e.target.value)
                  }
                  className="w-full border rounded-md px-3 py-2 text-base"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === i + 1
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-purple-700">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                value={taskForm.title}
                onChange={handleChange}
                placeholder="Task Title"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
              <textarea
                name="description"
                value={taskForm.description}
                onChange={handleChange}
                placeholder="Task Description"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                rows="3"
                required
              />
              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setTaskForm({
                      title: "",
                      description: "",
                      dueDate: "",
                      priority: "medium",
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
