// ==================================
// GAKI CONNECT – Page Script
// Sous-menu sticky + Carte + Éligibilité
// ==================================

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================
       SUBNAV – Active link on scroll
    ============================== */
    const subnavLinks = document.querySelectorAll('.connect-subnav-link');
    const sections = ['vision', 'nexuswave', 'souverainete', 'roadmap', 'impact', 'comparison', 'faq', 'institution'];
    const navbar = document.getElementById('navbar');
    const subnav = document.getElementById('connectSubnav');

    function getSubnavHeight() {
        return subnav ? subnav.offsetHeight : 52;
    }

    function updateSubnavActive() {
        const offset = (navbar ? navbar.offsetHeight : 76) + getSubnavHeight() + 20;
        let current = sections[0];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (window.scrollY >= el.offsetTop - offset) {
                current = id;
            }
        });

        subnavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateSubnavActive, { passive: true });
    updateSubnavActive();

    /* ==============================
       SUBNAV – Smooth scroll with offset
    ============================== */
    subnavLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;
            const navH = navbar ? navbar.offsetHeight : 76;
            const subH = getSubnavHeight();
            const top = target.getBoundingClientRect().top + window.pageYOffset - navH - subH - 8;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ==============================
       ANIMATE-ON-SCROLL
    ============================== */
    const animObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animObserver.observe(el);
    });

    /* ==============================
       DASHBOARD BAR ANIMATION
    ============================== */
    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.ndp-bar-fill');
                fills.forEach(fill => {
                    fill.style.animation = 'none';
                    void fill.offsetWidth; // reflow
                    fill.style.animation = '';
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const dashboard = document.querySelector('.nexus-dashboard');
    if (dashboard) barObserver.observe(dashboard);

    /* ==============================
       SENEGAL MAP – .map-active trigger
    ============================== */
    const mapSvg = document.getElementById('senegalMap');
    if (mapSvg) {
        const mapObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mapSvg.classList.add('map-active');
                    mapObserver.unobserve(mapSvg);
                }
            });
        }, { threshold: 0.25 });
        mapObserver.observe(mapSvg);
    }

    /* ==============================
       SCROLL TO TOP
    ============================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});

/* ==============================
   FAQ TOGGLE
============================== */
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    // Close all open items
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    // Open clicked one if it wasn't already open
    if (!wasOpen) item.classList.add('open');
}

/* ==============================
   ELIGIBILITY CHECKER
============================== */
function checkEligibility() {
    const select = document.getElementById('eligZone');
    const result = document.getElementById('eligResult');
    if (!select || !result) return;

    const zone = select.value;

    if (!zone) {
        result.className = 'elig-result show unavailable';
        result.innerHTML = '<i class="fas fa-info-circle"></i> Veuillez sélectionner votre région.';
        return;
    }

    const covered = ['dakar', 'thies', 'sl', 'maritime'];
    const soon    = ['matam', 'tamb', 'zig', 'kedougou'];

    if (covered.includes(zone)) {
        result.className = 'elig-result show';
        const zoneNames = {
            dakar: 'Dakar & Grand Dakar',
            thies: 'Thiès & Mbour',
            sl: 'Saint-Louis & Louga',
            maritime: 'Zone Maritime / Flotte Nationale'
        };
        result.innerHTML = `<i class="fas fa-check-circle"></i>&nbsp; <span><strong>${zoneNames[zone]}</strong> — Zone prioritaire GAKI Connect. Contactez-nous pour initier le déploiement dans votre secteur.</span>`;
    } else if (soon.includes(zone)) {
        result.className = 'elig-result show unavailable';
        const zoneNames = {
            matam: 'Matam & Kaffrine',
            tamb: 'Tambacounda & Kolda',
            zig: 'Ziguinchor (Casamance)',
            kedougou: 'Kédougou & Sédhiou',
            rural: 'Zone Rurale / Isolée'
        };
        result.innerHTML = `<i class="fas fa-satellite"></i>&nbsp; <span><strong>${zoneNames[zone] || 'Cette zone'}</strong> — Déploiement planifié en phase 2. Inscrivez-vous pour être informé en priorité.</span>`;
    } else {
        result.className = 'elig-result show unavailable';
        result.innerHTML = '<i class="fas fa-satellite"></i>&nbsp; <span>Zone en cours d\'évaluation. Contactez-nous pour une étude personnalisée.</span>';
    }
}
