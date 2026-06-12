// assets/js/main.js

document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // PHẦN 1: LOGIC TRANG DANH SÁCH (COURSES.HTML)
    // ==========================================
    const coursesContainer = document.getElementById("courses-container");
    if (coursesContainer) {
        const searchInput = document.getElementById("search-input");
        const categoryFilter = document.getElementById("category-filter");
        const levelFilter = document.getElementById("level-filter");
        const btnReset = document.getElementById("btn-reset");

        function renderCourses(data) {
            coursesContainer.innerHTML = "";
            if (data.length === 0) {
                coursesContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">Không có kết quả tìm kiếm trùng khớp.</div>`;
                return;
            }

            data.forEach(item => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <img src="${item.image}" class="card-img" alt="${item.title}">
                    <div class="card-body">
                        <div class="badge-group">
                            <span class="badge badge-cat">${item.category}</span>
                            <span class="badge badge-lvl">${item.level}</span>
                        </div>
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-text">${item.description}</p>
                        <p class="card-date">Khai giảng: ${item.date}</p>
                        <div class="card-actions">
                            <button class="btn btn-outline btn-detail" data-id="${item.id}">Chi tiết</button>
                            <button class="btn btn-primary btn-reg" data-title="${item.title}">Đăng ký</button>
                        </div>
                    </div>
                `;
                coursesContainer.appendChild(card);
            });

            // Gán sự kiện xem chi tiết (Mở Modal)
            document.querySelectorAll(".btn-detail").forEach(btn => {
                btn.addEventListener("click", function() {
                    const id = parseInt(this.getAttribute("data-id"));
                    openModal(id);
                });
            });

            // Gán sự kiện nút Đăng ký nhanh
            document.querySelectorAll(".btn-reg").forEach(btn => {
                btn.addEventListener("click", function() {
                    const title = this.getAttribute("data-title");
                    localStorage.setItem("selected_course", title);
                    window.location.href = "register.html";
                });
            });
        }

        function handleFilter() {
            const searchValue = searchInput.value.toLowerCase().trim();
            const catValue = categoryFilter.value;
            const lvlValue = levelFilter.value;

            const filtered = courses.filter(course => {
                const matchSearch = course.title.toLowerCase().includes(searchValue);
                const matchCat = catValue === "" || course.category === catValue;
                const matchLvl = lvlValue === "" || course.level === lvlValue;
                return matchSearch && matchCat && matchLvl;
            });
            renderCourses(filtered);
        }

        searchInput.addEventListener("input", handleFilter);
        categoryFilter.addEventListener("change", handleFilter);
        levelFilter.addEventListener("change", handleFilter);

        btnReset.addEventListener("click", function() {
            searchInput.value = "";
            categoryFilter.value = "";
            levelFilter.value = "";
            renderCourses(courses);
        });

        renderCourses(courses);
    }

    // ==========================================
    // PHẦN 2: LOGIC MODAL CHI TIẾT
    // ==========================================
    const modal = document.getElementById("detailModal");
    if (modal) {
        const closeBtn = document.getElementById("modal-close-btn");
        const cancelBtn = document.getElementById("modal-cancel-btn");
        const modalRegBtn = document.getElementById("modal-register-btn");

        window.openModal = function(id) {
            const target = courses.find(c => c.id === id);
            if (!target) return;

            document.getElementById("modal-title").innerText = target.title;
            document.getElementById("modal-img").src = target.image;
            document.getElementById("modal-category").innerText = target.category;
            document.getElementById("modal-level").innerText = target.level;
            document.getElementById("modal-date").innerText = target.date;
            document.getElementById("modal-description").innerText = target.description;
            document.getElementById("modal-detail").innerText = target.detail;

            modalRegBtn.onclick = function() {
                localStorage.setItem("selected_course", target.title);
            };

            modal.classList.add("active");
        };

        function closeModal() { modal.classList.remove("active"); }

        closeBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);
        modal.addEventListener("click", function(e) {
            if (e.target === modal) closeModal();
        });
    }

    // ==========================================
    // PHẦN 3: FORM VALIDATION (REGISTER.HTML)
    // ==========================================
    const regForm = document.getElementById("registration-form");
    if (regForm) {
        const selectBox = document.getElementById("course-select");

        courses.forEach(c => {
            const option = document.createElement("option");
            option.value = c.title;
            option.innerText = c.title;
            selectBox.appendChild(option);
        });

        const savedCourse = localStorage.getItem("selected_course");
        if (savedCourse) {
            selectBox.value = savedCourse;
            localStorage.removeItem("selected_course");
        }

        regForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const fullname = document.getElementById("fullname");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            const studentClass = document.getElementById("student-class");
            const courseSelect = document.getElementById("course-select");
            const notes = document.getElementById("notes");

            let isFormValid = true;

            // Kiểm tra Họ tên >= 3 ký tự
            if (fullname.value.trim().length < 3) {
                fullname.classList.add("is-invalid");
                document.getElementById("error-fullname").style.display = "block";
                isFormValid = false;
            } else {
                fullname.classList.remove("is-invalid");
                document.getElementById("error-fullname").style.display = "none";
            }

            // Kiểm tra Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.classList.add("is-invalid");
                document.getElementById("error-email").style.display = "block";
                isFormValid = false;
            } else {
                email.classList.remove("is-invalid");
                document.getElementById("error-email").style.display = "none";
            }

            // Kiểm tra Số điện thoại (9 - 11 ký tự số)
            const phoneRegex = /^[0-9]{9,11}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                phone.classList.add("is-invalid");
                document.getElementById("error-phone").style.display = "block";
                isFormValid = false;
            } else {
                phone.classList.remove("is-invalid");
                document.getElementById("error-phone").style.display = "none";
            }

            // Kiểm tra Lớp học
            if (studentClass.value.trim() === "") {
                studentClass.classList.add("is-invalid");
                document.getElementById("error-class").style.display = "block";
                isFormValid = false;
            } else {
                studentClass.classList.remove("is-invalid");
                document.getElementById("error-class").style.display = "none";
            }

            // Kiểm tra Khóa học đã chọn chưa
            if (courseSelect.value === "") {
                courseSelect.classList.add("is-invalid");
                document.getElementById("error-course").style.display = "block";
                isFormValid = false;
            } else {
                courseSelect.classList.remove("is-invalid");
                document.getElementById("error-course").style.display = "none";
            }

            if (isFormValid) {
                let currentRecords = JSON.parse(localStorage.getItem("db_registrations")) || [];
                const record = {
                    id: Date.now(),
                    name: fullname.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    class: studentClass.value.trim(),
                    course: courseSelect.value,
                    notes: notes.value.trim()
                };

                currentRecords.push(record);
                localStorage.setItem("db_registrations", JSON.stringify(currentRecords));

                document.getElementById("success-alert").style.display = "block";
                regForm.reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // ==========================================
    // PHẦN 4: QUẢN TRỊ DỮ LIỆU (REGISTRATIONS.HTML)
    // ==========================================
    const tableBody = document.getElementById("registrations-table-body");
    if (tableBody) {
        const btnDeleteAll = document.getElementById("btn-delete-all");
        const emptyMessage = document.getElementById("empty-message");

        function loadTableData() {
            let records = JSON.parse(localStorage.getItem("db_registrations")) || [];
            tableBody.innerHTML = "";

            if (records.length === 0) {
                emptyMessage.style.display = "block";
                btnDeleteAll.style.display = "none";
                return;
            }

            emptyMessage.style.display = "none";
            btnDeleteAll.style.display = "inline-block";

            records.forEach((row, idx) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td style="font-weight: bold; color: var(--dark-color);">${row.name}</td>
                    <td>${row.class}</td>
                    <td>${row.phone}</td>
                    <td>${row.course}</td>
                    <td style="font-size:0.85rem; color:#64748b;">${row.notes || "-"}</td>
                    <td><button class="btn btn-danger delete-row-btn" data-id="${row.id}" style="padding: 5px 10px; font-size: 0.8rem;">Xóa</button></td>
                `;
                tableBody.appendChild(tr);
            });

            document.querySelectorAll(".delete-row-btn").forEach(btn => {
                btn.addEventListener("click", function() {
                    const targetId = parseInt(this.getAttribute("data-id"));
                    if (confirm("Xác nhận xóa bản ghi thông tin đăng ký này?")) {
                        let records = JSON.parse(localStorage.getItem("db_registrations")) || [];
                        records = records.filter(r => r.id !== targetId);
                        localStorage.setItem("db_registrations", JSON.stringify(records));
                        loadTableData();
                    }
                });
            });
        }

        btnDeleteAll.addEventListener("click", function() {
            if (confirm("CẢNH BÁO: Thao tác này sẽ xóa sạch TOÀN BỘ danh sách học viên! Tiến hành?")) {
                localStorage.removeItem("db_registrations");
                loadTableData();
            }
        });

        loadTableData();
    }
});