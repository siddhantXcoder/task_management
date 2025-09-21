const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController"); 
// ✅ Use a clear filename like authController.js instead of register.js

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

module.exports = router;