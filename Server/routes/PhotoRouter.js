const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const router = express.Router();

// Cấu hình Multer để upload file vào thư mục images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

/**
 * GET /photosOfUser/:id
 * Trả về toàn bộ ảnh của người dùng, kèm thông tin bình luận và user bình luận.
 * 
 * Cấu trúc trả về mỗi photo:
 *   { _id, user_id, file_name, date_time, comments: [{ _id, comment, date_time, user: { _id, first_name, last_name } }] }
 * 
 * Kỹ thuật: resolve tất cả user trong comments concurrently bằng Promise.all
 */

router.get("/photosOfUser/:id", async (request, response) => {
  const { id } = request.params;
  try {
    // Lấy tất cả ảnh của user theo user_id
    const photos = await Photo.find({ user_id: id });

    if (!photos) {
      return response.status(400).json({ error: "No photos found for this user" });
    }

    // Với mỗi ảnh, resolve thông tin user cho từng comment (concurrent)
    const photosWithUserInfo = await Promise.all(
      photos.map(async (photo) => {
        // Lấy thông tin user cho từng comment trong ảnh này (concurrent)
        const commentsWithUser = await Promise.all(
          photo.comments.map(async (comment) => {
            const commentUser = await User.findById(
              comment.user_id,
              "_id first_name last_name"
            );
            // Tạo object mới, chỉ giữ các field cần thiết (không dùng Mongoose doc trực tiếp)
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user: commentUser
                ? {
                  _id: commentUser._id,
                  first_name: commentUser.first_name,
                  last_name: commentUser.last_name,
                }
                : null,
            };
          })
        );

        // Tạo object mới cho photo, chỉ giữ các field cần thiết
        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments: commentsWithUser,
        };
      })
    );

    response.json(photosWithUserInfo);
  } catch (error) {
    console.error("Error fetching photos of user:", error);
    response.status(400).json({ error: "Invalid user ID or error fetching photos" });
  }
});

/**
 * POST /commentsOfPhoto/:photo_id
 * Thêm một bình luận mới vào bức ảnh
 */
router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  const { photo_id } = req.params;
  const { comment } = req.body;
  const user_id = req.user._id; // Lấy từ verifyToken

  if (!comment || comment.trim() === "") {
    return res.status(400).send("Comment cannot be empty");
  }

  try {
    const photo = await Photo.findById(photo_id);
    if (!photo) {
      return res.status(400).send("Photo not found");
    }

    photo.comments.push({
      comment: comment,
      date_time: new Date(),
      user_id: user_id
    });

    await photo.save();
    res.status(200).json({ message: "Comment added successfully" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /photos/new
 * Upload một bức ảnh mới
 */
router.post("/photos/new", upload.single("photo"), async (req, res) => {
  const user_id = req.user._id;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const newPhoto = new Photo({
      file_name: req.file.filename,
      date_time: new Date(),
      user_id: user_id,
      comments: []
    });

    await newPhoto.save();
    res.status(200).json({ message: "Photo uploaded successfully" });
  } catch (err) {
    console.error("Error saving photo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
