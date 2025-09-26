// animations.js — ГЛОБАЛЬНАЯ ВЕРСИЯ (без import/export)
(function (w) {
    const throttleFn = w.throttle || ((fn) => fn);

    class AnimationManager {
        constructor() {
            this.animatedElements = [];
            this.init();
        }

        init() {
            this.setupScrollAnimations();
            this.setupIntersectionObserver();
            this.setupHoverEffects();
        }

        setupScrollAnimations() {
            const scrollHandler = throttleFn(() => {
                this.animatedElements.forEach((element) => {
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                    if (isVisible) element.classList.add('visible');
                });
            }, 100);

            window.addEventListener('scroll', scrollHandler);
            scrollHandler(); // initial
        }

        setupIntersectionObserver() {
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        if (entry.target.children.length > 0) {
                            Array.from(entry.target.children).forEach((child, index) => {
                                if (child.classList.contains('fade-in')) {
                                    child.style.transitionDelay = `${index * 0.1}s`;
                                }
                            });
                        }
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach((el) => {
                this.animatedElements.push(el);
                observer.observe(el);
            });
        }

        setupHoverEffects() {
            const cards = document.querySelectorAll('.highlight-card, .skill-category, .portfolio-card, .contact-card');
            cards.forEach((card) => {
                card.addEventListener('mouseenter', () => (card.style.transform = 'translateY(-5px)'));
                card.addEventListener('mouseleave', () => (card.style.transform = 'translateY(0)'));
            });

            const buttons = document.querySelectorAll('.btn, .portfolio-link, .contact-link');
            buttons.forEach((btn) => {
                btn.addEventListener('mouseenter', () => (btn.style.transform = 'translateX(5px)'));
                btn.addEventListener('mouseleave', () => (btn.style.transform = 'translateX(0)'));
            });
        }

        animateCounter(element, target, duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(start);
                }
            }, 16);
        }

        setupParallax() {
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                parallaxElements.forEach((el) => (el.style.transform = `translateY(${rate}px)`));
            });
        }
    }

    w.AnimationManager = AnimationManager;
})(window);
