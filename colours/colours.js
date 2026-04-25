/* ============================================
   DEUTSCH LERNEN – colours/colours.js
   ============================================ */

const COLOURS = [
  { german:'Rot',      english:'Red',       hex:'#EF4444', emoji:'🔴', key:'rot'      },
  { german:'Blau',     english:'Blue',      hex:'#3B82F6', emoji:'🔵', key:'blau'     },
  { german:'Grün',     english:'Green',     hex:'#22C55E', emoji:'🟢', key:'gruen'    },
  { german:'Gelb',     english:'Yellow',    hex:'#EAB308', emoji:'🟡', key:'gelb'     },
  { german:'Orange',   english:'Orange',    hex:'#F97316', emoji:'🟠', key:'orange'   },
  { german:'Lila',     english:'Purple',    hex:'#A855F7', emoji:'🟣', key:'lila'     },
  { german:'Rosa',     english:'Pink',      hex:'#EC4899', emoji:'🌸', key:'rosa'     },
  { german:'Braun',    english:'Brown',     hex:'#92400E', emoji:'🟤', key:'braun'    },
  { german:'Schwarz',  english:'Black',     hex:'#1A1A2E', emoji:'⚫', key:'schwarz'  },
  { german:'Weiß',     english:'White',     hex:'#F8FAFC', emoji:'⚪', key:'weiss'    },
  { german:'Grau',     english:'Grey',      hex:'#6B7280', emoji:'🩶', key:'grau'     },
  { german:'Türkis',   english:'Turquoise', hex:'#14B8A6', emoji:'🩵', key:'tuerkis'  },
  { german:'Gold',     english:'Gold',      hex:'#D97706', emoji:'🌟', key:'gold'     },
  { german:'Silber',   english:'Silver',    hex:'#94A3B8', emoji:'🥈', key:'silber'   },
  { german:'Beige',    english:'Beige',     hex:'#D4B896', emoji:'🫙', key:'beige'    },
];

const TOTAL         = COLOURS.length;
const playedColours = new Set();

document.addEventListener('DOMContentLoaded', () => {
  renderColours();
  updateProgress(0, TOTAL);

  // Skeleton → real reveal
  setTimeout(() => {
    const sk = document.getElementById('skeleton-colours');
    if (sk) {
      sk.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => {
        sk.style.display = 'none';
        const real = document.getElementById('real-colours');
        if (real) { real.style.display = ''; real.style.animation = 'fadeSlideUp .4s ease both'; }
      }, 300);
    }
  }, 400);
});

function renderColours() {
  const grid = document.getElementById('real-colours');
  if (!grid) return;

  COLOURS.forEach(({german, english, hex, emoji, key}) => {
    const audioSrc = `../audio/colour/${key}.mp3`;

    // Determine text colour on swatch (white text for dark backgrounds)
    const isDark = isDarkColor(hex);
    const textCol = isDark ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.55)';

    const card = document.createElement('div');
    card.className = 'colour-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${german} — ${english}`);
    card.setAttribute('data-colour', key);

    card.innerHTML = `
      <div class="colour-swatch" style="background:${hex}; color:${textCol};">
        <span style="font-size:2rem">${emoji}</span>
        <span class="wave-icon">🔊</span>
      </div>
      <div class="colour-body">
        <span class="colour-german">${german}</span>
        <span class="colour-english">${english}</span>
      </div>
      <span class="colour-check">✅</span>
    `;

    // Playing glow uses the card's own colour
    card.addEventListener('click',   () => handleClick(card, german, english, hex, audioSrc));
    card.addEventListener('keydown', (e) => {
      if (e.key==='Enter'||e.key===' ') { e.preventDefault(); handleClick(card, german, english, hex, audioSrc); }
    });

    grid.appendChild(card);
  });
}

function handleClick(card, german, english, hex, audioSrc) {
  // Remove playing from all cards
  document.querySelectorAll('.colour-card.playing').forEach(c => {
    c.classList.remove('playing');
    c.style.boxShadow = '';
  });

  card.classList.add('playing');
  // Coloured glow matching the swatch
  card.style.boxShadow = `0 0 0 4px ${hex}55, 0 16px 48px rgba(0,0,0,.18)`;
  setNowPlaying(`🔊 Playing: "${german}" — ${english}`, true);

  playAudio(audioSrc,
    () => { card.classList.add('playing'); },
    () => {
      card.classList.remove('playing');
      card.style.boxShadow = '';
      if (!playedColours.has(german)) {
        playedColours.add(german);
        card.classList.add('played');
      }
      setNowPlaying(`✅ "${german}" — ${english}. Click another colour!`, false);
      updateProgress(playedColours.size, TOTAL);
    }
  );
}

/* ── Utility: is a hex colour dark? ── */
function isDarkColor(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  // Relative luminance
  return (r*299 + g*587 + b*114) / 1000 < 128;
}