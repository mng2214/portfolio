/**
 * Main application entry point - Fixed version
 */
// import { SecurityManager }   from './modules/security.js';
// import { NavigationManager } from './modules/navigation.js';
// import { AnimationManager }  from './modules/animations.js';
// import { SkillsAccordion }   from './modules/skills-accordion.js';
// import { FormHandler }       from './modules/form-handler.js';
// Simple module pattern without ES6 imports
const PortfolioApp = (function () {
    'use strict';

    let modules = {};

    function initGoogleAnalytics() {
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());
        gtag('config', 'G-RYSLS0MGE1');
    }

    function initializeModules() {
        try {
            // Простая инициализация аккордеона навыков
            if (typeof initSkillsAccordion !== 'undefined') {
                initSkillsAccordion();
                console.log('Skills accordion loaded');
            }

            // Остальные модули...
            if (typeof NavigationManager !== 'undefined') {
                modules.navigation = new NavigationManager();
                console.log('Navigation module loaded');
            }

            // Добавьте другие модули по необходимости...
            if (typeof SecurityManager !== 'undefined') {
                modules.security = new SecurityManager();
                console.log('Security module loaded');
            }

            if (typeof AnimationManager !== 'undefined') {
                modules.animations = new AnimationManager();
                console.log('Animations module loaded');
            }

            if (typeof FormHandler !== 'undefined') {
                modules.formHandler = new FormHandler();
                console.log('Form handler loaded');
            }

        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    }

    function setupEventListeners() {
        window.addEventListener('load', onWindowLoad);

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(onWindowResize, 250);
        });
    }

    function onWindowLoad() {
        document.body.classList.add('loaded');
        console.log('Page fully loaded');
    }

    function onWindowResize() {
        // Handle responsive behaviors
        console.log('Window resized');
    }

    function init() {
        console.log('Initializing portfolio app...');
        initGoogleAnalytics();
        initializeModules();
        setupEventListeners();

        // Force show all content after load
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    }

    return {
        init: init,
        getModule: (name) => modules[name]
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    PortfolioApp.init();

    // Fallback: Make sure all content is visible
    setTimeout(() => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
    }, 500);
});

// Fallback security functions if modules fail
document.addEventListener('DOMContentLoaded', function () {
    // Basic security
    document.addEventListener('contextmenu', e => e.preventDefault());
});