document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll('button');
  const divs = document.querySelectorAll('div');
  const group1 = document.querySelectorAll('.group1');
  const group2 = document.querySelectorAll('.group2');

  buttons.forEach(function(button) {
    button.addEventListener('click', function () {
      
      // 1. toggle items — comment out each line and see what happens on the page!
      divs.forEach(function(div) {
        if (div.style.display === 'none') {
          // If the div is currently hidden:
          div.style.display = '';  // Show it by resetting to default
        } else {
          // Otherwise, if it's currently visible:
          div.style.display = 'none';  // Hide it
        }
      });

      // group1.forEach(function(el) {
      //   el.classList.toggle('red');
      // });

      // group2.forEach(function(el) {
      //   el.classList.toggle('blue');
      // });

      // 2. toggle the copy of the button
      this.classList.toggle('active');
    });
  });
});
