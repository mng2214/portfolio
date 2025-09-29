// Carousel functionality - Direct approach
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentSlide = 0;
    let autoPlayInterval;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    // If no carousel found, exit
    if (slides.length === 0) return;

    // Function to show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current slide and activate corresponding dot
        if (slides[index]) {
            slides[index].classList.add('active');
        }

        if (dots[index]) {
            dots[index].classList.add('active');
        }

        currentSlide = index;
    }

    // Function to go to next slide
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
    }

    // Function to go to previous slide
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }

    // Function to go to specific slide
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            showSlide(index);
        }
    }

    // Function to start auto-play
    function startAutoPlay() {
        stopAutoPlay(); // Clear any existing interval
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    // Function to stop auto-play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Initialize carousel
    function initCarousel() {
        // Add event listeners for navigation buttons
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');

        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }

        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }

        // Add event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
        });

        // Start auto-play
        startAutoPlay();

        // Pause auto-play on hover
        const carousel = document.querySelector('.screenshots-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);

            // For touch devices
            carousel.addEventListener('touchstart', stopAutoPlay);
            carousel.addEventListener('touchend', function() {
                setTimeout(startAutoPlay, 3000);
            });
        }

        // Show first slide initially
        showSlide(0);
    }

    // Initialize the carousel
    initCarousel();

    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        const carousel = document.querySelector('.screenshots-carousel');
        if (!carousel) return;

        // Check if carousel is visible in viewport (simple check)
        const rect = carousel.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    nextSlide();
                    break;
                case 'Home':
                    event.preventDefault();
                    showSlide(0);
                    break;
                case 'End':
                    event.preventDefault();
                    showSlide(totalSlides - 1);
                    break;
            }
        }
    });
});