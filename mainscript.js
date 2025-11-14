// ✅ mainscript.js — phiên bản đã được sửa hoàn chỉnh
document.addEventListener('DOMContentLoaded', function () {
    // =========================================================
    // 1. DỮ LIỆU SẢN PHẨM
    // =========================================================
    const allProducts = [
        { id: 'Tiramisu', name: "Tiramisu", price: 780000, priceDisplay: "780,000 VND", image: "./assets/Tiramissu.jpg" },
        { id: 'MousseDuaLuoi', name: "Mousse Dưa lưới", price: 580000, priceDisplay: "580,000 VND", image: "./assets/Dua-luoi.jpg" },
        { id: 'MousseDau', name: "Mousse Dâu", price: 540000, priceDisplay: "540,000 VND", image: "./assets/Dau.jpg" },
        { id: 'MousseNhan', name: "Mousse Nhãn", price: 540000, priceDisplay: "540,000 VND", image: "./assets/Nhan.jpg" },
        { id: 'MousseXoai', name: "Mousse Xoài", price: 540000, priceDisplay: "540,000 VND", image: "./assets/Xoai.jpg" },
        { id: 'TiramisuHopThiec', name: "Tiramisu Hộp Thiếc", price: 580000, priceDisplay: "580,000 VND", image: "./assets/Tira-gold_dai-dien.jpg" },
    ];

    // =========================================================
    // 2. KHAI BÁO BIẾN CHUNG
    // =========================================================
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearchBtn = document.getElementById('closeSearch');
    const searchForm = searchOverlay ? searchOverlay.querySelector('.search-form-popup') : null;

    const cartToggle = document.getElementById('cartToggle');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const cartBody = document.querySelector('.cart-body');
    const cartCountElement = document.getElementById('cart-count');

    const productGrid = document.getElementById('productGrid');
    const sectionTitle = document.querySelector('.section-title');
    const heroBanner = document.querySelector('.hero-banner');
    const breadcrumb = document.querySelector('.breadcrumb');
    const moreBtnContainer = document.querySelector('.more-btn-container');
    const promoBanner = document.querySelector('.promo-banner');
    const fixedContact = document.querySelector('.fixed-contact');

    const VAT_RATE = 0.00;
    let cart = JSON.parse(localStorage.getItem('the350f_cart')) || [];

    // =========================================================
    // 3. MỞ / ĐÓNG OVERLAY
    // =========================================================
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function (e) {
            e.preventDefault();
            if (cartOverlay) cartOverlay.classList.remove('active');
            searchOverlay.classList.add('active');
            const input = searchOverlay.querySelector('.search-input-popup');
            if (input) setTimeout(() => input.focus(), 100);
        });
    }

    if (closeSearchBtn && searchOverlay) {
        closeSearchBtn.addEventListener('click', () => searchOverlay.classList.remove('active'));
    }

    if (cartToggle && cartOverlay) {
        cartToggle.addEventListener('click', function (e) {
            e.preventDefault();
            if (searchOverlay) searchOverlay.classList.remove('active');
            cartOverlay.classList.add('active');
        });
    }

    if (closeCartBtn && cartOverlay) {
        closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (searchOverlay) searchOverlay.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
        }
    });

    // =========================================================
    // 4. HIỂN THỊ VÀ TÌM KIẾM SẢN PHẨM
    // =========================================================
    function createProductCard(product) {
        const badges = '<span class="badge hot">Hot</span><span class="badge new">Mới</span>';
        return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${badges}
            </div>
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">Giá từ: <span>${product.priceDisplay}</span></p>
                <button class="btn-cart"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-display="${product.priceDisplay}"
                    data-image="${product.image}">
                    Thêm vào giỏ hàng <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
        </div>`;
    }

    function displayProducts(products, isSearch = false, keyword = '') {
        if (!productGrid) return;

        sectionTitle.textContent = isSearch
            ? `Kết quả tìm kiếm cho "${keyword}" (${products.length})`
            : 'Sản phẩm nổi bật';

        heroBanner && (heroBanner.style.display = isSearch ? 'none' : 'block');
        breadcrumb && (breadcrumb.style.display = isSearch ? 'none' : 'block');
        moreBtnContainer && (moreBtnContainer.style.display = isSearch ? 'none' : 'block');
        promoBanner && (promoBanner.style.display = isSearch ? 'none' : 'block');
        fixedContact && (fixedContact.style.display = isSearch ? 'none' : 'flex');

        if (products.length === 0 && isSearch) {
            productGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding:50px;">Không tìm thấy sản phẩm nào.</p>`;
        } else {
            productGrid.innerHTML = products.map(createProductCard).join('');
        }
    }

    function performSearch(keyword) {
        const kw = keyword.toLowerCase().trim();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(kw));
        displayProducts(filtered, true, keyword);
    }

    function restoreDefaultDisplay() {
        displayProducts(allProducts.slice(0, 3), false);
    }

    if (searchForm && searchOverlay) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const searchInput = searchOverlay.querySelector('.search-input-popup');
            const keyword = searchInput.value.trim();
            searchOverlay.classList.remove('active');

            const isHome = ['/', '/index.html', '/trangchu.html'].some(path => window.location.pathname.endsWith(path));

            if (keyword) {
                if (isHome) performSearch(keyword);
                else window.location.href = `./SanPham.html?keyword=${encodeURIComponent(keyword)}`;
            } else if (isHome) restoreDefaultDisplay();
        });
    }

    // =========================================================
    // 5. HÀM CHUNG CHO GIỎ HÀNG
    // =========================================================
    function saveCart() {
        localStorage.setItem('the350f_cart', JSON.stringify(cart));
    }

    window.parsePrice = str => parseFloat(String(str).replace(/,/g, '').replace(' VND', '').replace(/\s/g, ''));
    window.formatPrice = n =>
        isNaN(n)
            ? '0 VND'
            : n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'VND');

    function calculateCartTotals() {
        let subtotal = 0;
        cart.forEach(i => (subtotal += i.price * i.quantity));
        const vat = subtotal * VAT_RATE;
        return { subtotal, vatAmount: vat, finalTotal: subtotal + vat };
    }

    function updateMiniCartUI() {
        const { finalTotal } = calculateCartTotals();

        // Cập nhật số lượng
        if (cartCountElement) {
            let totalItems = 0;
            cart.forEach(i => (totalItems += i.quantity));
            cartCountElement.textContent = totalItems;
        }

        if (!cartBody) return;

        if (cart.length === 0) {
            cartBody.innerHTML = '<p style="padding:15px;">Chưa có sản phẩm trong giỏ hàng.</p>';
        } else {
            cartBody.innerHTML = cart
                .map(
                    (p, i) => `
                <div class="mini-cart-item">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="mini-cart-item-info">
                        <h5>${p.name}</h5>
                        <span>${p.quantity} × ${p.priceDisplay}</span>
                    </div>
                    <button class="mini-cart-remove" data-index="${i}">&times;</button>
                </div>`
                )
                .join('');
        }

        const totalEl = document.querySelector('.mini-cart-total-value');
        if (totalEl) totalEl.textContent = window.formatPrice(finalTotal);
    }

    function addToCart(product) {
        const existing = cart.findIndex(i => i.id === product.id);
        if (existing > -1) cart[existing].quantity += 1;
        else cart.push(product);
        saveCart();
        updateMiniCartUI();
        if (window.location.pathname.includes('giohang.html')) renderCartDetail();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        updateMiniCartUI();
        if (window.location.pathname.includes('giohang.html')) renderCartDetail();
        if (window.location.pathname.includes('thanhtoan.html')) renderCheckoutSummary();
    }

    function updateCartItemQuantity(index, newQty) {
        if (newQty <= 0) removeFromCart(index);
        else {
            cart[index].quantity = newQty;
            saveCart();
            updateMiniCartUI();
            if (window.location.pathname.includes('giohang.html')) renderCartDetail();
            if (window.location.pathname.includes('thanhtoan.html')) renderCheckoutSummary();
        }
    }

    // =========================================================
    // 6. SỰ KIỆN TOÀN CỤC
    // =========================================================
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn-cart');
        if (btn) {
            e.preventDefault();
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                priceDisplay: btn.dataset.display,
                image: btn.dataset.image,
                quantity: 1,
            };
            addToCart(product);
            cartOverlay && cartOverlay.classList.add('active');
        }

        const rmMini = e.target.closest('.mini-cart-remove');
        if (rmMini) removeFromCart(parseInt(rmMini.dataset.index));

        const rmDetail = e.target.closest('.cart-item-remove');
        if (rmDetail) removeFromCart(parseInt(rmDetail.dataset.index));

        if (e.target.classList.contains('qty-btn')) {
            const i = parseInt(e.target.dataset.index);
            const action = e.target.dataset.action;
            const input = document.getElementById(`qty-input-${i}`);
            let newQ = parseInt(input.value);
            newQ = action === 'increase' ? newQ + 1 : Math.max(1, newQ - 1);
            input.value = newQ;
            updateCartItemQuantity(i, newQ);
        }
    });

    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('cart-qty-input')) {
            const i = parseInt(e.target.dataset.index);
            const newQ = parseInt(e.target.value);
            updateCartItemQuantity(i, isNaN(newQ) || newQ < 1 ? 1 : newQ);
        }
    });

    // =========================================================
    // 7. TRANG GIỎ HÀNG CHI TIẾT
    // =========================================================
    const cartDetailBody = document.getElementById('cartDetailBody');
    const subtotalElementGH = document.getElementById('cartSubtotal');
    const vatElementGH = document.getElementById('cartVAT');
    const totalElementGH = document.getElementById('cartTotal');

    function renderCartDetail() {
        if (!cartDetailBody) return;
        const { subtotal, vatAmount, finalTotal } = calculateCartTotals();

        if (cart.length === 0) {
            cartDetailBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Giỏ hàng trống.</td></tr>`;
        } else {
            cartDetailBody.innerHTML = cart
                .map(
                    (i, idx) => `
                <tr class="cart-detail-item">
                    <td class="product-col">
                        <button class="cart-item-remove" data-index="${idx}">&times;</button>
                        <img src="${i.image}" alt="${i.name}">
                        <div class="product-info">${i.name}<span class="product-size"> - 20 cm</span></div>
                    </td>
                    <td class="price-col">${i.priceDisplay}</td>
                    <td class="qty-col">
                        <div class="quantity-control">
                            <button class="qty-btn" data-action="decrease" data-index="${idx}">-</button>
                            <input type="number" class="cart-qty-input" id="qty-input-${idx}" value="${i.quantity}" min="1" data-index="${idx}">
                            <button class="qty-btn" data-action="increase" data-index="${idx}">+</button>
                        </div>
                    </td>
                    <td class="subtotal-col">${window.formatPrice(i.price * i.quantity)}</td>
                </tr>`
                )
                .join('');
        }

        subtotalElementGH && (subtotalElementGH.textContent = window.formatPrice(subtotal));
        vatElementGH && (vatElementGH.textContent = window.formatPrice(vatAmount));
        totalElementGH && (totalElementGH.textContent = window.formatPrice(finalTotal));
    }

    // =========================================================
    // 8. TRANG THANH TOÁN
    // =========================================================
    function renderCheckoutSummary() {
        const orderSummaryContainer = document.getElementById('orderSummary');
        const subtotalElement = document.getElementById('checkoutSubtotal');
        const vatElement = document.getElementById('checkoutVAT');
        const totalElement = document.getElementById('checkoutTotal');
        const { subtotal, vatAmount, finalTotal } = calculateCartTotals();

        if (!orderSummaryContainer) return;

        if (cart.length === 0) {
            orderSummaryContainer.innerHTML = `<p style="text-align:center;">Giỏ hàng trống.</p>`;
            subtotalElement.textContent = vatElement.textContent = totalElement.textContent = window.formatPrice(0);
            return;
        }

        orderSummaryContainer.innerHTML = cart
            .map(
                i => `
            <div class="order-item">
                <img src="${i.image}" alt="${i.name}">
                <div class="order-item-details">
                    <p>${i.name}</p>
                    <span>${i.quantity} × ${i.priceDisplay}</span>
                </div>
                <span>${window.formatPrice(i.price * i.quantity)}</span>
            </div>`
            )
            .join('');

        subtotalElement.textContent = window.formatPrice(subtotal);
        vatElement.textContent = window.formatPrice(vatAmount);
        totalElement.textContent = window.formatPrice(finalTotal);
    }

    const placeOrderButton = document.getElementById('btnPlaceOrder');
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function (e) {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const province = document.getElementById('province').value.trim();
            const district = document.getElementById('district').value.trim();
            const ward = document.getElementById('ward').value.trim();
            const address = document.getElementById('address').value.trim();

            if (cart.length === 0) return alert('Giỏ hàng trống!');
            if (!fullname || !phone || !province || !district || !ward || !address)
                return alert('Vui lòng điền đầy đủ thông tin giao hàng.');

            localStorage.removeItem('the350f_cart');
            updateMiniCartUI();
            window.location.href = 'dathangthanhcong.html';
        });
    }

    // =========================================================
    // 9. KHỞI TẠO
    // =========================================================
    if (window.location.pathname.includes('giohang.html')) renderCartDetail();
    if (window.location.pathname.includes('trangthanhtoan.html')) renderCheckoutSummary(); 
    updateMiniCartUI();
    if (productGrid) restoreDefaultDisplay();
});
