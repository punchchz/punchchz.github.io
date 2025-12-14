window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const numberOfSquares = 80;

  function makeSquares(sizeMult = 1) {
    // get rid of everything first
    container.innerHTML = '';
    
    // make 80 squares
    for (let i = 0; i < numberOfSquares; i++) {
      const square = document.createElement('div');
      square.className = 'square';
      
      // random size between 40 and 100 then multiply
      const randomSize = (Math.random() * 60 + 40) * sizeMult;
      square.style.width = randomSize + 'px';
      square.style.height = randomSize + 'px';
      
      // tried to alternate colors but both ended up same pink 
      if (i % 2 === 0) {
        square.style.background = '#ff00aaff';  
      } else {
        square.style.background = '#ff00aaff'; 
      }
      
      container.appendChild(square);
    }
  }

  // start with normal size
  makeSquares(1);

  // when you click anywhere they regenerate with random sizes
  document.addEventListener('click', (event) => {
    const randomMultiplier = Math.random() * 1.5 + 0.5; 
    makeSquares(randomMultiplier);
  });
});