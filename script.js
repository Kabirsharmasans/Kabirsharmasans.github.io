// ====== MAIN APP ======
document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader control ---
    const preloader = document.getElementById('preloader');
    function hidePreloader() {
        preloader?.classList.add('hidden');
        // ensure removal after transition for accessibility
        setTimeout(() => preloader && (preloader.style.display = 'none'), 450);
    }

    // safety fallback if anything stalls
    const preloadTimeout = setTimeout(hidePreloader, 3500);

    // --- Initialize Particles.js (background) ---
    window.initParticles = function() {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
                opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
            },
            retina_detect: true
        });
    };
    
    window.initParticles();

    // Try hiding loader shortly after particles init + hero animation kickoff
    // Small delay to avoid flash
    setTimeout(() => {
        hidePreloader();
        clearTimeout(preloadTimeout);
    }, 600);

    // custom cursor removed

    // --- GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Lightweight KS logo animation: split into letters, reveal on load, subtle glitch on hover/click
    (function setupKsLogo() {
        const ksLogo = document.getElementById('ks-logo');
        if (!ksLogo) return;

        const text = ksLogo.textContent.trim();
        // create span-per-letter for a lightweight reveal
        ksLogo.innerHTML = text.split('').map(ch => `<span class="ks-letter">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');

        // reveal animation using GSAP (short, lightweight)
        if (window.gsap) {
            gsap.fromTo('#ks-logo .ks-letter',
                { opacity: 0, y: 10, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.45, ease: 'power2.out' }
            );
        }

        // small hover glitch: add class briefly to trigger CSS keyframes
        ksLogo.addEventListener('mouseenter', () => {
            ksLogo.classList.add('ks-glitch');
            setTimeout(() => ksLogo.classList.remove('ks-glitch'), 300);
        });

        // click: quick punch animation
        ksLogo.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.gsap) {
                gsap.fromTo('#ks-logo .ks-letter', { y: 0, rotation: 0 }, { y: -6, rotation: -6, duration: 0.12, yoyo: true, repeat: 1, stagger: 0.01, ease: 'power1.out' });
            }
        });
    })();

    // Hero Text Animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    heroTitle.innerHTML = 'Crafting Digital Experiences'.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
    heroSubtitle.innerHTML = 'Kabir Sharma - A freelance developer and designer from Delhi, building beautiful and functional websites.'.split(' ').map(word => `<span>${word}&nbsp;</span>`).join('');

    const tl = gsap.timeline();
    tl.to('.hero-title span', { opacity: 1, y: 0, stagger: 0.05, duration: 1, ease: 'power3.out' })
      .to('.hero-subtitle span', { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out' }, "-=0.8");

    // Section Title Reveals
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title, 
            { opacity: 0, y: 50 }, 
            { 
                opacity: 1, y: 0, duration: 1, 
                scrollTrigger: { trigger: title, start: 'top 85%', end: 'bottom 20%', toggleActions: 'play none none reverse' }
            }
        );
    });

    // Smart Header Hide/Show on Scroll
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const header = document.getElementById('header');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            // Scrolling down & past threshold - hide header
            header.classList.add('header-hidden');
        } else {
            // Scrolling up or at top - show header
            header.classList.remove('header-hidden');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    function requestHeaderUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });

    // Horizontal Scroll for Work Section
    const workTrack = document.querySelector('.work-track');
    const workContainer = document.querySelector('#work-container');

    if (workTrack && workContainer && workTrack.children.length > 1) {
        let scrollTween = gsap.to(workTrack, {
            xPercent: -100 * (workTrack.children.length - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: workContainer,
                pin: true,
                scrub: 1,
                start: 'center center',
                end: () => '+=' + (workTrack.scrollWidth - workContainer.offsetWidth)
            }
        });
    }

    // --- Smooth scrolling for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target){
                gsap.to(window, {duration: 1.5, scrollTo: { y: target, autoKill: false }, ease: 'power2.inOut'});
            }
        });
    });

    // --- Mobile menu toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    function openMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        mobileMenuButton?.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        mobileMenuButton?.setAttribute('aria-expanded', 'false');
    }

    mobileMenuButton?.addEventListener('click', () => {
        if (mobileMenu?.classList.contains('is-open')) closeMobileMenu();
        else openMobileMenu();
    });

    mobileMenuClose?.addEventListener('click', closeMobileMenu);

    // close when clicking outside panel
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    // close on escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // close on link click
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // --- WhatsApp Float Button Animation ---
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (whatsappFloat) {
        // Show/hide based on scroll position
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.visibility = 'visible';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.visibility = 'hidden';
            }
            
            lastScrollTop = scrollTop;
        });

        // Add click tracking (optional)
        whatsappFloat.addEventListener('click', () => {
            console.log('WhatsApp button clicked');
        });
    }

    // --- Contact form handling ---
    const form = document.getElementById('contact-form');
    if (form) {
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const serviceEl = document.getElementById('service');
        const messageEl = document.getElementById('message');
        const statusEl = document.getElementById('contact-status');
        const sendWhatsAppBtn = document.getElementById('send-whatsapp');
        const sendEmailBtn = document.getElementById('send-email');

        function setError(fieldId, msg) {
            const p = form.querySelector(`.form-error[data-error-for="${fieldId}"]`);
            if (p) p.textContent = msg || '';
        }

        function validEmail(v) {
            return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(v);
        }

        function validate() {
            let ok = true;
            setError('name', '');
            setError('email', '');
            setError('message', '');
            if (!nameEl.value.trim()) { setError('name', 'Please enter your name'); ok = false; }
            if (!emailEl.value.trim()) { setError('email', 'Please enter your email'); ok = false; }
            else if (!validEmail(emailEl.value.trim())) { setError('email', 'Please enter a valid email'); ok = false; }
            if (!messageEl.value.trim()) { setError('message', 'Please add some project details'); ok = false; }
            return ok;
        }

        function buildMessage() {
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const service = serviceEl.value;
            const details = messageEl.value.trim();
            const lines = [
                `Hi Kabir!`,
                `My name is ${name}.`,
                `I'm interested in: ${service}.`,
                '',
                `Project details:`,
                details,
                '',
                `You can reach me at: ${email}`
            ];
            return lines.join('\n');
        }

        function notify(msg) {
            if (statusEl) { statusEl.textContent = msg; }
        }

        // WhatsApp submission
        sendWhatsAppBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            if (!validate()) return;
            // basic honeypot
            const hp = document.getElementById('company');
            if (hp && hp.value) return; // likely bot
            const text = encodeURIComponent(buildMessage());
            const url = `https://wa.me/918860019781?text=${text}`;
            window.open(url, '_blank');
            notify('Opening WhatsApp…');
        });

        // Email submission (mailto)
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validate()) return;
            const hp = document.getElementById('company');
            if (hp && hp.value) return;
            const subject = encodeURIComponent('New Project Inquiry');
            const body = encodeURIComponent(buildMessage());
            const mailto = `mailto:workkabir.s@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailto;
            notify('Preparing your email…');
        });

        // Live validation on blur
        [nameEl, emailEl, messageEl].forEach(el => el.addEventListener('blur', validate));
    }
});
