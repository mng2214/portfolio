(function (w) {
    function initSkillsAccordion() {
        const mq = window.matchMedia('(max-width: 768px)');
        const categories = Array.from(document.querySelectorAll('#skills .skill-category'));

        function bindAccordion() {
            categories.forEach(c => c.classList.remove('open'));

            categories.forEach(cat => {
                const header = cat.querySelector('.skill-header');
                if (!header) return;

                header.replaceWith(header.cloneNode(true));
                const freshHeader = cat.querySelector('.skill-header');

                freshHeader.addEventListener('click', () => {
                    const isOpen = cat.classList.contains('open');
                    categories.forEach(c => c.classList.remove('open'));
                    if (!isOpen) cat.classList.add('open');
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