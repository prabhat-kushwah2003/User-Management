const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// @desc    Add a new user
// @route   POST /api/users
const addUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, status, location } =
      req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Remove uploaded file if email exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      gender,
      status,
      profileImage: req.file.filename,
      location,
    });

    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    // Remove uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users with search and pagination
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await User.countDocuments(searchQuery);
    const users = await User.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName, email, mobile, gender, status, location } =
      req.body;

    // Check if email is taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ message: "Email already used by another user" });
      }
    }

    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.gender = gender || user.gender;
    user.status = status || user.status;
    user.location = location || user.location;

    // Update profile image if new one uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, "../uploads", user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      user.profileImage = req.file.filename;
    }

    const updatedUser = await user.save();
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete profile image
    const imagePath = path.join(__dirname, "../uploads", user.profileImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Export users to CSV
// @route   GET /api/users/export/csv
const exportCSV = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Build CSV manually
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Mobile",
      "Gender",
      "Status",
      "Location",
      "Created At",
    ];

    let csv = headers.join(",") + "\n";

    users.forEach((user) => {
      const row = [
        user._id,
        user.firstName,
        user.lastName,
        user.email,
        user.mobile,
        user.gender,
        user.status,
        user.location,
        new Date(user.createdAt).toLocaleDateString(),
      ];
      csv += row.map((field) => `"${field}"`).join(",") + "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  exportCSV,
};
