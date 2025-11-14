

import { supabase } from './supabase.js';

const cartItemsDiv = document.getElementById('cartItems');
const cartTotal = document.querySelector('.cart-total-price');
const btnConfirmOrder = document.getElementById('btnConfirmOrder');

let cartItems = [];
let total = 0;

// ======= Load giỏ hàng =======
async function loadCart() {
  const { data, error } = await supabase.from('cart_items').select('*');
  if (error) {
    console.error(error);
    cartItemsDiv.innerHTML = "<p>Lỗi khi tải giỏ hàng.</p>";
    return;
  }

  cartItems = data;
  if (!cartItems.length) {
    cartItemsDiv.innerHTML = "<p>Giỏ hàng trống!</p>";
    cartTotal.textContent = "0 VND";
    return;
  }

  total = 0;
  cartItemsDiv.innerHTML = '';

  cartItems.forEach(item => {
    total += item.price_at_add * item.quantity;
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${item.name} - ${item.quantity} × ${item.price_at_add.toLocaleString('vi-VN')} VND</p>
    `;
    cartItemsDiv.appendChild(div);
  });

  cartTotal.textContent = total.toLocaleString('vi-VN') + " VND";
}

// ======= Xác nhận đơn hàng =======
btnConfirmOrder.addEventListener('click', async () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser || !currentUser.email || !currentUser.username) {
    alert("Bạn cần đăng nhập trước khi đặt hàng!");
    window.location.href = "DangNhap.html";
    return;
  }

  try {
    // 🔍 Lấy thông tin user từ bảng users
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', currentUser.username)
      .eq('email', currentUser.email)
      .single();

    if (userError || !user) {
      console.error(userError);
      alert("Không tìm thấy thông tin người dùng trong hệ thống!");
      return;
    }

    // 🧾 Tạo đơn hàng mới
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        customer_name: user.fullname,
        customer_email: user.email,
        customer_phone: user.phone,
        address: user.address,
        total_amount: total,
        status: 'Chờ thanh toán'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 🧹 Xóa giỏ hàng
    await supabase.from('cart_items').delete().neq('id', 0);

    // 🔒 Lưu order_id để dùng ở màn thanh toán
    localStorage.setItem('latestOrderId', order.id);

    alert("Đơn hàng đã được tạo thành công! Chuyển sang trang thanh toán...");
    window.location.href = "thanhtoan.html";

  } catch (err) {
    console.error("Lỗi khi tạo đơn hàng:", err);
    alert("Có lỗi xảy ra khi xác nhận đơn hàng!");
  }
});

// Khi tải trang, hiển thị giỏ hàng
document.addEventListener('DOMContentLoaded', loadCart);
