const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware"); 

// Create a new task
router.post("/tasks", authMiddleware, createTask);

// Get all tasks
router.get("/tasks", authMiddleware, getAllTasks);

// Get a task by ID
router.get("/tasks/:id", authMiddleware, getTaskById);

// Update a task by ID
router.put("/tasks/:id", authMiddleware, updateTask);

// Delete a task by ID
router.delete("/tasks/:id", authMiddleware, deleteTask);

// Update task status
router.patch("/tasks/:id/status", authMiddleware, updateTaskStatus);

//update priority
router.patch("/tasks/:id/priority", authMiddleware, updateTaskPriority);

module.exports = router;
