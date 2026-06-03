const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AuthRouter = require("./routes/AuthRouter");
const verifyToken = require("./middleware/auth");

const path = require("path");

dbConnect();

app.use(cors());
app.use(express.json());

// Phục vụ các file ảnh tĩnh từ thư mục images
app.use("/images", express.static(path.join(__dirname, "images")));

// Auth Route (Không cần bảo vệ)
app.use("/api/auth", AuthRouter); 
// Hoặc nếu muốn gọi trực tiếp /login ở gốc: 
// app.use("/", AuthRouter);
// Nhưng gọi /api/auth thì sẽ là /api/auth/login.
// Theo guide.md là POST /login nên ta mount vào "/"
app.use("/", AuthRouter);

// Các Routes cần bảo vệ bằng verifyToken:
app.use("/user", UserRouter);
app.use("/", verifyToken, PhotoRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
