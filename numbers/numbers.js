/* ============================================
   DEUTSCH LERNEN – numbers/numbers.js
   ============================================ */

const NUMBERS = [
  {digit:1, german:'Eins',     english:'One'      },
  {digit:2, german:'Zwei',     english:'Two'      },
  {digit:3, german:'Drei',     english:'Three'    },
  {digit:4, german:'Vier',     english:'Four'     },
  {digit:5, german:'Fünf',     english:'Five'     },
  {digit:6, german:'Sechs',    english:'Six'      },
  {digit:7, german:'Sieben',   english:'Seven'    },
  {digit:8, german:'Acht',     english:'Eight'    },
  {digit:9, german:'Neun',     english:'Nine'     },
  {digit:10,german:'Zehn',     english:'Ten'      },
  {digit:11,german:'Elf',      english:'Eleven'   },
  {digit:12,german:'Zwölf',    english:'Twelve'   },
  {digit:13,german:'Dreizehn', english:'Thirteen' },
  {digit:14,german:'Vierzehn', english:'Fourteen' },
  {digit:15,german:'Fünfzehn', english:'Fifteen'  },
  {digit:16,german:'Sechzehn', english:'Sixteen'  },
  {digit:17,german:'Siebzehn', english:'Seventeen'},
  {digit:18,german:'Achtzehn', english:'Eighteen' },
  {digit:19,german:'Neunzehn', english:'Nineteen' },
  {digit:20,german:'Zwanzig',  english:'Twenty'   },
];

const TOTAL          = NUMBERS.length;
const playedNumbers  = new Set();

document.addEventListener('DOMContentLoaded', () => {
  renderNumbers();
  updateProgress(0, TOTAL);

  // Skeleton → real reveal
  setTimeout(() => {
    const sk = document.getElementById('skeleton-numbers');
    if (sk) {
      sk.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => {
        sk.style.display = 'none';
        const real = document.getElementById('real-numbers');
        if (real) { real.style.display = ''; real.style.animation = 'fadeSlideUp .4s ease both'; }
      }, 300);
    }
  }, 400);
});

function renderNumbers() {
  const grid = document.getElementById('real-numbers');
  if (!grid) return;

  NUMBERS.forEach(({digit, german, english}) => {
    const audioSrc = `../audio/number/${digit}.mp3`;
    const card = document.createElement('div');
    card.className = 'num-card';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label',`Number ${digit}, ${german}`);
    card.innerHTML = `
      <span class="num-digit">${digit}</span>
      <span class="num-german">${german}</span>
      <span class="num-english">${english}</span>
      <span class="num-check">✅</span>
      <span class="num-bar"></span>
    `;
    card.addEventListener('click',   () => handleClick(card, digit, german, audioSrc));
    card.addEventListener('keydown', (e) => {
      if (e.key==='Enter'||e.key===' ') { e.preventDefault(); handleClick(card, digit, german, audioSrc); }
    });
    grid.appendChild(card);
  });
}

function handleClick(card, digit, german, audioSrc) {
  document.querySelectorAll('.num-card.playing').forEach(c => c.classList.remove('playing'));
  card.classList.add('playing');
  setNowPlaying(`🔊 Playing: ${digit} — "${german}"`, true);

  playAudio(audioSrc,
    () => card.classList.add('playing'),
    () => {
      card.classList.remove('playing');
      if (!playedNumbers.has(digit)) {
        playedNumbers.add(digit);
        card.classList.add('played');
      }
      setNowPlaying(`✅ ${digit} — "${german}". Click another number!`, false);
      updateProgress(playedNumbers.size, TOTAL);
    }
  );
}