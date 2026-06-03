const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../db/userModel");
const router = express.Router();

const secretKey = process.env.JWT_SECRET || "my_secret_key"; // Thay bằng secret key thật nếu có trong .env

// POST /api/users/login - API Đăng nhập
router.post("/api/users/login", async (req, res) => {
  const { login_name, password } = req.body;

  try {
    // Tìm user theo login_name
    const user = await User.findOne({ login_name: login_name });

    if (!user) {
      return res.status(400).send("Tên đăng nhập không tồn tại");
    }

    if (user.password !== password) {
      return res.status(400).send("Mật khẩu không chính xác");
    }

    // jwt.sign đóng gói thông tin user vào token, hết hạn sau 1 giờ
    jwt.sign(
      { user: { _id: user._id, first_name: user.first_name, last_name: user.last_name } },
      secretKey,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error generating token");
        } else {
          // Trả về token và thông tin cơ bản của user
          res.json({ token, user: { _id: user._id, first_name: user.first_name, last_name: user.last_name } });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// POST /api/users/logout - API Đăng xuất
router.post("/api/users/logout", (req, res) => {
  // Vì dùng JWT (stateless), việc xoá token sẽ do Client đảm nhận.
  // Ở Server chỉ cần check xem request có token hay không để trả về 400.
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(400).send("User is not logged in");
  }
  res.status(200).send("Logged out successfully");
});

module.exports = router;
