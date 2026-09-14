// ===================================================
// 💖 A LOVE LETTER IN THE STARS - INTERACTIVE ENGINE
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize App with Config
  initApp();
  initCanvas();
  initEnvelope();
  initTimer();
  initMemories();
  initReasonsDeck();
  initLetter();
  initSurprise();
  initAudioEngine();
});

// State Management
let currentReasonIndex = 0;
let isAudioPlaying = false;
let audioContext = null;
let melodyInterval = null;
let songAudioElement = null;

// ===================================================
// 🌟 APP INITIALIZATION & TEXT INJECTION
// ===================================================
function initApp() {
  const cfg = window.ROMANTIC_CONFIG || {};

  // Envelope Intro
  if (cfg.envelope) {
    setText('intro-badge', cfg.envelope.badge);
    setText('intro-subtitle', cfg.envelope.subtitle);
    setText('seal-icon', cfg.envelope.sealText || '❤️');
  }

  // Hero
  if (cfg.hero) {
    setText('hero-greeting', cfg.hero.greeting);
    setText('hero-title', cfg.hero.title);
    setText('hero-subtitle', cfg.hero.subtitle);
    setText('timer-title', cfg.hero.timerTitle);
    setText('scroll-hint', cfg.hero.scrollHint);
  }

  // Music metadata shown in the ambient audio bar
  if (cfg.music) {
    setText('audio-title', cfg.music.title || 'Alfaaz');
  }

  // Names
  if (cfg.recipientName) {
    setText('nav-names', `${cfg.recipientName} & ${cfg.senderName || 'Me'}`);
    setText('footer-recipient', cfg.recipientName);
    document.title = `For ${cfg.recipientName} ✨ A Love Letter In The Stars`;
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.innerText = text;
}

// ===================================================
// 💌 ENVELOPE OPENING INTERACTION
// ===================================================
function initEnvelope() {
  const waxSeal = document.getElementById('wax-seal');
  const envelope = document.getElementById('envelope');
  const introOverlay = document.getElementById('intro-overlay');
  const mainContainer = document.getElementById('main-container');

  if (!waxSeal || !envelope || !introOverlay) return;

  waxSeal.addEventListener('click', () => {
    // Open envelope flap & elevate letter
    envelope.classList.add('open');

    // Trigger Heart Confetti Burst at seal position
    const rect = waxSeal.getBoundingClientRect();
    createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

    // Auto-start ambient melody on user interaction
    startAmbientMusic();

    // Fade out overlay and reveal main container
    setTimeout(() => {
      introOverlay.classList.add('hidden');
      mainContainer.classList.add('visible');
    }, 1200);
  });
}

// ===================================================
// ⏱️ LIVE LOVE TIMER
// ===================================================
function initTimer() {
  const startDateStr = window.ROMANTIC_CONFIG?.specialDate || '2023-11-14T00:00:00';
  const startDate = new Date(startDateStr).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = Math.max(0, now - startDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setText('timer-days', String(days).padStart(2, '0'));
    setText('timer-hours', String(hours).padStart(2, '0'));
    setText('timer-minutes', String(minutes).padStart(2, '0'));
    setText('timer-seconds', String(seconds).padStart(2, '0'));
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// ===================================================
// 📸 MEMORIES SCRAPBOOK (3D TILT CARDS)
// ===================================================
function initMemories() {
  const grid = document.getElementById('memories-grid');
  const memories = window.ROMANTIC_CONFIG?.memories || [];
  if (!grid || !memories.length) return;

  grid.innerHTML = '';
  memories.forEach((mem) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-image-container">
          <img src="${mem.image}" alt="${mem.title}" class="memory-image" loading="lazy" />
          <span class="memory-tag">${mem.tag || 'Memory'}</span>
        </div>
        <div class="memory-date"><i class="fa-regular fa-calendar-heart"></i> ${mem.date}</div>
        <h3 class="memory-title">${mem.title}</h3>
        <p class="memory-caption">${mem.caption}</p>
      </div>
    `;

    // 3D Tilt interaction
    const inner = card.querySelector('.memory-card-inner');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 14;
      const rotateY = (x / rect.width) * 14;
      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    });

    grid.appendChild(card);
  });
}

// ===================================================
// 💌 "REASONS WHY I LOVE YOU" DECK
// ===================================================
function initReasonsDeck() {
  const reasons = window.ROMANTIC_CONFIG?.reasons || [];
  if (!reasons.length) return;

  const btnNext = document.getElementById('btn-next-reason');
  const btnPrev = document.getElementById('btn-prev-reason');
  const cardInner = document.querySelector('.reason-card-inner');

  function renderReason(index, animate = true) {
    const reason = reasons[index];
    if (!reason) return;

    if (animate && cardInner) {
      cardInner.classList.remove('flip');
      void cardInner.offsetWidth; // Trigger reflow
      cardInner.classList.add('flip');
    }

    setText('reason-num', reason.number || `0${index + 1}`);
    setText('reason-title', reason.title);
    setText('reason-detail', reason.detail);
    setText('reasons-counter', `${index + 1} / ${reasons.length}`);
  }

  renderReason(0, false);

  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      currentReasonIndex = (currentReasonIndex + 1) % reasons.length;
      renderReason(currentReasonIndex);
      createHeartBurst(e.clientX, e.clientY, 15);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      currentReasonIndex = (currentReasonIndex - 1 + reasons.length) % reasons.length;
      renderReason(currentReasonIndex);
    });
  }
}

// ===================================================
// 📜 DIGITAL LOVE LETTER INJECTION
// ===================================================
function initLetter() {
  const letterCfg = window.ROMANTIC_CONFIG?.letter || {};
  const letterBody = document.getElementById('letter-body');

  setText('letter-date', letterCfg.date);
  setText('letter-salutation', letterCfg.salutation);
  setText('letter-closing', letterCfg.closing);
  setText('letter-signature', letterCfg.signature);

  if (letterBody && letterCfg.paragraphs) {
    letterBody.innerHTML = '';
    letterCfg.paragraphs.forEach((p) => {
      const paragraph = document.createElement('p');
      paragraph.innerText = p;
      letterBody.appendChild(paragraph);
    });
  }
}

// ===================================================
// 🎁 PLAYFUL SURPRISE & CELEBRATION
// ===================================================
function initSurprise() {
  const surpriseCfg = window.ROMANTIC_CONFIG?.surprise || {};
  const btnYes = document.getElementById('btn-surprise-yes');
  const btnNo = document.getElementById('btn-surprise-no');
  const bubble = document.getElementById('playful-bubble');
  const modal = document.getElementById('celebration-modal');
  const btnClose = document.getElementById('btn-close-celebration');
  const backdrop = document.getElementById('celebration-backdrop');

  setText('surprise-question', surpriseCfg.question);
  setText('surprise-yes-text', surpriseCfg.yesText);
  setText('surprise-no-text', surpriseCfg.noText);
  setText('celebration-title', surpriseCfg.celebrationTitle);
  setText('celebration-message', surpriseCfg.celebrationMessage);

  const responses = surpriseCfg.noResponses || [
    "Wait, are you sure? 🥺",
    "Think again! 💕",
    "You can't escape my love! 🏃‍♂️",
    "Wrong button, cutie! 🥰"
  ];
  let responseIndex = 0;

  // Runaway "No" button
  function dodgeButton() {
    const maxX = 120;
    const maxY = 50;
    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Show funny playful speech bubble
    if (bubble) {
      bubble.innerText = responses[responseIndex % responses.length];
      bubble.classList.add('show');
      responseIndex++;
      setTimeout(() => bubble.classList.remove('show'), 2000);
    }
  }

  if (btnNo) {
    btnNo.addEventListener('mouseover', dodgeButton);
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeButton();
    });
  }

  // "Yes" button celebration
  if (btnYes) {
    btnYes.addEventListener('click', (e) => {
      // Grand Confetti / Fireworks Burst
      createGrandCelebration();
      if (modal) modal.classList.add('open');
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  }
}

// ===================================================
// 🌌 BACKGROUND CANVAS: STARFIELD, HEARTS & PARTICLES
// ===================================================
let canvas, ctx, width, height;
const stars = [];
const floatingHearts = [];
const burstParticles = [];

function initCanvas() {
  canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Seed twinkling stars
  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      glow: Math.random() > 0.6
    });
  }

  // Seed floating hearts
  for (let i = 0; i < 18; i++) {
    floatingHearts.push(createFloatingHeart(true));
  }

  // Interactive sparkles on click/touch
  window.addEventListener('click', (e) => {
    createSparkleRipples(e.clientX, e.clientY);
  });

  animateCanvas();
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createFloatingHeart(randomY = false) {
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + 30,
    size: Math.random() * 14 + 8,
    speedY: Math.random() * 0.6 + 0.3,
    speedX: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.4 + 0.2,
    hue: Math.random() > 0.5 ? '#ff758c' : '#ff85a2',
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.02 + 0.01
  };
}

function drawHeart(x, y, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  const d = size;
  ctx.moveTo(x, y + d / 4);
  ctx.bezierCurveTo(x, y, x - d / 2, y, x - d / 2, y + d / 4);
  ctx.bezierCurveTo(x - d / 2, y + d / 2, x, y + d * 0.75, x, y + d);
  ctx.bezierCurveTo(x, y + d * 0.75, x + d / 2, y + d / 2, x + d / 2, y + d / 4);
  ctx.bezierCurveTo(x + d / 2, y, x, y, x, y + d / 4);
  ctx.fill();
  ctx.restore();
}

function createSparkleRipples(x, y) {
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    burstParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 2,
      alpha: 1,
      decay: Math.random() * 0.03 + 0.015,
      color: Math.random() > 0.5 ? '#fde047' : '#ff85a2',
      isHeart: Math.random() > 0.6
    });
  }
}

function createHeartBurst(x, y, count = 30) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    burstParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      size: Math.random() * 12 + 6,
      alpha: 1,
      decay: Math.random() * 0.02 + 0.01,
      color: ['#ff4d79', '#ff758c', '#fda085', '#ffd1ff', '#fae100'][Math.floor(Math.random() * 5)],
      isHeart: true
    });
  }
}

function createGrandCelebration() {
  const bursts = 5;
  for (let b = 0; b < bursts; b++) {
    setTimeout(() => {
      const rx = Math.random() * (width * 0.8) + width * 0.1;
      const ry = Math.random() * (height * 0.6) + height * 0.2;
      createHeartBurst(rx, ry, 45);
    }, b * 350);
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);

  // 1. Draw & twinkle stars
  stars.forEach((star) => {
    star.alpha += star.speed;
    if (star.alpha > 0.95 || star.alpha < 0.2) star.speed = -star.speed;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    if (star.glow) {
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffccd5';
      ctx.fill();
    }
    ctx.restore();
  });

  // 2. Draw & update floating background hearts
  floatingHearts.forEach((h, idx) => {
    h.y -= h.speedY;
    h.sway += h.swaySpeed;
    h.x += Math.sin(h.sway) * 0.4 + h.speedX;

    drawHeart(h.x, h.y, h.size, h.hue, h.opacity);

    if (h.y < -40) {
      floatingHearts[idx] = createFloatingHeart(false);
    }
  });

  // 3. Draw & update burst particles
  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const p = burstParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06; // slight gravity
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      burstParticles.splice(i, 1);
    } else {
      if (p.isHeart) {
        drawHeart(p.x, p.y, p.size, p.color, p.alpha);
      } else {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  requestAnimationFrame(animateCanvas);
}

// ===================================================
// 🎵 DREAMY ROMANTIC AMBIENT SYNTH ENGINE (Web Audio API)
// ===================================================
function initAudioEngine() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const controlBar = document.getElementById('audio-control-bar');
  const statusEl = document.getElementById('audio-status');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      stopAmbientMusic();
    } else {
      startAmbientMusic();
    }
  });
}

function startAmbientMusic() {
  if (isAudioPlaying) return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();

    isAudioPlaying = true;
    const controlBar = document.getElementById('audio-control-bar');
    const statusEl = document.getElementById('audio-status');
    const songTitle = window.ROMANTIC_CONFIG?.music?.title || 'Alfaaz';
    if (controlBar) controlBar.classList.add('playing');
    if (statusEl) statusEl.innerText = `Playing ${songTitle}`;

    const songFile = window.ROMANTIC_CONFIG?.music?.file || 'assets/Alfaaz - Hamza Malik, Zain Ali  Lyrics.mp3';
    const startAt = Number(window.ROMANTIC_CONFIG?.music?.startAt || 72);
    playLocalSong(songFile, startAt);

    // Dreamy pentatonic chord progression (Fmaj7 -> Am7 -> Bbmaj7 -> C9)
    const chords = [
      [349.23, 440.00, 523.25, 659.25], // F4, A4, C5, E5
      [440.00, 523.25, 659.25, 783.99], // A4, C5, E5, G5
      [466.16, 587.33, 698.46, 880.00], // Bb4, D5, F5, A5
      [523.25, 659.25, 783.99, 987.77]  // C5, E5, G5, B5
    ];

    let chordIdx = 0;
    function playNextChord() {
      if (!isAudioPlaying || !audioContext) return;

      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, noteIdx) => {
        setTimeout(() => {
          if (!isAudioPlaying) return;
          playSoftTone(freq, 2.2);
        }, noteIdx * 320);
      });
    }

    playNextChord();
    melodyInterval = setInterval(playNextChord, 3800);
  } catch (err) {
    console.warn("Audio context not supported or restricted:", err);
  }
}

function playLocalSong(songFile, startAt) {
  if (!songFile) return;

  if (!songAudioElement) {
    songAudioElement = new Audio(songFile);
    songAudioElement.loop = true;
    songAudioElement.volume = 0.85;
    songAudioElement.preload = 'auto';

    songAudioElement.addEventListener('loadedmetadata', () => {
      if (songAudioElement.duration && startAt < songAudioElement.duration) {
        songAudioElement.currentTime = startAt;
      }
    });
  } else {
    songAudioElement.src = songFile;
    songAudioElement.load();
  }

  songAudioElement.play().catch((err) => {
    console.warn('Song playback was blocked:', err);
  });
}

function playSoftTone(freq, duration) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioContext.currentTime);

  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

function stopAmbientMusic() {
  isAudioPlaying = false;
  if (melodyInterval) clearInterval(melodyInterval);

  if (songAudioElement) {
    songAudioElement.pause();
    songAudioElement.currentTime = 0;
  }

  const controlBar = document.getElementById('audio-control-bar');
  const statusEl = document.getElementById('audio-status');
  if (controlBar) controlBar.classList.remove('playing');
  if (statusEl) statusEl.innerText = 'Tap to Play';
}
