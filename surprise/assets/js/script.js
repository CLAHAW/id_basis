// JS: Steuerung der Animation
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('surpriseBtn');
  const bird = document.getElementById('bird');
  const stage = document.getElementById('stage');

  let started = false;

  btn.addEventListener('click', () => {
    if (started) return; // nur einmal starten
    started = true;

    // Visuelles: Button verschwinden lassen (kleine Animation)
    btn.style.transition = 'opacity .25s ease, transform .25s ease';
    btn.style.opacity = '0';
    btn.style.transform = 'scale(.9)';
    btn.setAttribute('aria-hidden', 'true');

    // kurz warten, dann Vogel sichtbar machen und Animation starten
    // (kein background async work — wir tun das sofort)
    bird.classList.add('animate');
    bird.setAttribute('aria-hidden', 'false');

    // optional: nachdem die Vogel-Animation vollständig durch ist, entfernen wir das Element
    // birdFlyAway läuft 1.2s und beginnt nach 2s -> Gesamt etwa 3.2s.
    const totalDurationMs = 3200;
    setTimeout(() => {
      // Vogel bleibt außerhalb, wir entfernen ihn aus dem DOM (sauber)
      try {
        bird.style.display = 'none';
        bird.setAttribute('aria-hidden', 'true');
      } catch(e){}
    }, totalDurationMs + 100);
  });

  // Accessibility: Enter/Space auf Button ebenfalls triggern (standard, aber sicherheitshalber)
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});
