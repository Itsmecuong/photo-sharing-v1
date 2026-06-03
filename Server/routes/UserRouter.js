const express = require("express");
const User = require("../db/userModel");
const verifyToken = require("../middleware/auth");
const router = express.Router();

/**
 * GET /user/list
 * Trả về danh sách tất cả người dùng (chỉ _id, first_name, last_name)
 * Dùng cho sidebar/UserList component
 */
router.get("/list", verifyToken, async (request, response) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    response.json(users);
  } catch (error) {
    console.error("Error fetching user list:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

router.get("/test", verifyToken, async (request, response) => {
  try {
    const rawUsers = await User.collection.find().toArray();
    response.json(rawUsers);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

/**
 * GET /user/:id
 * Trả về thông tin chi tiết của một người dùng theo ID
 * Dữ liệu: _id, first_name, last_name, location, description, occupation
 */
router.get("/:id", verifyToken, async (request, response) => {
  const { id } = request.params;
  try {
    const user = await User.findById(id, "_id first_name last_name location description occupation");
    if (!user) {
      return response.status(400).json({ error: "User not found" });
    }
    response.json(user);
  } catch (error) {
    // Mongoose sẽ throw CastError nếu id sai định dạng ObjectId
    console.error("Error fetching user detail:", error);
    response.status(400).json({ error: "Invalid user ID or user not found" });
  }
});

/**
 * POST /user
 * Đăng ký tài khoản mới
 */
router.post("/", async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;

  if (!login_name || login_name.trim() === "") {
    return res.status(400).send("login_name is required");
  }
  if (!password || password.trim() === "") {
    return res.status(400).send("password is required");
  }
  if (!first_name || first_name.trim() === "") {
    return res.status(400).send("first_name is required");
  }
  if (!last_name || last_name.trim() === "") {
    return res.status(400).send("last_name is required");
  }

  try {
    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).send("login_name already exists");
    }

    const newUser = new User({
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation
    });

    await newUser.save();
    res.status(200).json({ login_name: newUser.login_name, _id: newUser._id });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;