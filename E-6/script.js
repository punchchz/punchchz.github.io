document.addEventListener("DOMContentLoaded", function () {
  const numberDisplay = document.getElementById("number");
  const buttons = document.querySelectorAll("button");
  let count = 0;

  buttons.forEach(function(button) {
    button.addEventListener("click", function() {
      if (button.classList.contains("add")) {
        count++;
      } else if (button.classList.contains("subtract")) {
        count--;
      }
      numberDisplay.textContent = count;
    });
  });
});
