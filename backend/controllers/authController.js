const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ✅ Signup Function (with Age)
exports.signup = async (req, res) => {
  try {
    const { email, password, phone, age } = req.body; // ✅ Get age from req.body

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // ✅ Hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, phone, age }); // ✅ Include age
    await user.save();

    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ✅ Login Function (No changes)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "No user found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Login success" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};