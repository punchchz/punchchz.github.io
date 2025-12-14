window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  let clickCounter = 0;
  
  // color palette i found online
  const colorOptions = ['#ffcc00', '#ff6b9d', '#4ecdc4', '#95e1d3', '#ff6b6b'];
  
  // make the circle element
  const circle = document.createElement('div');
  circle.className = 'circle';
  container.appendChild(circle);

  function moveCircle(xPos, yPos, circleSize, circleColor) {
    circle.style.left = xPos + 'px';
    circle.style.top = yPos + 'px';
    circle.style.width = circleSize + 'px';
    circle.style.height = circleSize + 'px';
    circle.style.background = circleColor;
  }

  // start in middle of screen
  moveCircle(
    window.innerWidth / 2 - 50,
    window.innerHeight / 2 - 50,
    100,
    '#ffcc00'
  );

  // when you click, move circle there
  document.addEventListener('click', (event) => {
    clickCounter++;
    
    const circleSize = Math.random() * 150 + 80;
    const xPos = event.clientX - circleSize / 2;
    const yPos = event.clientY - circleSize / 2;
    
    let newColor;
    // every third click use green
    if (clickCounter % 3 === 0) {
      newColor = '#36ff33ff'; 
    } else {
      // otherwise pick random from array
      newColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    }
    
    moveCircle(xPos, yPos, circleSize, newColor);
  });

  // also auto-move every 5 seconds
  setInterval(() => {
    clickCounter++;
    
    const circleSize = Math.random() * 180 + 60;
    const xPos = Math.random() * (window.innerWidth - circleSize);
    const yPos = Math.random() * (window.innerHeight - circleSize);
    
    let newColor;
    if (clickCounter % 3 === 0) {
      newColor = '#ff3366';
    } else {
      newColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    }
    
    moveCircle(xPos, yPos, circleSize, newColor);
  }, 5000);
});