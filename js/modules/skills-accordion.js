// skills-accordion.js — клик по всей категории
(function (w) {
    function initSkillsAccordion() {
        const mq = window.matchMedia('(max-width: 768px)');
        const categories = Array.from(document.querySelectorAll('#skills .skill-category'));

        function bindAccordion() {
            categories.forEach(c => c.classList.remove('open'));

            categories.forEach(cat => {
                const newCat = cat.cloneNode(true);
                cat.parentNode.replaceChild(newCat, cat);
                const freshCat = newCat;

                freshCat.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A' || e.target.closest('a')) {
                        return;
                    }

                    const isOpen = freshCat.classList.contains('open');
                    categories.forEach(c => {
                        if (c !== freshCat) c.classList.remove('open');
                    });
                    if (!isOpen) {
                        freshCat.classList.add('open');
                    } else {
                        freshCat.classList.remove('open');
                    }
                });
            });
        }

        function unbindAccordion() {
            categories.forEach(c => c.classList.remove('open'));
        }

        if (mq.matches) bindAccordion(); else unbindAccordion();

        mq.addEventListener('change', (e) => {
            if (e.matches) bindAccordion(); else unbindAccordion();
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        initSkillsAccordion();
    });

    w.initSkillsAccordion = initSkillsAccordion;
})(window);