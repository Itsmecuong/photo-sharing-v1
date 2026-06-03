const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "my_secret_key";

function verifyToken(req, res, next) {
  // Lấy chuỗi token từ Header 'authorization' gửi lên
  const bearerHeader = req.headers['authorization'];
  
  if (typeof bearerHeader !== 'undefined') {
    // Chuỗi gửi lên có dạng: "Bearer <token>", cắt chuỗi lấy phần tử index [1]
    const bearerToken = bearerHeader.split(' ')[1]; 
    
    // Tiến hành giải mã kiểm tra chữ ký với secretKey
    jwt.verify(bearerToken, secretKey, (err, decoded) => {
      if (err) {
        // Token giả mạo hoặc hết hạn
        res.status(403).send('Invalid token');
      } else {
        // Đưa thông tin user đã giải mã vào req để các API sau dùng
        req.user = decoded.user;
        next(); // Token hợp lệ! Cho phép đi tiếp vào API chính
      }
    });
  } else {
    // Không tìm thấy Token trong Header
    res.status(401).send('Unauthorized');
  }
}

module.exports = verifyToken;
