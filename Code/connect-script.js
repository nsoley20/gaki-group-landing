// ==================================
// GAKI CONNECT – Page Script
// Subnav · Animations · Formulaire B2B
// ==================================

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================
       SUBNAV – Active link on scroll
    ============================== */
    const subnavLinks = document.querySelectorAll('.connect-subnav-link');
    const sections    = ['vision', 'nexuswave', 'souverainete', 'roadmap', 'comparison', 'faq', 'institution'];
    const navbar      = document.getElementById('navbar');
    const subnav      = document.getElementById('connectSubnav');

    function getSubnavHeight() {
        return subnav ? subnav.offsetHeight : 52;
    }

    function updateSubnavActive() {
        const offset  = (navbar ? navbar.offsetHeight : 76) + getSubnavHeight() + 20;
        let   current = sections[0];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (window.scrollY >= el.offsetTop - offset) current = id;
        });

        subnavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) link.classList.add('active');
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
            const top  = target.getBoundingClientRect().top + window.pageYOffset - navH - subH - 8;
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

    document.querySelectorAll('.animate-on-scroll').forEach(el => animObserver.observe(el));

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

    /* ==============================
       FORMULAIRE B2B – Soumission
    ============================== */
    const form       = document.getElementById('b2bForm');
    const submitBtn  = document.getElementById('b2bSubmitBtn');
    const btnIcon    = document.getElementById('b2bBtnIcon');
    const btnText    = document.getElementById('b2bBtnText');
    const formMsg    = document.getElementById('b2bFormMsg');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            handleB2BSubmit();
        });
    }

    function setLoading(state) {
        submitBtn.disabled = state;
        if (state) {
            btnIcon.className = 'fas fa-spinner fa-spin';
            btnText.textContent = 'Envoi en cours…';
        } else {
            btnIcon.className = 'fas fa-paper-plane';
            btnText.textContent = 'Envoyer ma Demande';
        }
    }

    function showMsg(type, html) {
        formMsg.className  = 'cf-form-msg ' + type;
        formMsg.innerHTML  = html;
        formMsg.style.display = 'flex';
        formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function validateForm() {
        const name    = document.getElementById('cf-name').value.trim();
        const org     = document.getElementById('cf-org').value.trim();
        const email   = document.getElementById('cf-email').value.trim();
        const sector  = document.getElementById('cf-sector').value;
        const need    = document.getElementById('cf-need').value.trim();
        const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name)           return 'Veuillez indiquer votre nom et prénom.';
        if (!org)            return 'Veuillez indiquer votre organisation.';
        if (!email)          return 'Veuillez renseigner votre adresse email.';
        if (!emailRE.test(email)) return 'Adresse email invalide.';
        if (!sector)         return 'Veuillez sélectionner votre secteur d\'activité.';
        if (!need)           return 'Veuillez décrire votre besoin en connectivité.';
        return null;
    }

    function handleB2BSubmit() {
        formMsg.style.display = 'none';

        const err = validateForm();
        if (err) {
            showMsg('error', '<i class="fas fa-exclamation-circle"></i> ' + err);
            return;
        }

        const name   = document.getElementById('cf-name').value.trim();
        const org    = document.getElementById('cf-org').value.trim();
        const email  = document.getElementById('cf-email').value.trim();
        const phone  = document.getElementById('cf-phone').value.trim();
        const sector = document.getElementById('cf-sector').value;
        const need   = document.getElementById('cf-need').value.trim();

        setLoading(true);

        // Construction du mailto avec toutes les données
        const subject = encodeURIComponent('[GAKI Connect] Demande d\'étude technique – ' + org);
        const body    = encodeURIComponent(
            'NOM & PRÉNOM : ' + name + '\n' +
            'ORGANISATION : ' + org + '\n' +
            'EMAIL         : ' + email + '\n' +
            (phone ? 'TÉLÉPHONE     : ' + phone + '\n' : '') +
            'SECTEUR       : ' + sector + '\n\n' +
            'BESOIN EN CONNECTIVITÉ :\n' + need + '\n\n' +
            '---\nDemande envoyée depuis gaki-connect.html'
        );

        const mailto = 'mailto:gakigroup@outlook.com?subject=' + subject + '&body=' + body;

        // Délai court pour que l'état loading soit perceptible
        setTimeout(() => {
            setLoading(false);
            window.location.href = mailto;
            showMsg(
                'success',
                '<i class="fas fa-check-circle"></i> ' +
                'Votre client de messagerie va s\'ouvrir avec les informations pré-remplies. ' +
                'Envoyez l\'email pour finaliser votre demande — notre équipe répondra sous 48h.'
            );
        }, 600);
    }

});

/* ==============================
   FAQ TOGGLE
============================== */
function toggleFaq(btn) {
    const item    = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}
