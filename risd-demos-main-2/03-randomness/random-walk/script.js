// Turn an array like [255, 100, 50] into "rgb(255, 100, 50)"
    function makeRgb(c) {
      return 'rgb(' + c.join(', ') + ')';
    }

    // Create a linear gradient using two colors
    function makeGradient(c1, c2) {
      return 'linear-gradient(' + makeRgb(c1) + ', ' + makeRgb(c2) + ')';
    }

    document.addEventListener('DOMContentLoaded', () => {

      // Starting colors
      let bottomColor = [173, 216, 230]; // light blue
      let topColor = [255, 165, 0];      // orange

      const sky = document.getElementById('sky');
      sky.style.background = makeGradient(bottomColor, topColor);

      // Run this 24 times per second (like a slow animation)
      setInterval(() => {
        // Pick random color channel index (0 = red, 1 = green, 2 = blue)
        const bc_i = Math.floor(Math.random() * 3);
        const tc_i = Math.floor(Math.random() * 3);

        // Pick a random step size (small change)
        const step = Math.random() * 2;

        // Subtract step value from those color channels
        topColor[tc_i] -= step;
        bottomColor[bc_i] -= step;

        // Clamp values so they stay between 0–255
        topColor[tc_i] = Math.min(Math.max(topColor[tc_i], 0), 255);
        bottomColor[bc_i] = Math.min(Math.max(bottomColor[bc_i], 0), 255);

        // Make and apply new gradient
        const g = makeGradient(bottomColor, topColor);
        sky.style.background = g;

      }, 1000 / 24); // 24 times per second
    });