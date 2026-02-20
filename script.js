/* ========================================
   Portfolio JavaScript - Ahmad Yahya N.
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initTypingEffect();
    initScrollReveal();
    initCounterAnimation();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    initCarousel();
    initI18n();
    initCertPreview();
});

/* ========================================
   Particle Background (Canvas)
   ======================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    // Skip particles on mobile — address bar resize causes flicker/zoom effect
    if (window.innerWidth <= 768) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        // Use screen.height on mobile to avoid resize on address bar toggle
        canvas.height = window.innerHeight;
    }

    resize();
    // Only re-run resize on orientation change (not every scroll/resize on mobile)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) resize();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 186 : 270; // Cyan or Violet
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x -= (dx / dist) * force * 0.8;
                    this.y -= (dy / dist) * force * 0.8;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `hsla(200, 70%, 50%, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link on scroll
        updateActiveLink();
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ========================================
   Typing Effect
   ======================================== */
function initTypingEffect() {
    const element = document.getElementById('typing-text');
    if (!element) return;

    const texts = [
        'Backend Developer',
        'Software Engineer',
        'IT Researcher',
        'Mobile Developer',
        'Problem Solver'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

/* ========================================
   Scroll Reveal
   ======================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ========================================
   Counter Animation
   ======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);

        function update() {
            current += step;
            if (current >= target) {
                element.textContent = target;
                return;
            }
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }

        update();
    }
}

/* ========================================
   Project Filters
   ======================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');

                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ========================================
   Contact Form
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Change button state to sending
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success state
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                form.reset();
            } else {
                // Server error state
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error Sending';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
            }
        } catch (error) {
            // Network error state
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Network Error';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
        }

        // Reset button after delay
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    });
}

/* ========================================
   Back to Top
   ======================================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========================================
   Image Carousel
   ======================================== */
function initCarousel() {
    document.querySelectorAll('.carousel-container').forEach(container => {
        const slides = container.querySelectorAll('.carousel-slide');
        const dots = container.querySelectorAll('.carousel-dot');
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');
        let current = 0;
        let autoPlayTimer;

        function goTo(index) {
            slides[current].classList.remove('active');
            dots[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current].classList.add('active');
        }

        function startAutoPlay() {
            autoPlayTimer = setInterval(() => goTo(current + 1), 4000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(current - 1);
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(current + 1);
                resetAutoPlay();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goTo(parseInt(dot.dataset.index));
                resetAutoPlay();
            });
        });

        // Touch/swipe support
        let touchStartX = 0;
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goTo(current + 1);
                else goTo(current - 1);
                resetAutoPlay();
            }
        }, { passive: true });

        startAutoPlay();
    });
}

/* ========================================
   Internationalization (i18n)
   ======================================== */
