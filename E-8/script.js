window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  
  // figure out how many boxes based on screen width
  const count = Math.floor(window.innerWidth / 100);
  const baseSize = 18;
  const increment = 10; 
  const threshold = 9;   

  function buildRamp(seed = 0.25) {
    // clear out old boxes first
    container.innerHTML = '';
    
    const baseHue = Math.floor(seed * 360);
    
    for (let i = 0; i < count; i++) {
      const size = baseSize + (i * increment); 
      
      const el = document.createElement('div');
      el.className = 'box';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      
      // random vertical offset 
      const yOffset = Math.random() * 15 - 7.5;
      el.style.transform = `translateY(${yOffset}px)`;
      
      // color shifts based on position
      const hue = (baseHue + i * 8) % 360;
      el.style.background = `hsl(${hue} 75% 60%)`;
      
      // bigger boxes get different style
      if (size > threshold) {
        el.style.opacity = '1';
        el.style.border = '2px solid rgba(255,255,255,0.12)';
      } else {
        el.style.opacity = '0.55';
        el.style.border = '1px solid rgba(0,0,0,0.06)';
      }
      
      container.appendChild(el);
    }
  }
  
  buildRamp(0.25);

  // click to change colors
  document.addEventListener('click', (event) => {
    const seed = event.clientX / window.innerWidth;
    buildRamp(seed);
  });

});