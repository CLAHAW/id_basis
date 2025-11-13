const shutterButton = document.querySelector('.shutter-button');
const flashOverlay = document.querySelector('.flash-overlay');
const photo = document.querySelector('.photo');
const photoImage = document.querySelector('.photo-image');
const photoLabel = document.querySelector('.photo-label');

const scenes = [
  {
    label: 'Grüne Hexe',
    aria: 'Ein freundliches grünes Hexengesicht mit Hut',
    svg: `
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="160" fill="#1b1038" />
        <path d="M20 68 L140 68 L124 36 L36 36 Z" fill="#3b2a60" />
        <path d="M32 68 L128 68 L120 48 L40 48 Z" fill="#5a3d8c" />
        <ellipse cx="80" cy="100" rx="58" ry="50" fill="#3fa870" />
        <ellipse cx="56" cy="96" rx="12" ry="10" fill="#ffffff" />
        <ellipse cx="104" cy="96" rx="12" ry="10" fill="#ffffff" />
        <circle cx="56" cy="96" r="5" fill="#1b3a2f" />
        <circle cx="104" cy="96" r="5" fill="#1b3a2f" />
        <path d="M72 118 Q80 126 88 118" stroke="#1b3a2f" stroke-width="5" fill="none" stroke-linecap="round" />
        <path d="M80 80 Q90 74 100 80" stroke="#1b3a2f" stroke-width="5" fill="none" stroke-linecap="round" />
        <path d="M60 80 Q70 74 80 80" stroke="#1b3a2f" stroke-width="5" fill="none" stroke-linecap="round" />
      </svg>
    `,
  },
  {
    label: 'Hund',
    aria: 'Ein fröhlicher Hund mit Schlappohren',
    svg: `
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="160" fill="#fff5d7" />
        <ellipse cx="50" cy="72" rx="34" ry="40" fill="#d0a676" />
        <ellipse cx="110" cy="72" rx="34" ry="40" fill="#d0a676" />
        <ellipse cx="80" cy="92" rx="50" ry="52" fill="#f1c191" />
        <circle cx="64" cy="88" r="9" fill="#2d2217" />
        <circle cx="96" cy="88" r="9" fill="#2d2217" />
        <path d="M70 120 Q80 132 90 120" stroke="#2d2217" stroke-width="6" fill="none" stroke-linecap="round" />
        <path d="M80 100 Q80 112 72 118 Q80 126 88 118 Q80 112 80 100" fill="#2d2217" />
      </svg>
    `,
  },
  {
    label: 'Gesicht',
    aria: 'Ein menschliches Gesicht mit breitem Grinsen',
    svg: `
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="160" fill="#cbe2ff" />
        <ellipse cx="80" cy="92" rx="56" ry="60" fill="#f4d3b3" />
        <ellipse cx="54" cy="82" rx="10" ry="12" fill="#ffffff" />
        <ellipse cx="106" cy="82" rx="10" ry="12" fill="#ffffff" />
        <circle cx="54" cy="82" r="4" fill="#222222" />
        <circle cx="106" cy="82" r="4" fill="#222222" />
        <path d="M60 62 Q80 46 100 62" stroke="#222222" stroke-width="5" fill="none" stroke-linecap="round" />
        <path d="M52 120 Q80 140 108 120" stroke="#a54a3a" stroke-width="8" fill="#f27d72" stroke-linecap="round" />
      </svg>
    `,
  },
];

let busy = false;
let audioContext;

function triggerFlash() {
  flashOverlay.classList.remove('flash');
  // Force reflow to restart animation
  // eslint-disable-next-line no-unused-expressions
  void flashOverlay.offsetWidth;
  flashOverlay.classList.add('flash');
}

function playShutterSound() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain).connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  } catch (error) {
    console.error('Konnte den Auslöser-Sound nicht abspielen.', error);
  }
}

function showScene(scene) {
  photoImage.innerHTML = scene.svg;
  photoImage.setAttribute('aria-label', scene.aria);
  photoLabel.textContent = scene.label;
}

function resetPhoto() {
  photo.classList.remove('photo--printing', 'photo--visible', 'photo--developed');
  photoImage.innerHTML = '';
  photoImage.removeAttribute('aria-label');
  photoLabel.textContent = '';
}

function handleShutter() {
  if (busy) {
    return;
  }

  busy = true;
  resetPhoto();

  const scene = scenes[Math.floor(Math.random() * scenes.length)];
  showScene(scene);

  triggerFlash();
  playShutterSound();

  requestAnimationFrame(() => {
    photo.classList.add('photo--printing');
  });

  setTimeout(() => {
    photo.classList.add('photo--visible');
  }, 1800);

  setTimeout(() => {
    photo.classList.add('photo--developed');
  }, 3200);

  setTimeout(() => {
    busy = false;
  }, 5200);
}

shutterButton.addEventListener('click', handleShutter);
