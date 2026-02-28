// === PLAYLIST VIDÉO HERO ===
const heroVideo = document.querySelector('.hero-video');
let currentVideo = 0;
let videoPlaylist = [];

fetch('videos.json')
  .then(res => res.json())
  .then(playlist => {
    videoPlaylist = playlist;
    if (videoPlaylist.length > 0) {
      heroVideo.src = videoPlaylist[0];
      heroVideo.play();
    }
  });

heroVideo.addEventListener('ended', () => {
  currentVideo = (currentVideo + 1) % videoPlaylist.length;
  heroVideo.src = videoPlaylist[currentVideo];
  heroVideo.play();
});

// === NAVBAR : effet au scroll ===
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// === MENU BURGER (mobile) ===
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Fermer le menu en cliquant sur un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// === ANIMATIONS AU SCROLL ===
const animatedElements = document.querySelectorAll('.card, .stat, .contact-info, .contact-form, .presentation-text, .presentation-image, .adhesion-box');

animatedElements.forEach(el => el.classList.add('animate-on-scroll'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

animatedElements.forEach(el => observer.observe(el));

// === FORMULAIRE DE CONTACT ===
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours...';

  // Simulation d'envoi (à remplacer par un vrai backend ou service comme Formspree)
  setTimeout(() => {
    formMsg.textContent = '✅ Message envoyé ! Nous vous répondrons rapidement.';
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Envoyer ✈';
  }, 1200);
});
