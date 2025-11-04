
function handleScroll() {
    const territories = document.querySelectorAll('.territory');
    
    territories.forEach((territory) => {
        const rect = territory.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
        
        if (isVisible) {
            const description = territory.querySelector('.environment-description');
            if (description) {
                description.classList.add('visible');
            }
        }
    });
}



function setupDotInteractions() {
    const dots = document.querySelectorAll('.animal-dot');
    
    dots.forEach((dot, index) => {
        // Add floating animation with unique timing
        dot.style.animation = `float ${3 + index * 0.3}s ease-in-out infinite`;
        dot.style.animationDelay = `${index * 0.2}s`;
        
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle active state
            this.classList.toggle('active');
            
            // Find the image inside this dot
            const image = this.querySelector('.footprint-image');
            
            if (image) {
                // Toggle visibility
                if (image.style.display === 'none') {
                    image.style.display = 'block';
                } else {
                    image.style.display = 'none';
                }
            }
        });
    });
}


// Resize handler
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Just re-trigger scroll check on resize
        handleScroll();
    }, 250);
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    handleScroll();
    setupDotInteractions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleResize);