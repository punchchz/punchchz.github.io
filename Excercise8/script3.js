window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  
  let moveCount = 0;
  const colors = ['#ffcc00', '#ff6b9d', '#4ecdc4', '#95e1d3', '#ff6b6b'];
  

  const circle = document.createElement('div');
  circle.className = 'circle';
  container.appendChild(circle);

  function updateCircle(x, y, size, color) {
    circle.style.left = x + 'px';
    circle.style.top = y + 'px';
    circle.style.width = size + 'px';
    circle.style.height = size + 'px';
    circle.style.background = color;
  }

  updateCircle(
    window.innerWidth / 2 - 50,
    window.innerHeight / 2 - 50,
    100,
    '#ffcc00'
  );
  
  document.addEventListener('click', (event) => {
    moveCount++;
    
    const size = Math.random() * 150 + 80;
    const x = event.clientX - size / 2;
    const y = event.clientY - size / 2;
    
    let color;
    if (moveCount % 3 === 0) {
      color = '#36ff33ff'; 
    } else {
      color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateCircle(x, y, size, color);
  });
  
  setInterval(() => {
    moveCount++;
    
    const size = Math.random() * 180 + 60;
    const x = Math.random() * (window.innerWidth - size);
    const y = Math.random() * (window.innerHeight - size);
    
    let color;
    if (moveCount % 3 === 0) {
      color = '#ff3366';
    } else {
      color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateCircle(x, y, size, color);
  }, 5000);
  
});