document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER STYLE CHANGE ON SCROLL ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }


    // --- SCROLL-TRIGGERED ANIMATIONS ---
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollElements.forEach(el => scrollObserver.observe(el));


    // --- DYNAMIC PEPPER FALLING ANIMATION ---
    const pepperContainer = document.getElementById('pepper-animation-container');
    if (pepperContainer) {
        const pepperSVGs = [
            `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%23E53935" d="M84.9,34.4c-3-11.3-10.9-20.6-21.7-25.1C55.4,5.4,47.9,3.5,41.2,3c-2.3-0.2-4.5,0.4-6.6,1.5c-5.1,2.8-8.4,7.8-9,13.4 c-0.2,2-0.1,4,0.3,6c1.1,5.3,3.9,10,7.9,13.6c5.7,5.1,12.6,8.2,19.9,9.5c-1.3,2.4-3.1,4.5-5.3,5.9c-4.9,3.1-10.2,4.8-15.6,5.3 c-2.1,0.2-4.2,0.1-6.3-0.3c-5.5-1-10.7-3.5-14.8-7.3c-2.3-2.1-4.1-4.7-5.4-7.6c-0.6-1.4-1.2-2.9-1.5-4.4c-0.3-1.6-0.3-3.3,0-4.9 c0.6-2.9,2-5.6,4.2-7.6c1.5-1.4,3.2-2.5,5-3.3c-2.1-3-3-6.6-2.5-10.1c0.6-4,2.9-7.5,6.3-9.5C28.2,7.7,33.5,6.6,38.2,8 c2.9,0.8,5.6,2.4,7.7,4.6c-4.1-1.3-8.5-1.2-12.6,0.3c-3.1,1.1-5.8,3-7.9,5.4c-1.1,1.3-2,2.8-2.5,4.4c-0.8,2.5-0.7,5.2,0.2,7.6 c2,5.2,6.4,9,11.8,10.6c7.7,2.3,16-0.4,21.2-6.5c2.9-3.4,4.7-7.7,5.3-12.2c0.2-1.8,0.1-3.6-0.3-5.4c-1-4.7-4-8.8-8.2-11.2 c-2.1-1.2-4.4-1.8-6.8-1.7c-5.2,0.3-10,2.8-13.4,6.5c-3,3.2-4.8,7.3-5.1,11.6c-0.1,1.3-0.1,2.6,0.2,3.9c0.7,3.6,2.9,6.7,6,8.6 c3.7,2.3,8.1,3,12.3,2.1c8.4-1.8,15.2-7.6,17.9-15.6C85.5,40.1,85.7,37.2,84.9,34.4z"/><path fill="%2343A047" d="M41.2,3C42.9,2.9,44.7,3,46.3,3.3c3.5,0.6,6.8,2,9.6,4c-2.3-1.4-4.9-2.2-7.5-2.2c-7.9,0-14.2,6.4-14.2,14.2 c0,1.3,0.2,2.6,0.5,3.8c-2.8-2.6-4.5-6.2-4.5-10.2C29.9,7.6,34.9,3.5,41.2,3z"/></svg>`,
            `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%23FB8C00" d="M84.9,34.4c-3-11.3-10.9-20.6-21.7-25.1C55.4,5.4,47.9,3.5,41.2,3c-2.3-0.2-4.5,0.4-6.6,1.5c-5.1,2.8-8.4,7.8-9,13.4 c-0.2,2-0.1,4,0.3,6c1.1,5.3,3.9,10,7.9,13.6c5.7,5.1,12.6,8.2,19.9,9.5c-1.3,2.4-3.1,4.5-5.3,5.9c-4.9,3.1-10.2,4.8-15.6,5.3 c-2.1,0.2-4.2,0.1-6.3-0.3c-5.5-1-10.7-3.5-14.8-7.3c-2.3-2.1-4.1-4.7-5.4-7.6c-0.6-1.4-1.2-2.9-1.5-4.4c-0.3-1.6-0.3-3.3,0-4.9 c0.6-2.9,2-5.6,4.2-7.6c1.5-1.4,3.2-2.5,5-3.3c-2.1-3-3-6.6-2.5-10.1c0.6-4,2.9-7.5,6.3-9.5C28.2,7.7,33.5,6.6,38.2,8 c2.9,0.8,5.6,2.4,7.7,4.6c-4.1-1.3-8.5-1.2-12.6,0.3c-3.1,1.1-5.8,3-7.9,5.4c-1.1,1.3-2,2.8-2.5,4.4c-0.8,2.5-0.7,5.2,0.2,7.6 c2,5.2,6.4,9,11.8,10.6c7.7,2.3,16-0.4,21.2-6.5c2.9-3.4,4.7-7.7,5.3-12.2c0.2-1.8,0.1-3.6-0.3-5.4c-1-4.7-4-8.8-8.2-11.2 c-2.1-1.2-4.4-1.8-6.8-1.7c-5.2,0.3-10,2.8-13.4,6.5c-3,3.2-4.8,7.3-5.1,11.6c-0.1,1.3-0.1,2.6,0.2,3.9c0.7,3.6,2.9,6.7,6,8.6 c3.7,2.3,8.1,3,12.3,2.1c8.4-1.8,15.2-7.6,17.9-15.6C85.5,40.1,85.7,37.2,84.9,34.4z"/><path fill="%2343A047" d="M41.2,3C42.9,2.9,44.7,3,46.3,3.3c3.5,0.6,6.8,2,9.6,4c-2.3-1.4-4.9-2.2-7.5-2.2c-7.9,0-14.2,6.4-14.2,14.2 c0,1.3,0.2,2.6,0.5,3.8c-2.8-2.6-4.5-6.2-4.5-10.2C29.9,7.6,34.9,3.5,41.2,3z"/></svg>`,
        ];
        const numberOfPeppers = 25;

        for (let i = 0; i < numberOfPeppers; i++) {
            const pepper = document.createElement('div');
            pepper.classList.add('pepper');
            
            const startX = Math.random() * 100;
            const fallDuration = (Math.random() * 15) + 10;
            const fallDelay = Math.random() * 25;
            const swayDuration = (Math.random() * 5) + 4;
            const pepperType = pepperSVGs[Math.floor(Math.random() * pepperSVGs.length)];
            const size = (Math.random() * 20) + 20;

            pepper.style.left = `${startX}vw`;
            pepper.style.width = `${size}px`;
            pepper.style.height = `${size}px`;
            pepper.style.backgroundImage = `url('${pepperType}')`;
            pepper.style.animation = `fall ${fallDuration}s ${fallDelay}s linear infinite, sway ${swayDuration}s ${fallDelay}s ease-in-out infinite`;

            pepperContainer.appendChild(pepper);
        }
    }
    
    // --- NEW FIRE EMBER ANIMATION ---
    const emberContainer = document.getElementById('fire-ember-container');
    if (emberContainer) {
        const numberOfEmbers = 30;
        for (let i = 0; i < numberOfEmbers; i++) {
            const ember = document.createElement('div');
            ember.classList.add('ember');

            const startX = Math.random() * 100;
            const xEnd = (Math.random() * 200) - 100; // -100px to +100px drift
            const riseDuration = (Math.random() * 8) + 5; // 5s to 13s
            const riseDelay = Math.random() * 10;
            const size = (Math.random() * 5) + 2; // 2px to 7px

            ember.style.left = `${startX}vw`;
            ember.style.width = `${size}px`;
            ember.style.height = `${size}px`;
            ember.style.setProperty('--x-end', `${xEnd}px`);
            ember.style.animationDuration = `${riseDuration}s`;
            ember.style.animationDelay = `${riseDelay}s`;

            emberContainer.appendChild(ember);
        }
    }

});