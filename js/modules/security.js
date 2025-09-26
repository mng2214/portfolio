// security.js — ГЛОБАЛЬНАЯ ВЕРСИЯ (без import/export)
(function (w) {
    class SecurityManager {
        constructor() {
            this.mouseMovement = false;
            this.init();
        }

        init() {
            this.disableInspect();
            this.copyProtection();
            this.botDetection();
            this.iframeProtection();
            this.emailSpamProtection();
        }

        disableInspect() {
            'use strict';
            document.addEventListener('contextmenu', e => e.preventDefault());
            document.addEventListener('keydown', e => {
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                    (e.ctrlKey && e.key === 'U')
                ) {
                    e.preventDefault();
                    return false;
                }
            });
            let devToolsOpen = false;
            setInterval(() => {
                const wT = window.outerWidth - window.innerWidth > 100;
                const hT = window.outerHeight - window.innerHeight > 100;
                if ((wT || hT) && !devToolsOpen) {
                    devToolsOpen = true;
                    setInterval(() => { debugger; }, 100);
                }
            }, 1000);
        }

        copyProtection() {
            document.addEventListener('DOMContentLoaded', () => {
                document.addEventListener('selectstart', e => { e.preventDefault(); return false; });
                document.addEventListener('dragstart', e => {
                    if (e.target.tagName === 'IMG') { e.preventDefault(); return false; }
                });
                document.querySelectorAll('img').forEach(img => {
                    img.addEventListener('contextmenu', e => { e.preventDefault(); return false; });
                });
            });
        }

        botDetection() {
            document.addEventListener('mousemove', () => (this.mouseMovement = true));
            if (navigator.webdriver || window.callPhantom || window._phantom) {
                document.body.innerHTML = '<h1>Automated tools are not allowed!</h1>';
            }
        }

        iframeProtection() {
            if (window.top !== window.self) window.top.location = window.self.location;
        }

        emailSpamProtection() {
            document.addEventListener('DOMContentLoaded', () => {
                const emailElements = document.querySelectorAll('[data-email]');
                emailElements.forEach(el => {
                    const decoded = atob(el.getAttribute('data-email'));
                    const a = document.createElement('a');
                    a.href = 'mailto:' + decoded;
                    a.textContent = decoded;
                    el.innerHTML = a.outerHTML;
                });
            });
        }

        isHuman() { return this.mouseMovement; }
    }

    w.SecurityManager = SecurityManager;
})(window);
