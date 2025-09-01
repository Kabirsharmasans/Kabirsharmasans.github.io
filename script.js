document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize Particles.js (background) ---
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
    heroSubtitle.innerHTML = 'Kabir Sans - A freelance developer and designer from Delhi, building beautiful and functional websites.'.split(' ').map(word => `<span>${word}&nbsp;</span>`).join('');

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
});
