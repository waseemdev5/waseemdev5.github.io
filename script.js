/* ================================================================
   script.js — SkillForge application logic
   ================================================================ */

(function () {
    'use strict';

    // ---------- COURSES DATA with images and descriptions ----------
    let courses = [
        {
            id: 1,
            title: 'Web Development (HTML, CSS, JS)',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=240&fit=crop',
            description: 'Build modern, responsive websites from scratch with HTML5, CSS3, and JavaScript.'
        },
        {
            id: 2,
            title: 'Digital Marketing Mastery',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop',
            description: 'Master SEO, social media marketing, Google Ads, and analytics strategies.'
        },
        {
            id: 3,
            title: 'Professional Video Editing',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=240&fit=crop',
            description: 'Learn to edit videos like a pro using Adobe Premiere Pro and DaVinci Resolve.'
        },
        {
            id: 4,
            title: 'WordPress Development',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=400&h=240&fit=crop',
            description: 'Create stunning websites with WordPress themes, plugins, and custom development.'
        },
        {
            id: 5,
            title: 'YouTube Automation',
            price: 11.99,
            image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=240&fit=crop',
            description: 'Grow your YouTube channel with automation tools, SEO, and content strategies.'
        },
        {
            id: 6,
            title: 'Generative AI Fundamentals',
            price: 11.99,
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop',
            description: 'Learn to build AI models that generate text, images, and creative content.'
        },
        {
            id: 7,
            title: 'Agentic AI Development',
            price: 11.99,
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=240&fit=crop',
            description: 'Build autonomous AI agents for real-world problem solving and automation.'
        },
        {
            id: 8,
            title: 'AI Automation for Business',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=240&fit=crop',
            description: 'Automate business processes and workflows using AI and machine learning.'
        }
    ];

    let orders = [
        { id: 101, courseTitle: 'Web Development (HTML, CSS, JS)', price: 49.99, customer: 'alex@mail.com', status: 'Pending' },
        { id: 102, courseTitle: 'Generative AI Fundamentals', price: 79.99, customer: 'jordan@work.com', status: 'Completed' }
    ];

    let nextCourseId = 9;
    let nextOrderId = 103;
    let editingCourseId = null;

    // ---------- DOM refs ----------
    const courseContainer = document.getElementById('courseContainer');
    const courseCount = document.getElementById('courseCount');
    const orderTableBody = document.getElementById('orderTableBody');
    const orderCount = document.getElementById('orderCount');
    const emptyOrders = document.getElementById('emptyOrders');
    const manageList = document.getElementById('manageCourseList');

    const adminDashboard = document.getElementById('adminDashboard');
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'), {
        backdrop: 'static',
        keyboard: false
    });
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');

    const courseForm = document.getElementById('courseForm');
    const titleInput = document.getElementById('courseTitle');
    const priceInput = document.getElementById('coursePrice');
    const imageInput = document.getElementById('courseImage');
    const descInput = document.getElementById('courseDesc');
    const submitBtn = document.getElementById('submitBtn');

    // ---------- RENDER: courses with Bootstrap cards ----------
    function renderCourses() {
        if (!courseContainer) return;

        if (courses.length === 0) {
            courseContainer.innerHTML =
                '<div class="col-12 text-center text-muted py-5">No courses available. Add one from the admin panel.</div>';
        } else {
            let html = '';
            courses.forEach((c) => {
                const imgSrc = c.image || 'https://placehold.co/400x240/2a6df4/ffffff?text=Course';
                html += `
                    <div class="col-md-6 col-lg-3">
                        <div class="course-card">
                            <img src="${imgSrc}" class="card-img-top" alt="${c.title}" loading="lazy" />
                            <div class="card-body">
                                <h5 class="card-title">${c.title}</h5>
                                <div class="course-price">$${c.price.toFixed(2)} <small>USD</small></div>
                                <p class="course-description">${c.description || 'Learn industry-ready skills.'}</p>
                                <button class="btn-buy" data-id="${c.id}" data-title="${c.title}" data-price="${c.price}">
                                    <i class="bi bi-cart-plus me-1"></i> Buy now
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            courseContainer.innerHTML = html;
        }

        courseCount.textContent = courses.length + ' courses';

        // attach buy listeners
        document.querySelectorAll('.btn-buy').forEach((btn) => {
            btn.addEventListener('click', function () {
                const title = this.dataset.title;
                const price = parseFloat(this.dataset.price);
                handleBuyNow(title, price);
            });
        });

        renderManageList();
    }

    // ---------- RENDER: orders ----------
    function renderOrders() {
        if (!orderTableBody) return;

        if (orders.length === 0) {
            orderTableBody.innerHTML = '';
            emptyOrders.style.display = 'block';
            orderCount.textContent = '0';
            return;
        }

        emptyOrders.style.display = 'none';
        let html = '';
        orders.forEach((o) => {
            html += `
                <tr>
                    <td><i class="bi bi-bookmark me-1" style="color:#2a6df4;"></i> ${o.courseTitle}</td>
                    <td>$${o.price.toFixed(2)}</td>
                    <td>${o.customer}</td>
                    <td><span class="badge bg-light text-dark border px-3 py-1 rounded-pill">${o.status}</span></td>
                </tr>
            `;
        });
        orderTableBody.innerHTML = html;
        orderCount.textContent = orders.length;
    }

    // ---------- RENDER: manage course list with edit/delete ----------
    function renderManageList() {
        if (!manageList) return;

        if (courses.length === 0) {
            manageList.innerHTML = '<p class="text-muted">No courses to manage.</p>';
            return;
        }

        let html = '<ul class="list-unstyled">';
        courses.forEach((c) => {
            html += `
                <li class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <span class="small">
                        <strong>${c.title}</strong> ($${c.price.toFixed(2)})
                    </span>
                    <div>
                        <button class="btn btn-outline-primary btn-sm btn-edit-sm edit-course" 
                                data-id="${c.id}" 
                                data-title="${c.title}" 
                                data-price="${c.price}" 
                                data-image="${c.image || ''}"
                                data-desc="${c.description || ''}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm btn-danger-sm delete-course" data-id="${c.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </li>
            `;
        });
        html += '</ul>';
        manageList.innerHTML = html;

        // Delete handlers
        document.querySelectorAll('.delete-course').forEach((btn) => {
            btn.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                if (confirm('Delete this course?')) {
                    courses = courses.filter((c) => c.id !== id);
                    renderCourses();
                    renderOrders();
                    renderManageList();
                    resetForm();
                }
            });
        });

        // Edit handlers
        document.querySelectorAll('.edit-course').forEach((btn) => {
            btn.addEventListener('click', function () {
                editingCourseId = parseInt(this.dataset.id);
                titleInput.value = this.dataset.title;
                priceInput.value = this.dataset.price;
                imageInput.value = this.dataset.image || '';
                descInput.value = this.dataset.desc || '';
                submitBtn.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Update Course';
                submitBtn.classList.add('btn-update');
                // Scroll to form
                courseForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    // ---------- RESET FORM ----------
    function resetForm() {
        editingCourseId = null;
        courseForm.reset();
        submitBtn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add course';
        submitBtn.classList.remove('btn-update');
    }

    // ---------- BUY NOW ----------
    function handleBuyNow(title, price) {
        const customer = prompt('Enter your email for order confirmation:', 'student@example.com');
        if (!customer) return;

        orders.push({
            id: nextOrderId++,
            courseTitle: title,
            price: price,
            customer: customer,
            status: 'Pending'
        });

        renderOrders();
        alert(`✅ Order placed for "${title}" ($${price.toFixed(2)}). Check admin dashboard.`);
    }

    // ---------- ADMIN: Add / Update Course ----------
    courseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = titleInput.value.trim();
        const price = parseFloat(priceInput.value);
        const image = imageInput.value.trim();
        const description = descInput.value.trim();

        if (!title || isNaN(price) || price <= 0) {
            alert('Please enter a valid title and price.');
            return;
        }

        if (editingCourseId) {
            // Update existing course
            const index = courses.findIndex(c => c.id === editingCourseId);
            if (index !== -1) {
                courses[index] = {
                    ...courses[index],
                    title: title,
                    price: price,
                    image: image || courses[index].image,
                    description: description || courses[index].description
                };
            }
            editingCourseId = null;
            submitBtn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Add course';
            submitBtn.classList.remove('btn-update');
        } else {
            // Add new course
            courses.push({
                id: nextCourseId++,
                title: title,
                price: price,
                image: image || 'https://placehold.co/400x240/2a6df4/ffffff?text=Course',
                description: description || 'Learn industry-ready skills.'
            });
        }

        renderCourses();
        renderOrders();
        courseForm.reset();
        imageInput.value = '';
    });

    // ---------- AUTH: Login ----------
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        if (user === 'admin' && pass === 'hattar1234') {
            loginModal.hide();
            adminDashboard.style.display = 'block';

            // Hide only navbar (courses stay visible)
            document.querySelector('.navbar').style.display = 'none';

            renderOrders();
            renderManageList();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert('Invalid credentials. Use admin / hattar1234');
        }
    });

    // ---------- AUTH: Logout ----------
    logoutBtn.addEventListener('click', function () {
        adminDashboard.style.display = 'none';

        // Show navbar again
        document.querySelector('.navbar').style.display = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- Dashboard Button (Hidden but accessible via console) ----------
    // adminLoginBtn is removed from navbar, but we keep the event listener for secret access

    // ---------- INIT ----------
    renderCourses();
    renderOrders();
    renderManageList();

    // Ensure dashboard is hidden on page load
    adminDashboard.style.display = 'none';

})();
// ---------- AUTO-LOGIN WITH #admin URL ----------
(function autoAdmin() {
    // Check if URL has #admin
    if (window.location.hash === '#admin') {
        // Wait for page to load
        setTimeout(function() {
            // Auto-fill and submit login
            document.getElementById('loginUser').value = 'admin';
            document.getElementById('loginPass').value = 'hattar1234';
            
            // Trigger login
            var form = document.getElementById('loginForm');
            var event = new Event('submit', { bubbles: true });
            form.dispatchEvent(event);
        }, 1000);
    }
})();
