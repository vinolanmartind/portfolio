document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.getElementById('nav-overlay');

  if (!hamburger || !navLinks || !overlay) return;

  function openMenu() {
    navLinks.classList.add('active');
    overlay.classList.add('active');
    hamburger.classList.add('active');
  }

  function closeMenu() {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
  }

  hamburger.addEventListener('click', function () {
    navLinks.classList.contains('active') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

 
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });


  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeMenu();
  });
});
