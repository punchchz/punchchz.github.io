 // Function to update the rectangle's position and size
    function updateRectangle(x, y, width, height) {
      const rect = document.querySelector('.rectangle');

      rect.style.left = x + 'px';
      rect.style.top = y + 'px';
      rect.style.width = width + 'px';
      rect.style.height = height + 'px';
    }

    // When the page is loaded
    window.addEventListener('DOMContentLoaded', () => {
      // Start in the middle of the screen
      updateRectangle(
        window.innerWidth / 2 - 50,
        window.innerHeight / 2 - 50,
        100,
        100
      );

      // When you click, move and resize the rectangle
      document.addEventListener('click', (event) => {
        const width = Math.random() * window.innerWidth / 2;
        const height = Math.random() * window.innerHeight / 2;

        const x = event.clientX - width / 2;
        const y = event.clientY - height / 2;

        updateRectangle(x, y, width, height);
      });

      // Every 5 seconds, move the rectangle randomly
      setInterval(() => {
        const width = Math.random() * window.innerWidth / 2;
        const height = Math.random() * window.innerHeight / 2;

        const x = Math.random() * (window.innerWidth - width);
        const y = Math.random() * (window.innerHeight - height);

        updateRectangle(x, y, width, height);
      }, 5000);
    });