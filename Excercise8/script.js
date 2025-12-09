window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  
  const count = Math.floor(window.innerWidth / 100);
  const baseSize = 18;       // start size
  const increment = 10;       // growth per step
  const threshold = 9;      // where the conditional happens
  
  function buildRamp(seed = 0.25) {

    container.innerHTML = '';
    
    const baseHue = Math.floor(seed * 360);
    
    // loop to create all the shapes
    for (let i = 0; i < count; i++) {
      const size = baseSize + (i * increment); 
      
      const el = document.createElement('div');
      el.className = 'box';
      

      el.style.width = size + 'px';
      el.style.height = size + 'px';
      const yOffset = Math.random() * 15 - 7.5;
     el.style.transform = `translateY(${yOffset}px)`;
      
      const hue = (baseHue + i * 8) % 360;
      el.style.background = `hsl(${hue} 75% 60%)`;
      
      if (size > threshold) {
        el.style.opacity = '1';
        el.style.border = '2px solid rgba(255,255,255,0.12)';
      } 
      else {
        el.style.opacity = '0.55';
        el.style.border = '1px solid rgba(0,0,0,0.06)';
      }
      
      container.appendChild(el);
    }
  }
  buildRamp(0.25);
  
  document.addEventListener('click', (event) => {
    const seed = event.clientX / window.innerWidth;
    buildRamp(seed);
  });
  setInterval(() => {
    const seed = Math.random();
    buildRamp(seed);
  }, 5000);
  
});