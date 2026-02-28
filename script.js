// === PLAYLIST VIDÉO HERO AVEC PRÉCHARGEMENT ===
const heroVideo = document.querySelector('.hero-video');
let currentVideo = 0;
let videoPlaylist = [];
let preloadedVideos = {};

function preloadVideo(src) {
  if (preloadedVideos[src]) return;
  const v = document.createElement('video');
  v.src = src;
  v.preload = 'auto';
  v.muted = true;
  preloadedVideos[src] = v;
}

function playVideo(index) {
  const src = videoPlaylist[index];
  const next = videoPlaylist[(index + 1) % videoPlaylist.length];

  if (preloadedVideos[src]) {
    heroVideo.src = preloadedVideos[src].src;
  } else {
    heroVideo.src = src;
  }
  heroVideo.play();
  preloadVideo(next);
}

fetch('videos.json')
  .then(res => res.json())
  .then(playlist => {
    videoPlaylist = playlist;
    if (videoPlaylist.length > 0) {
      preloadVideo(videoPlaylist[0]);
      if (videoPlaylist.length > 1) preloadVideo(videoPlaylist[1]);
      playVideo(0);
    }
  });

heroVideo.addEventListener('ended', () => {
  currentVideo = (currentVideo + 1) % videoPlaylist.length;
  playVideo(currentVideo);
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

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours...';
  formMsg.textContent = '';

  const data = new FormData(form);

  try {
    const response = await fetch('https://formspree.io/f/mwvnjepj', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      formMsg.textContent = '✅ Message envoyé ! Nous vous répondrons rapidement.';
      form.reset();
    } else {
      formMsg.textContent = '❌ Une erreur est survenue. Merci de réessayer.';
    }
  } catch {
    formMsg.textContent = '❌ Impossible d\'envoyer le message. Vérifiez votre connexion.';
  }

  btn.disabled = false;
  btn.textContent = 'Envoyer ✈';
});
