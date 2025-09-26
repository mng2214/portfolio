(function (w) {
    class NavigationManager {
        constructor() {
            this.burger = document.querySelector('.burger-menu');
            this.menu = document.querySelector('.mobile-menu');
            this.closeBtn = document.querySelector('.mobile-menu-close');
            this.header = document.querySelector('header');
            this.linkSelector = '.mobile-nav-links a';

            this.onBurgerClick = this.onBurgerClick.bind(this);
            this.onKeydown = this.onKeydown.bind(this);
            this.onResize = this.onResize.bind(this);

            this.init();
        }

        init() {
            if (!this.burger || !this.menu) return;
            if (this.burger.dataset.navBound === '1') return;
            this.burger.dataset.navBound = '1';

            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) this.header?.classList.add('scrolled');
                else this.header?.classList.remove('scrolled');
            }, {passive: true});

            this.burger.addEventListener('click', this.onBurgerClick, {passive: true});
            this.closeBtn?.addEventListener('click', () => this.close());
            this.menu.addEventListener('click', (e) => {
                if (e.target === this.menu) this.close();
            });
            this.menu.addEventListener('click', (e) => {
                const a = e.target.closest(this.linkSelector);
                if (a) this.close();
            });

            document.addEventListener('keydown', this.onKeydown);
            window.addEventListener('resize', this.onResize);
        }

        onBurgerClick() {
            if (this.menu.classList.contains('active')) this.close();
            else this.open();
        }

        open() {
            this.menu.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.burger.setAttribute('aria-expanded', 'true');
            this.animateBurger(true);
        }

        close() {
            this.menu.classList.remove('active');
            document.body.style.overflow = 'auto';
            this.burger.setAttribute('aria-expanded', 'false');
            this.animateBurger(false);
        }

        onKeydown(e) {
            if (e.key === 'Escape') this.close();
        }

        onResize() {
            if (window.innerWidth >= 1024) this.close();
        }

        animateBurger(isOpen) {
            const lines = this.burger.querySelectorAll('.burger-line');
            if (lines.length < 3) return;
            if (isOpen) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                lines[0].style.transform = '';
                lines[1].style.opacity = '';
                lines[2].style.transform = '';
            }
        }
        setupSmoothScrolling() {
            document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
                anchor.addEventListener('click', (e) => {
                    const url = new URL(anchor.href, window.location.href);
                    const samePage = url.pathname === window.location.pathname && url.origin === window.location.origin;
                    const targetId = url.hash;
                    if (!samePage || !targetId || targetId === '#') return;

                    e.preventDefault();
                    const target = document.querySelector(targetId);
                    if (target) {
                        const headerHeight = this.header?.offsetHeight || 0;
                        const top = target.offsetTop - headerHeight - 20;

                        // ЗАМЕДЛЕННАЯ ПРОКРУТКА - увеличиваем duration
                        window.scrollTo({
                            top,
                            behavior: 'smooth',
                            // Добавляем опции для контроля скорости
                            duration: 1500 // 1.5 секунды вместо стандартных ~0.5
                        });
                    }

                    if (this.mobileMenu?.classList.contains('active')) this.closeMobileMenu();
                });
            });
        }
    }


    w.NavigationManager = NavigationManager;
})(window);
