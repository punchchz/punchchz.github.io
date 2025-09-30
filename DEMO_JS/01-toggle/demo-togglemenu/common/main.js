document.addEventListener("DOMContentLoaded", function () {
  const menuButtons = document.querySelectorAll('.menu-button');
  const menu = document.querySelector('.menu');
  const menuBg = document.querySelector('.menu-bg');

  menuButtons.forEach(function(button) {
    button.addEventListener('click', function () {
      this.classList.toggle('open');        // Toggle 'open' on the button
      menu.classList.toggle('open');        // Toggle 'open' on the menu
      menuBg.classList.toggle('cover');     // Toggle 'cover' on the menu background
    });
  });
});
