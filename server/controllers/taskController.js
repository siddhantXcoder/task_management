const Task = require("../models/Task");

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo: req.user._id, // link task to logged-in user
      status: "pending",
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tasks for the logged-in user
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Optional: Ensure the task belongs to the logged-in user
    if (!task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update task details
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(task, req.body); // update fields
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

// Update task status
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update task priority (optional endpoint for priority select)
const updateTaskPriority = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.priority = req.body.priority || task.priority;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
};
