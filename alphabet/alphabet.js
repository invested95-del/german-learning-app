/* ============================================
   DEUTSCH LERNEN – alphabet/alphabet.js
   ============================================ */

const ALPHABET = [
  {letter:'A',name:'Ah'     },{letter:'B',name:'Beh'    },{letter:'C',name:'Tseh'   },
  {letter:'D',name:'Deh'    },{letter:'E',name:'Eh'     },{letter:'F',name:'Ef'     },
  {letter:'G',name:'Geh'    },{letter:'H',name:'Hah'    },{letter:'I',name:'Ih'     },
  {letter:'J',name:'Yot'    },{letter:'K',name:'Kah'    },{letter:'L',name:'El'     },
  {letter:'M',name:'Em'     },{letter:'N',name:'En'     },{letter:'O',name:'Oh'     },
  {letter:'P',name:'Peh'    },{letter:'Q',name:'Kuh'    },{letter:'R',name:'Er'     },
  {letter:'S',name:'Es'     },{letter:'T',name:'Teh'    },{letter:'U',name:'Uh'     },
  {letter:'V',name:'Fau'    },{letter:'W',name:'Weh'    },{letter:'X',name:'Iks'    },
  {letter:'Y',name:'Ypsilon'},{letter:'Z',name:'Tset'   },
];

const SPECIAL = [
  {letter:'Ä',name:'Ah-Umlaut'},{letter:'Ö',name:'Oh-Umlaut'},
  {letter:'Ü',name:'Uh-Umlaut'},{letter:'ß',name:'Eszett'   },
];

const TOTAL         = ALPHABET.length + SPECIAL.length; // 30
const playedLetters = new Set();

document.addEventListener('DOMContentLoaded', () => {
  // Build real cards (hidden)
  renderGrid('real-letters', ALPHABET, false);
  renderGrid('real-specials', SPECIAL, true);
  updateProgress(0, TOTAL);

  // Reveal skeleton → real after short delay
  setTimeout(() => {
    const sk = document.getElementById('skeleton-letters');
    if (sk) {
      sk.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => {
        sk.style.display = 'none';
        const real = document.getElementById('real-letters');
        if (real) { real.style.display = ''; }
        const special = document.getElementById('special-section');
        if (special) { special.style.display = ''; }
      }, 300);
    }
  }, 400);
});

function renderGrid(containerId, letters, isSpecial) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  letters.forEach(({letter, name}) => {
    const audioSrc = `../audio/alphabet/${letter.toLowerCase()}.mp3`;
    const card = document.createElement('div');
    card.className = 'letter-card';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label', `Letter ${letter}, ${name}`);
    card.innerHTML = `
      <span class="letter-big">${letter}</span>
      <span class="letter-name">${name}</span>
      <span class="letter-check">✅</span>
    `;
    card.addEventListener('click',   () => handleClick(card, letter, name, audioSrc));
    card.addEventListener('keydown', (e) => {
      if (e.key==='Enter'||e.key===' ') { e.preventDefault(); handleClick(card, letter, name, audioSrc); }
    });
    grid.appendChild(card);
  });
}

function handleClick(card, letter, name, audioSrc) {
  document.querySelectorAll('.letter-card.playing').forEach(c => c.classList.remove('playing'));
  card.classList.add('playing');
  setNowPlaying(`🔊 Playing: "${letter}" — ${name}`, true);

  playAudio(audioSrc,
    () => card.classList.add('playing'),
    () => {
      card.classList.remove('playing');
      if (!playedLetters.has(letter)) {
        playedLetters.add(letter);
        card.classList.add('played');
      }
      setNowPlaying(`✅ "${letter}" — ${name}. Click another letter!`, false);
      updateProgress(playedLetters.size, TOTAL);
    }
  );
}