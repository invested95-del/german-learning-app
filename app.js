/* ============================================
   DEUTSCH LERNEN – app.js  (shared utilities)
   ============================================ */

/* ── Year in footer ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
  initMobileNav();
});

/* ── Mobile hamburger nav ── */
function initMobileNav() {
  const btn      = document.getElementById('hamburger');
  const drawer   = document.getElementById('mobile-nav');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  // Close drawer when a link is tapped
  drawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      btn.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !drawer.contains(e.target)) {
      drawer.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}

/* ── Audio player ── */
function playAudio(src, onPlay, onEnd) {
  if (window._currentAudio) {
    window._currentAudio.pause();
    window._currentAudio.currentTime = 0;
    if (window._currentOnEnd) window._currentOnEnd();
  }
  const audio = new Audio(src);
  window._currentAudio  = audio;
  window._currentOnEnd  = onEnd;

  audio.addEventListener('canplaythrough', () => {
    audio.play().catch(() => { if (onEnd) onEnd(); });
  }, { once: true });
  audio.addEventListener('playing', () => { if (onPlay) onPlay(); }, { once: true });
  audio.addEventListener('ended',   () => { if (onEnd) onEnd(); window._currentAudio = null; }, { once: true });
  audio.addEventListener('error',   () => { if (onEnd) onEnd(); window._currentAudio = null; }, { once: true });
  audio.load();
}

/* ── Now Playing banner ── */
function setNowPlaying(text, isPlaying = false) {
  const banner = document.getElementById('now-playing');
  const npText = document.getElementById('np-text');
  const npIcon = document.getElementById('np-icon');
  if (!banner || !npText) return;

  npText.textContent = text;

  if (isPlaying) {
    npText.style.color      = 'var(--np-accent, #FFD93D)';
    npText.style.fontWeight = '700';
    if (npIcon) npIcon.style.animation = 'pulseBeat 1s infinite';
  } else {
    npText.style.color      = 'rgba(255,255,255,.72)';
    npText.style.fontWeight = '500';
    if (npIcon) npIcon.style.animation = '';
  }
}

/* ── Progress bar ── */
function updateProgress(played, total) {
  const fill  = document.getElementById('progress-fill');
  const count = document.getElementById('progress-count');
  if (fill)  fill.style.width = total > 0 ? (played / total * 100) + '%' : '0%';
  if (count) count.textContent = `${played} / ${total}`;
}

/* ── Skeleton → Content reveal ── */
function revealContent(skeletonId, contentId, delay = 400) {
  const skeleton = document.getElementById(skeletonId);
  const content  = document.getElementById(contentId);
  if (!skeleton || !content) return;

  setTimeout(() => {
    skeleton.style.animation = 'fadeOut .3s ease forwards';
    setTimeout(() => {
      skeleton.style.display = 'none';
      content.style.display  = '';
      content.style.animation = 'fadeSlideUp .4s ease both';
    }, 300);
  }, delay);
}