window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  
  const count = 80;
  
  function buildSquares(sizeMultiplier = 1) {
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const square = document.createElement('div');
      square.className = 'square';
      
      const size = (Math.random() * 60 + 40) * sizeMultiplier;
      square.style.width = size + 'px';
      square.style.height = size + 'px';
      
      if (i % 2 === 0) {
        square.style.background = '#ff00aaff';  // blue
      } else {
        square.style.background = '#ff00aaff';  // red
      }
      
      container.appendChild(square);
    }
  }

  buildSquares(1);
  
  // click to change sizes (borrowed from demo)
  document.addEventListener('click', (event) => {
    const multiplier = Math.random() * 1.5 + 0.5; 
    buildSquares(multiplier);
  });
  
});