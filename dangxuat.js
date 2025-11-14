import { supabase } from "./supabase.js"; // ✅ import client Supabase

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 10) {
    navbar.classList.add("shrink");
  } else {
    navbar.classList.remove("shrink");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const userInfo = JSON.parse(localStorage.getItem("currentUser")); // đổi lại cho đồng nhất

  if (userInfo) {
    const userLinks = document.getElementById("userNameLinks");
    if (userLinks) {
      userLinks.innerHTML = `
        <span>Xin chào, <strong>${userInfo.username}</strong></span> |
        <a href="#" id="logoutBtn">Đăng xuất</a>
      `;
    }
  }

  // ✅ Xử lý đăng xuất
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await supabase.auth.signOut();
        localStorage.removeItem("currentUser");
        alert("✅ Đăng xuất thành công!");
        window.location.reload();
      } catch (err) {
        console.error("Lỗi khi đăng xuất:", err.message);
        alert("⚠️ Đã có lỗi xảy ra khi đăng xuất.");
      }
    });
  }
});
