# Tổng quan dự án Photo Sharing (Project 4)

## 1. Giới thiệu chung
Dự án **Photo Sharing** là một ứng dụng web dạng **Single Page Application (SPA)** được xây dựng bằng **React**. Ứng dụng mô phỏng một nền tảng chia sẻ ảnh cơ bản, cho phép hiển thị danh sách người dùng, xem thông tin chi tiết của một người dùng cụ thể, cũng như xem các bức ảnh và bình luận liên quan đến ảnh của họ.

Dự án hiện tại đang ở giai đoạn xây dựng giao diện (Front-end) và kết nối với dữ liệu tĩnh giả lập (mock data), chưa tích hợp server/backend.

---

## 2. Công nghệ sử dụng
- **Javascript Framework:** [React 18](https://reactjs.org/) (được khởi tạo qua Create React App).
- **Định tuyến (Routing):** `react-router-dom` (Version 6).
- **Thư viện Giao diện (UI Components):** Lấy giao diện từ thư viện `@mui/material` (Material-UI).
- **Styling:** CSS thuần tuý kết hợp với layout system của Material-UI (Grid system, Paper, Typography).

---

## 3. Kiến trúc và Cấu trúc thư mục mã nguồn
Mã nguồn chính nằm trong thư mục `src/`, dưới đây là các phần quan trọng nhất:

### Phân tuyến chính (`src/App.js`):
- Ứng dụng có layout chia làm 2 phần cơ bản (sau thanh TopBar): 
  - Cột bên trái (chiếm 3/12 màn hình) luôn hiển thị danh sách người dùng (`UserList`). 
  - Cột bên phải (chiếm 9/12 màn hình) là nội dung chính, thay đổi tùy theo Route.
- Các Routes đang được sử dụng:
  - `/users` : Mặc định bên phải hiển thị phần danh sách (hiện trỏ ngược về `UserList`).
  - `/users/:userId` : Render ra màn hình `UserDetail` của một người dùng có ID tương ứng.
  - `/photos/:userId` : Render ra màn hình `UserPhotos` chứa toàn bộ hình ảnh của người dùng có ID tương ứng.

### Các Component Giao diện (`src/components/`):
- `TopBar`: Thanh điều hướng AppBar nằm trên cùng của ứng dụng.
- `UserList`: Có nhiệm vụ lấy danh sách người dùng ra và render thành một List. Hiện tại thẻ này đã hoạt động và đang gọi nội dung từ biến tĩnh `models`.
- `UserDetail`: Dùng để hiển thị trọn vẹn thông tin chi tiết một người dùng cụ thể (tên tuổi, quê quán, nghề nghiệp...).
- `UserPhotos`: Dùng để load và render tất cả ảnh của một tài khoản cùng với các bình luận (comments) tương ứng trong từng bức ảnh.

### Tổ chức dữ liệu (`src/modelData/models.js`):
Do chưa kết nối API, dự án dùng file dữ liệu mẫu này chứa logic database tạm thời. Export ra object `models` cung cấp các hàm lấy dữ liệu:
- `models.userListModel()`: Lọc danh sách người dùng.
- `models.userModel(userId)`: Lấy thông tin user bằng ID.
- `models.photoOfUserModel(userId)`: Trả về cục mảng Ảnh (bên trong kèm thông tin Comments) của một userID cụ thể.
- `src/lib/fetchModelData.js`: Nhằm chuẩn bị cho tương lai để viết hàm Fetching (lấy dữ liệu HTTP hoặc API).

---

## 4. Thực trạng và Code hiện tại
Các Component trong project vẫn đang ở dạng base/placeholder.
- Code ở `UserDetail/index.jsx` và `UserPhotos/index.jsx` mới chỉ lấy được ID trên thanh URL thông qua `useParams()` của React Router, và chỉ đang render ra câu chữ mẫu placeholder (ví dụ: *"This should be the UserPhotos view..."*), chưa kết nối với dữ liệu `models` thực tế để map thành giao diện.
- Đây có thể là bài tập (Project 4 trong khóa học) cần phải làm tiếp hoặc framework khung cho các code tính năng sau này. Người phát triển tiếp theo sẽ cần vào 2 components trên để code logic map data ra thành UI thực sự.

---

## 5. Hướng dẫn cài đặt và Chạy thử
1. Đảm bảo đã cài `Node.js`.
2. Mở terminal tại thư mục gốc của dự án `photo-sharing-v1`, chạy lệnh để cài đặt các thư viện (nếu chưa cài):
   ```bash
   npm install
   ```
3. Chạy Project ở môi trường dev:
   ```bash
   npm start
   ```
4. Mở trình duyệt và truy cập `http://localhost:3000` (sau khi compile xong sẽ tự mở) để xem kết quả nghiệm thu ban đầu.
