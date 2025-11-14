import { supabase } from "./supabase.js";

const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    username: form.username.value.trim(),
    fullname: form.fullname.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    password: form.password.value.trim()
  };

  if (!user.username || !user.email || !user.password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    const { data, error } = await supabase.from("users").insert([user]);

    if (error) throw error;

    // Lưu localStorage
    localStorage.setItem("currentUser", JSON.stringify({
      username: user.username,
      email: user.email
    }));

    alert("Đăng ký thành công!");
    window.location.href = "./trangchu.html";

  } catch (err) {
    console.error(err);
    alert("Đăng ký thất bại: " + err.message);
  }
});

// Update header
function updateHeaderUser() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userSpan = document.getElementById("userNameLinks");
  if (user && userSpan) {
    userSpan.innerHTML = `Xin chào, <strong>${user.username}</strong>`;
  }
}

document.addEventListener("DOMContentLoaded", updateHeaderUser);
