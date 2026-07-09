// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lucide Icons
lucide.createIcons();

// 1. Loading Screen
window.addEventListener('load', () => {
    let progress = 0;
    const bar = document.querySelector('.loader-bar');
    const loader = document.getElementById('loader');
    
    // Disable scroll during load
    document.body.style.overflow = 'hidden';
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 2;
        if (progress > 100) progress = 100;
        bar.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                document.body.style.overflow = '';
                setTimeout(() => {
                    loader.style.visibility = 'hidden';
                    initAnimations();
                }, 1000);
            }, 500);
        }
    }, 100);
});

// 2. Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// 3. Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.custom-cursor-follower');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

// Hide cursor on touch devices
if (window.matchMedia("(pointer: coarse)").matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
} else {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for the dot
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Smooth follower update
    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        follower.style.left = `${cursorX}px`;
        follower.style.top = `${cursorY}px`;
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover states for cursor
    const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .interactive');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// 4. Magnetic Buttons
const magneticButtons = document.querySelectorAll('.magnetic');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.6,
            ease: "power2.out"
        });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// 5. Sticky Navbar
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 50) {
        navbar.classList.remove('py-2', 'glass', 'shadow-lg');
        navbar.classList.add('py-4', 'bg-transparent');
        navbar.style.transform = 'translateY(0)';
    } else {
        navbar.classList.add('py-2', 'glass', 'shadow-lg');
        navbar.classList.remove('py-4', 'bg-transparent');
        
        if (currentScroll > lastScroll && currentScroll > 200) {
            // Scroll Down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll Up
            navbar.style.transform = 'translateY(0)';
        }
    }
    lastScroll = currentScroll;
});

// 6. Initialize Libraries & Animations
function initAnimations() {
    // Typed.js
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['Innovative Financial Solutions.', 'Sustainable Wealth Growth.', 'Advanced Risk Management.'],
            typeSpeed: 40,
            backSpeed: 20,
            loop: true,
            backDelay: 2500
        });
    }

    // tsParticles
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
                resize: true,
            },
            modes: {
                grab: { distance: 150, links: { opacity: 0.4 } }
            },
        },
        particles: {
            color: { value: "#FCD535" },
            links: { color: "#FCD535", distance: 150, enable: true, opacity: 0.15, width: 1 },
            collisions: { enable: false },
            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 0.8, straight: false },
            number: { density: { enable: true, area: 800 }, value: 30 },
            opacity: { value: 0.3, random: true },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    });

    // AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic'
    });

    // Vanilla Tilt
    if (window.matchMedia("(pointer: fine)").matches) {
        VanillaTilt.init(document.querySelectorAll(".glass-card"), {
            max: 3,
            speed: 500,
            glare: true,
            "max-glare": 0.15,
            scale: 1.01
        });
    }

    // Swiper for Testimonials
    new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2, centeredSlides: false },
            1024: { slidesPerView: 3, centeredSlides: false }
        }
    });

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 85%",
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: "power3.out",
                    onUpdate: function() {
                        counter.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
                    }
                });
            },
            once: true
        });
    });

    // Parallax & Dashboard Animation
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", parallaxHero);
        function parallaxHero(e) {
            document.querySelectorAll(".parallax-el").forEach(function(move) {
                var moving_value = move.getAttribute("data-value");
                var x = (e.clientX * moving_value) / 250;
                var y = (e.clientY * moving_value) / 250;
                move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
            });
            
            // Tilt Hero Dashboard
            const dashboard = document.querySelector('.hero-dashboard-inner');
            if(dashboard) {
                const x = (window.innerWidth / 2 - e.clientX) / 60;
                const y = (window.innerHeight / 2 - e.clientY) / 60;
                dashboard.style.transform = `rotateX(${15 + y}deg) rotateY(${-15 + x}deg)`;
            }
        }
    }
    
    // Scroll Animations with GSAP for staggers
    gsap.utils.toArray('.fade-up-stagger').forEach((elem) => {
        gsap.from(elem.children, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item button');
faqItems.forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        const isOpen = !content.classList.contains('hidden');
        
        // Close all
        document.querySelectorAll('.faq-content').forEach(c => {
            c.style.opacity = '0';
            setTimeout(() => c.classList.add('hidden'), 300);
        });
        document.querySelectorAll('.faq-item i').forEach(i => i.style.transform = 'rotate(0deg)');
        
        // Open clicked if was closed
        if(!isOpen) {
            content.classList.remove('hidden');
            // Small delay to allow display:block to apply before animating opacity
            setTimeout(() => {
                content.style.opacity = '1';
            }, 10);
            icon.style.transform = 'rotate(180deg)';
        }
    });
});
