"use strict";

// Chờ HTML tải xong rồi mới chạy JavaScript
document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // 1. LẤY CÁC PHẦN TỬ HTML
    // ==============================

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    const typingText = document.getElementById("typingText");

    const currentYear = document.getElementById("currentYear");

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    // ==============================
    // 2. CHUYỂN CHẾ ĐỘ SÁNG / TỐI
    // ==============================

    function updateThemeIcon() {
        if (!themeIcon) return;

        const isDark = document.body.classList.contains("dark-mode");

        themeIcon.textContent = isDark ? "☀️" : "🌙";
        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
        );
    }

    // Đọc chế độ đã chọn trước đó nếu trình duyệt cho phép
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("website-theme");
    } catch (error) {
        savedTheme = null;
    }

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");

            try {
                localStorage.setItem(
                    "website-theme",
                    isDark ? "dark" : "light"
                );
            } catch (error) {
                // Website vẫn hoạt động nếu trình duyệt không cho lưu
            }

            updateThemeIcon();
        });
    }

    // ==============================
    // 3. MENU TRÊN ĐIỆN THOẠI
    // ==============================

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Đóng menu" : "Mở menu"
            );
        });

        // Đóng menu sau khi chọn một mục
        const navLinks = navMenu.querySelectorAll(".nav-link");

        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Mở menu");
            });
        });

        // Đóng menu khi nhấn phím Escape
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                navMenu.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Mở menu");
            }
        });
    }

    // ==============================
    // 4. HIỆU ỨNG CHỮ ĐANG GÕ
    // ==============================

    if (typingText) {
        const words = [
            "Sinh viên",
            "Người yêu công nghệ",
            "Người học thiết kế web",
            "Người thích sáng tạo"
        ];

        let wordIndex = 0;
        let characterIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                characterIndex--;
            } else {
                characterIndex++;
            }

            typingText.textContent = currentWord.substring(
                0,
                characterIndex
            );

            let delay = isDeleting ? 55 : 100;

            // Khi đã gõ xong một cụm từ
            if (!isDeleting && characterIndex === currentWord.length) {
                isDeleting = true;
                delay = 1200;
            }

            // Khi đã xóa xong một cụm từ
            else if (isDeleting && characterIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 350;
            }

            window.setTimeout(typeEffect, delay);
        }

        typeEffect();
    }

    // ==============================
    // 5. HIỂN THỊ NĂM HIỆN TẠI
    // ==============================

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ==============================
    // 6. HIỆU ỨNG HIỆN DẦN KHI CUỘN
    // ==============================

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        // Hiển thị nội dung trên trình duyệt không hỗ trợ observer
        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });
    }

    // ==============================
    // 7. ĐÁNH DẤU MỤC MENU ĐANG XEM
    // ==============================

    const sections = document.querySelectorAll("main section[id]");
    const allNavLinks = document.querySelectorAll(".nav-link");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const currentId = entry.target.id;

                        allNavLinks.forEach(function (link) {
                            const isActive =
                                link.getAttribute("href") === "#" + currentId;

                            link.classList.toggle("active", isActive);
                        });
                    }
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px"
            }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    // ==============================
    // 8. FORM LIÊN HỆ
    // ==============================

    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const nameInput = document.getElementById("name");
            const visitorName = nameInput
                ? nameInput.value.trim()
                : "";

            formMessage.textContent =
                "Cảm ơn " + visitorName +
                "! Đây là bản demo nên lời nhắn chưa được gửi đi.";

            contactForm.reset();
        });
    }

});