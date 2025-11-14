   const buttons = document.querySelectorAll('.accordion-button');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const icon = button.querySelector('.icon');

                // Đóng tất cả các accordion khác nếu đang mở
                document.querySelectorAll('.accordion-content.active').forEach(openContent => {
                    if (openContent !== content) {
                        openContent.classList.remove('active');
                        openContent.previousElementSibling.querySelector('.icon').innerHTML = '<i class="fas fa-chevron-down"></i>';
                        openContent.previousElementSibling.classList.remove('active'); // Đóng luôn trạng thái active của button
                    }
                });

                // Mở/đóng accordion hiện tại
                content.classList.toggle('active');
                button.classList.toggle('active'); // Thêm/bỏ class active cho button để đổi icon

                if (button.classList.contains('active')) {
                    icon.innerHTML = '<i class="fas fa-chevron-up"></i>'; // Dấu mũi tên lên
                } else {
                    icon.innerHTML = '<i class="fas fa-chevron-down"></i>'; // Dấu mũi tên xuống
                }
            });
        });