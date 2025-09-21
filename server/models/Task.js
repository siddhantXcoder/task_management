const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);