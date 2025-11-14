document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================================
    // 1. DỮ LIỆU SẢN PHẨM (Đồng bộ với Sản Phẩm và Hộp Thiếc)
    // =========================================================
    const allProducts = [
        // SẢN PHẨM NỔI BẬT MẶC ĐỊNH
        { name: "Tiramisu", price: "580,000 VND", image: "./assets/Tiramissu.jpg" },
        { name: "Mousse Dưa lưới", price: "580,000 VND", image: "./assets/Dua-luoi.jpg" },
        { name: "Mousse Dâu", price: "540,000 VND", image: "./assets/Dau.jpg" },
        
        // CÁC SẢN PHẨM MOUSSE KHÁC (ĐỂ TÌM KIẾM)
        { name: "Mousse Nhãn", price: "540,000 VND", image: "./assets/Nhan.jpg" },
        { name: "Mousse Xoài", price: "540,000 VND", image: "./assets/Xoai.jpg" },
        { name: "Mousse Bưởi Hồng", price: "540,000 VND", image: "./assets/BuoiHong.jpg" },
        { name: "Mousse Blueberry", price: "540,000 VND", image: "./assets/Mousse-Blueberry.jpg" },
        { name: "Mix 6 vị Mousse", price: "540,000 VND", image: "./assets/6-Mix-vi.jpg" },
        { name: "Set 6 nguyên vị Mousse", price: "540,000 VND", image: "./assets/6-nguyen-set.jpg" },
        { name: "Mix 9 vị Mousse", price: "540,000 VND", image: "./assets/9-mix-vi.jpg" },
        { name: "Set 9 nguyên vị Mousse", price: "540,000 VND", image: "./assets/9-nguyen-set.jpg" },

        // CÁC SẢN PHẨM HỘP THIẾC (ĐỂ TÌM KIẾM)
        { name: "Tiramisu Hộp Thiếc", price: "580,000 VND", image: "./assets/DD-Dua-luoi-14.jpg" },
        { name: "Mousse Dưa lưới Hộp Thiếc", price: "580,000 VND", image: "./assets/Dua-luoi-thiec-dai-dien.jpg" },
        { name: "Tiramisu Gold Hộp Thiếc", price: "540,000 VND", image: "./assets/Tira-gold_dai-dien.jpg" },
    ];

    // 2. Khai báo các biến và phần tử HTML
    const searchToggle = document.getElementById('searchToggle'); 
    const searchOverlay = document.getElementById('searchOverlay'); 
    const closeSearchBtn = document.getElementById('closeSearch'); 
    const searchForm = searchOverlay ? searchOverlay.querySelector('.search-form-popup') : null;
    const productGrid = document.getElementById('productGrid'); // Vùng chứa sản phẩm
    
    // Các phần tử cần cập nhật hoặc ẩn đi
    const sectionTitle = document.querySelector('.section-title'); 
    const heroBanner = document.querySelector('.hero-banner');
    const breadcrumb = document.querySelector('.breadcrumb');
    const moreBtnContainer = document.querySelector('.more-btn-container');

    // ✨ PHẦN MỚI ĐƯỢC THÊM VÀO ĐỂ ẨN KHI TÌM KIẾM ✨
    const promoBanner = document.querySelector('.promo-banner'); // Banner quảng cáo
    const fixedContact = document.querySelector('.fixed-contact'); // Nút liên hệ nổi

    // =========================================================
    // 3. CÁC HÀM HIỂN THỊ VÀ TÌM KIẾM
    // =========================================================

    // Hàm tạo HTML cho một thẻ sản phẩm
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
                    <p class="product-price">Giá từ: <span>${product.price}</span></p>
                    <button class="btn-cart">Thêm vào giỏ hàng <i class="fa-solid fa-cart-shopping"></i></button>
                </div>
            </div>
        `;
    }

    // Hàm hiển thị kết quả (Hàm này giờ sẽ điều khiển việc ẩn/hiện mọi thứ)
    function displayProducts(products, isSearch = false) {
        if (!productGrid) return;
        
        // Cập nhật tiêu đề
        if (sectionTitle) {
             if (isSearch) {
                sectionTitle.textContent = `Kết quả tìm kiếm (${products.length})`;
            } else {
                sectionTitle.textContent = 'Sản phẩm nổi bật';
            }
        }
        
        // ẨN/HIỆN CÁC PHẦN TỬ PHỤ
        // isSearch = true (đang tìm kiếm) -> 'none' (ẩn đi)
        // isSearch = false (mặc định) -> 'block' hoặc 'flex' (hiện ra)
        if (heroBanner) heroBanner.style.display = isSearch ? 'none' : 'block';
        if (breadcrumb) breadcrumb.style.display = isSearch ? 'none' : 'block';
        if (moreBtnContainer) moreBtnContainer.style.display = isSearch ? 'none' : 'block';
        
        // ✨ LOGIC ẨN/HIỆN MỚI ✨
        if (promoBanner) promoBanner.style.display = isSearch ? 'none' : 'block';
        if (fixedContact) fixedContact.style.display = isSearch ? 'none' : 'flex'; // Dùng 'flex' vì CSS của bạn là flex

        // Hiển thị sản phẩm
        if (products.length === 0 && isSearch) { // Chỉ hiển thị "Không tìm thấy" KHI ĐANG TÌM KIẾM
            productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 50px; font-weight: 600;">Không tìm thấy sản phẩm nào phù hợp với từ khóa.</p>';
        } else {
            let html = products.map(createProductCard).join('');
            productGrid.innerHTML = html;
        }
    }
    
    // Hàm thực hiện tìm kiếm
    function performSearch(keyword) {
        const lowerKeyword = keyword.toLowerCase().trim();
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(lowerKeyword)
        );
        displayProducts(filteredProducts, true); // true = đang tìm kiếm
    }
    
    // Hàm khôi phục hiển thị
    function restoreDefaultDisplay() {
        const defaultProducts = allProducts.slice(0, 3); 
        displayProducts(defaultProducts, false); // false = không tìm kiếm
    }

    // =========================================================
    // 4. CHỨC NĂNG TÌM KIẾM VÀ OVERLAY
    // =========================================================

    // Mở thanh tìm kiếm
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault(); 
            searchOverlay.classList.add('active'); 
            const searchInput = searchOverlay.querySelector('.search-input-popup');
            if (searchInput) {
                setTimeout(() => { searchInput.focus(); }, 100); 
            }
        });
    }

    // Đóng thanh tìm kiếm
    if (closeSearchBtn && searchOverlay) {
        closeSearchBtn.addEventListener('click', function() {
            searchOverlay.classList.remove('active'); 
        });
    }
    
    // Đóng khi nhấn phím ESCAPE
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && searchOverlay && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });

    // XỬ LÝ SỰ KIỆN SUBMIT FORM TÌM KIẾM
    if (searchForm && searchOverlay) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn chặn form submit và chuyển trang

            const searchInput = searchOverlay.querySelector('.search-input-popup');
            const keyword = searchInput.value.trim(); 

            searchOverlay.classList.remove('active'); // Đóng overlay

            if (keyword) {
                performSearch(keyword); 
            } else {
                 // Nếu submit ô trống, khôi phục lại trang nổi bật mặc định
                restoreDefaultDisplay();
            }
        });
    }

    // 5. KHỞI TẠO: Hiển thị 3 sản phẩm nổi bật ban đầu
    restoreDefaultDisplay(); 
});