(function() {
  "use strict";

  const scrollLine = document.querySelector(".scroll-line");

  function fillScrollLine() {
    const windowH = window.innerHeight;
    const fullH = document.body.clientHeight;
    const scrolled = window.scrollY;
    const percentScrolled = (scrolled / (fullH - windowH)) * 100;

    scrollLine.style.width = `${percentScrolled}%`;
  }

  window.addEventListener("scroll", debounce(fillScrollLine));

  function debounce(func, wait = 15, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callnow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callnow) {
        func.apply(context, args);
      }
    };
  }
})();
