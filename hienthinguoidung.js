function updateHeaderUser() {
  const userJSON = localStorage.getItem("currentUser"); // lấy dữ liệu từ localStorage
  const userSpan = document.getElementById("userNameLinks");

  if (!userSpan) return; // nếu chưa có phần tử thì thoát

  // Nếu chưa đăng nhập
  if (!userJSON) {
    userSpan.innerHTML = `
      <a href="./DangNhap.html">Đăng Nhập</a> /
      <a href="./DangKy.html">Đăng Ký</a>
    `;
    return;
  }

  // Nếu đã đăng nhập
  try {
    const user = JSON.parse(userJSON); // chuyển chuỗi thành object

    userSpan.innerHTML = `
      Xin chào, <strong>${user.username}</strong> 
      <button onclick="logout()" class="logout-btn"
        style="margin-left:8px; background:#c00; color:#fff; border:none; border-radius:6px; padding:4px 8px; cursor:pointer;">
        Đăng xuất
      </button>
    `;
  } catch (err) {
    console.error("Lỗi khi parse user:", err);
    localStorage.removeItem("currentUser"); // xoá dữ liệu lỗi
  }
}

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    localStorage.removeItem("currentUser");
    alert("✅ Đăng xuất thành công!");
    updateHeaderUser(); // cập nhật lại header
    // 👉 Nếu muốn quay về trang đăng nhập, thêm dòng dưới:
    // window.location.href = "./DangNhap.html";
  }
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", updateHeaderUser);