function initI18n() {
    const translations = {
        en: {
            hero_badge: 'Available for opportunities',
            hero_greeting: "Hi, I'm",
            hero_typing_prefix: "I'm a ",
            hero_desc: 'Experienced programmer in software development and backend security. Active in academic research as well as web, mobile, and desktop application development with the latest technologies.',
            btn_work: 'View My Work',
            btn_contact: 'Get In Touch',
            btn_wa: 'WhatsApp',
            stat_projects: 'Projects',
            stat_tech: 'Technologies',
            stat_pubs: 'Publications',
            scroll_down: 'Scroll Down',
            about_title: 'About <span class="gradient-text">Me</span>',
            about_subtitle: 'Get to know the person behind the code',
            about_heading: 'Programmer & IT Researcher',
            about_text1: 'I am <strong>Ahmad Yahya Nashikhuddin</strong>, an Information Technology professional from Indonesia, currently based in <strong>Madiun Regency</strong>. I work as a programmer at <strong>Universitas Muhammadiyah Ponorogo (UMPO)</strong>, specifically in the <strong>Information System Development Institute (LPSI)</strong> division.',
            about_text2: 'Active in academic research and registered on <strong>SINTA</strong> (Science and Technology Index). My research focus includes backend security and JWT implementation for authentication and authorization in RESTful API-based e-commerce applications.',
            btn_cv: 'Download CV',
            skills_subtitle: 'Technologies and tools I work with',
            projects_title: 'Featured <span class="gradient-text">Projects</span>',
            projects_subtitle: "Some things I've built along the way",
            giat_desc: 'Information management system for Community Service Program (KKN) at Universitas Muhammadiyah Ponorogo. Includes LPPM dashboard, period management, student registration, lecturer group management, and integrated KKN activity monitoring.',
            std_desc: 'A data bridge system that integrates the campus Datasim (Student Information System Data) with the PDDIKTI Feeder in real-time. Facilitates synchronization of student biodata, academic activities, and higher education data reporting to the national database efficiently and accurately.',
            suara_desc: 'A SERVQUAL-based digital survey platform designed specifically for higher education environments. Supports the creation and management of over 30 types of surveys, ranging from academic service satisfaction evaluations, lecturer performance assessments, to stakeholder feedback — all within a single integrated dashboard with real-time analytics.',
            simft_desc: 'Faculty of Engineering Information System (SIMFT) dedicated to facilitating the faculty accreditation process. Centrally manages lecturer data, student records, and academic documents to support accreditation assessment standards.',
            coming_soon_title: 'More Projects Coming Soon',
            coming_soon_desc: 'Other projects are currently being documented and will be added soon. Stay tuned!',
            exp_title: 'Education & <span class="gradient-text">Experience</span>',
            exp_subtitle: 'My academic and professional journey',
            exp_umpo_desc: 'Developing and maintaining backend systems, implementing RESTful APIs, and contributing to software development projects within the university environment.',
            exp_aws_desc: 'AWS x Dicoding scholarship program for backend development with AWS cloud technology. Learned cloud architecture, deployment, and building scalable RESTful APIs on the AWS environment.',
            exp_dbs_desc: 'Technology training program by DBS Foundation in collaboration with Dicoding Indonesia. Developing competencies in full-stack web application development with industry-standard curriculum.',
            exp_smkdev_desc: 'Learned Go programming language especially for backend development.',
            exp_s1_desc: 'Studied computer science, programming, algorithms, system security, and software development. Active in research projects and application development.',
            exp_researcher_desc: 'Publication: "Implementation of JWT for Authentication and Authorization of E-Commerce Applications". RESTful API security research published as a scientific journal. Registered as a researcher on SINTA.',
            exp_binar_desc: 'Deepened backend knowledge at Binar Academy through the Kampus Merdeka program.',
            contact_title: 'Get In <span class="gradient-text">Touch</span>',
            contact_subtitle: "Let's build something amazing together",
            contact_heading: "Let's Talk!",
            contact_text: 'Interested in collaborating or have a project to discuss? Feel free to reach out to me. I am always open to new opportunities and ideas.',
            form_name: 'Your Name',
            form_email: 'Your Email',
            form_subject: 'Subject',
            form_message: 'Your Message',
            btn_send: 'Send Message',
            cert_title: 'My <span class="gradient-text">Certificates</span>',
            cert_subtitle: 'Trainings, courses, and recognitions I\'ve earned',
            cert_group_kompetesi: 'Competency Certificates',
            cert_group_webinar: 'Webinar & Workshop'
        },
        id: {
            hero_badge: 'Terbuka untuk peluang baru',
            hero_greeting: 'Hai, Saya',
            hero_typing_prefix: 'Saya seorang ',
            hero_desc: 'Programmer berpengalaman di bidang pengembangan perangkat lunak dan keamanan backend. Aktif dalam riset akademik serta pengembangan aplikasi web, mobile, dan desktop dengan teknologi terkini.',
            btn_work: 'Lihat Proyek',
            btn_contact: 'Hubungi Saya',
            btn_wa: 'WhatsApp',
            stat_projects: 'Proyek',
            stat_tech: 'Teknologi',
            stat_pubs: 'Publikasi',
            scroll_down: 'Gulir ke Bawah',
            about_title: 'Tentang <span class="gradient-text">Saya</span>',
            about_subtitle: 'Kenali lebih dekat orang di balik kode',
            about_heading: 'Programmer & Peneliti IT',
            about_text1: 'Saya <strong>Ahmad Yahya Nashikhuddin</strong>, seorang professional Teknologi Informasi asal Indonesia, lebih tepatnya saat ini berdomisili di <strong>Kabupaten Madiun</strong>. Saya bekerja sebagai programmer di lingkungan <strong>Universitas Muhammadiyah Ponorogo (UMPO)</strong>, khususnya pada divisi <strong>Lembaga Pengembangan Sistem Informasi (LPSI)</strong>.',
            about_text2: 'Aktif dalam penelitian akademik dan terdaftar di <strong>SINTA</strong> (Science and Technology Index). Fokus riset saya meliputi keamanan backend dan implementasi JWT untuk otentikasi dan otorisasi pada aplikasi e-commerce berbasis API RESTful.',
            btn_cv: 'Unduh CV',
            skills_subtitle: 'Teknologi dan alat yang saya gunakan',
            projects_title: 'Proyek <span class="gradient-text">Unggulan</span>',
            projects_subtitle: 'Beberapa hal yang telah saya bangun',
            giat_desc: 'Sistem informasi manajemen Kuliah Kerja Nyata (KKN) untuk Universitas Muhammadiyah Ponorogo. Mencakup dashboard LPPM, manajemen periode, pendaftaran mahasiswa, pengelolaan kelompok dosen, dan monitoring kegiatan KKN secara terintegrasi.',
            std_desc: 'Sistem jembatan data yang mengintegrasikan Datasim (Data Sistem Informasi Mahasiswa) kampus dengan Feeder PDDIKTI secara real-time. Memfasilitasi sinkronisasi biodata mahasiswa, aktivitas akademik, dan pelaporan data perguruan tinggi ke pangkalan data nasional secara efisien dan akurat.',
            suara_desc: 'Platform survei digital berbasis metode SERVQUAL yang dirancang khusus untuk lingkungan perguruan tinggi. Mendukung pembuatan dan pengelolaan lebih dari 30 jenis survei, mulai dari evaluasi kepuasan layanan akademik, kinerja dosen, hingga umpan balik stakeholder — semuanya dalam satu dashboard terintegrasi dengan analitik real-time.',
            simft_desc: 'Sistem informasi yang dirancang khusus untuk Fakultas Teknik guna memfasilitasi proses akreditasi. Mengelola data dosen, mahasiswa, penelitian, dan pengabdian masyarakat secara terpusat untuk mendukung penyusunan borang dan pemenuhan standar penilaian akreditasi.',
            coming_soon_title: 'Proyek Lainnya Segera Hadir',
            coming_soon_desc: 'Proyek-proyek lainnya sedang dalam proses dokumentasi dan akan segera ditambahkan. Nantikan!',
            exp_title: 'Pendidikan & <span class="gradient-text">Pengalaman</span>',
            exp_subtitle: 'Perjalanan akademik dan profesional saya',
            exp_umpo_desc: 'Mengembangkan dan memelihara sistem backend, implementasi API RESTful, serta berkontribusi dalam proyek pengembangan perangkat lunak di lingkungan universitas.',
            exp_aws_desc: 'Program beasiswa AWS x Dicoding untuk pengembangan backend dengan teknologi cloud AWS. Mempelajari arsitektur cloud, deployment, serta membangun RESTful API yang scalable di lingkungan AWS.',
            exp_dbs_desc: 'Program pelatihan teknologi oleh DBS Foundation bekerja sama dengan Dicoding Indonesia. Mengembangkan kompetensi dalam pengembangan aplikasi web full-stack dengan kurikulum standar industri.',
            exp_smkdev_desc: 'Mempelajari bahasa GO terutama pada backend.',
            exp_s1_desc: 'Mendalami ilmu komputer, pemrograman, algoritma, keamanan sistem, dan pengembangan perangkat lunak. Aktif dalam proyek penelitian dan pengembangan aplikasi.',
            exp_researcher_desc: 'Publikasi: "Implementasi JWT untuk Otentikasi dan Otorisasi Aplikasi E-Commerce". Riset keamanan API RESTful yang dipublikasikan sebagai jurnal ilmiah. Terdaftar sebagai peneliti di SINTA.',
            exp_binar_desc: 'Mendalami ilmu backend pada Binar Academy melalui program Kampus Merdeka.',
            contact_title: 'Hubungi <span class="gradient-text">Saya</span>',
            contact_subtitle: 'Mari membangun sesuatu yang luar biasa bersama',
            contact_heading: 'Ayo Ngobrol!',
            contact_text: 'Tertarik untuk berkolaborasi atau memiliki proyek yang ingin didiskusikan? Jangan ragu untuk menghubungi saya. Saya selalu terbuka untuk peluang dan ide baru.',
            form_name: 'Nama Anda',
            form_email: 'Email Anda',
            form_subject: 'Subjek',
            form_message: 'Pesan Anda',
            btn_send: 'Kirim Pesan',
            cert_title: 'Sertifikat <span class="gradient-text">Saya</span>',
            cert_subtitle: 'Pelatihan, kursus, dan penghargaan yang telah saya raih',
            cert_group_kompetesi: 'Sertifikat Kompetensi',
            cert_group_webinar: 'Webinar & Workshop'
        }
    };

    const langBtns = document.querySelectorAll('.lang-btn');
    if (langBtns.length === 0) return;

    let currentLang = localStorage.getItem('portfolio-lang') || 'id';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio-lang', lang);
        document.documentElement.lang = lang;

        // Update buttons
        langBtns.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Apply translations
        const t = translations[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key] !== undefined) {
                el.innerHTML = t[key];
            }
        });
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // Apply saved language on load
    setLanguage(currentLang);
}

/* ========================================
   Certificate PDF Preview Modal
   ======================================== */
function initCertPreview() {
    const modal = document.getElementById('pdf-modal');
    const frame = document.getElementById('pdf-modal-frame');
    const title = document.getElementById('pdf-modal-title');
    const openBtn = document.getElementById('pdf-modal-open');
    const closeBtn = document.getElementById('pdf-modal-close');
    const backdrop = document.getElementById('pdf-modal-backdrop');

    if (!modal) return;

    function openModal(url, name) {
        frame.src = url;
        title.textContent = name;
        openBtn.href = url;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Delay clearing src so closing animation is smooth
        setTimeout(() => { frame.src = ''; }, 350);
    }

    // Intercept all cert-card clicks
    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            const url = card.getAttribute('href');
            const name = card.querySelector('.cert-name')?.textContent || 'Certificate';
            openModal(url, name);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
