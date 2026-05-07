const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  exportCSV,
} = require("../controllers/userController");

// CSV export route (must be before /:id to avoid conflict)
router.get("/export/csv", exportCSV);

// CRUD routes
router.post("/", upload.single("profileImage"), addUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", upload.single("profileImage"), updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
