// ==================================
// GAKI GROUP – Landing Page Script
// Made in Sénégal · 2026
// ==================================

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================
       NAVBAR – Scroll behavior & active link
    ============================== */
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateNavbar() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id], header[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        updateNavbar();
        updateActiveLink();
    }, { passive: true });

    updateNavbar();

    /* ==============================
       MOBILE MENU TOGGLE
    ============================== */
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    /* ==============================
       SMOOTH SCROLL
    ============================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ==============================
       SCROLL ANIMATIONS (IntersectionObserver)
    ============================== */
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animObserver.observe(el);
    });

    /* ==============================
       COUNTER ANIMATION
    ============================== */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = performance.now();
        const suffix = el.textContent.includes('+') ? '+' : '';

        function update(time) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(ease * target);
            el.textContent = current + (current >= target && suffix ? suffix : '');
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + suffix;
        }

        requestAnimationFrame(update);
    }

    // Add '+' suffix for eligible counters
    document.querySelectorAll('.counter').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if ([15, 100].includes(target)) {
            el.setAttribute('data-suffix', '+');
        }
    });

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 1800;
                const start = performance.now();

                function update(time) {
                    const elapsed = time - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.round(ease * target);
                    el.textContent = current + (current >= target && suffix ? suffix : '');
                    if (progress < 1) requestAnimationFrame(update);
                    else el.textContent = target + suffix;
                }

                requestAnimationFrame(update);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

    /* ==============================
       SCROLL TO TOP BUTTON
    ============================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==============================
       FORM ANIMATIONS & UX
    ============================== */
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });

    /* ==============================
       FORM SUBMIT FEEDBACK
    ============================== */
    const form = document.querySelector('form');
    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');

        const feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Merci ! Votre message a bien été envoyé.';
        feedback.style.cssText = `
            display:none;
            background: linear-gradient(135deg, #10B981, #059669);
            color: #fff;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            text-align: center;
            font-weight: 600;
            font-size: 0.9rem;
            margin-top: 1rem;
        `;
        form.appendChild(feedback);

        form.addEventListener('submit', (e) => {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...';

            feedback.style.display = 'block';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Envoyer le message';
                feedback.style.display = 'none';
            }, 5000);
        });
    }

    /* ==============================
       TYPEWRITER – Hero tagline
    ============================== */
    const tagline = document.getElementById('hero-tagline');
    if (tagline) {
        const originalText = tagline.textContent.trim();
        tagline.textContent = '';
        tagline.style.opacity = '0';
        tagline.style.animation = 'none';
        tagline.style.transform = 'translateY(0)';

        setTimeout(() => {
            tagline.style.transition = 'opacity 0.2s ease';
            tagline.style.opacity = '1';
            let i = 0;
            (function type() {
                if (i < originalText.length) {
                    tagline.textContent += originalText[i++];
                    setTimeout(type, 44);
                }
            })();
        }, 950);
    }

    /* ==============================
       PARALLAX HERO (subtle)
    ============================== */
    // Parallax désactivé (gradient background animé incompatible)

});
