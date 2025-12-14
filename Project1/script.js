function checkIfVisible() {
  const territories = document.querySelectorAll('.territory');
  
  territories.forEach((territory) => {
    const rect = territory.getBoundingClientRect();
    
    // is it in the middle-ish of screen?
    const canSeeIt = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
    
    if (canSeeIt) {
      const description = territory.querySelector('.environment-description');
      if (description) {
        description.classList.add('visible');
      }
    }
  });
}

// make the dots float and clickable
function setupDots() {
  const dots = document.querySelectorAll('.animal-dot');
  
  dots.forEach((dot, index) => {
    // each dot floats
    dot.style.animation = `float ${3 + index * 0.3}s ease-in-out infinite`;
    dot.style.animationDelay = `${index * 0.2}s`;
    
    // click to show/hide image
    dot.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      
      const image = this.querySelector('.footprint-image');
      if (image) {
        // toggle display
        if (image.style.display === 'none') {
          image.style.display = 'block';
        } else {
          image.style.display = 'none';
        }
      }
    });
  });
}


let resizeTimer;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    checkIfVisible();
  }, 250);
}


document.addEventListener('DOMContentLoaded', () => {
  checkIfVisible();
  setupDots();
  

  window.scrollTo({ top: 0, behavior: 'smooth' });
});


window.addEventListener('scroll', checkIfVisible);
window.addEventListener('resize', onResize);