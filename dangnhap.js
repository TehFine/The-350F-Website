

import { supabase } from './supabase.js';

const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailOrUser = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Query bảng users
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .or(`email.eq.${emailOrUser},username.eq.${emailOrUser}`)
    .limit(1);

  if (error) {
    alert("Có lỗi xảy ra!");
    console.error(error);
    return;
  }

  if (!users || users.length === 0) {
    alert("Tài khoản không tồn tại!");
    return;
  }

  const user = users[0];

  if (user.password !== password) {
    alert("Sai mật khẩu!");
    return;
  }

  alert("Đăng nhập thành công!");

  // Lưu localStorage
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      username: user.username,
      email: user.email
    })
  );

  window.location.href = "trangchu.html";
});
