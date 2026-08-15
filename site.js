// Snurrande vinyl (om den finns på sidan)
document.addEventListener('DOMContentLoaded', () => {
  const platter = document.getElementById('platter');

  // ---------- Ljud: helt egen, kodgenererad beat (kick, klapp, hi-hat, shaker, bas) ----------
  // Allt nedan syntetiseras matematiskt i webbläsaren — ingen sample, ingen låt,
  // ingen fil. Det finns inget upphovsrättsligt verk inblandat överhuvudtaget.
  // Vill du ISTÄLLET spela en riktig låt du själv har rättigheter till: lägg din
  // mp3 i projektet (t.ex. audio/demo.mp3) och byt ut hela ljudblocket mot:
  //
  //   const track = new Audio('audio/demo.mp3');
  //   track.loop = true;
  //   track.preservesPitch = false; track.mozPreservesPitch = false; track.webkitPreservesPitch = false;
  //   // vid play:  track.play();  vid paus: track.pause();
  //   // vid regel-ändring: track.playbackRate = 9 / dur;   (samma formel som nedan)
  //
  let audioCtx, grooveBuffer, grooveSource, grooveGain;

  function buildGrooveBuffer(ctx) {
    const sr = ctx.sampleRate;
    const bpm = 104, beatSec = 60 / bpm;
    const bars = 2, stepsPerBeat = 4, dur = bars * 4 * beatSec;
    const stepSec = beatSec / stepsPerBeat;

    // enkel, egenkomponerad basslinje (två takter, world/afrobeat-doftande)
    const bassPattern = [110.0, 0, 130.81, 0, 98.0, 0, 146.83, 110.0,
                          110.0, 0, 123.47, 0, 98.0, 0, 130.81, 0];

    const buffer = ctx.createBuffer(2, Math.floor(sr * dur), sr);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        const t = i / sr;
        const beat = Math.floor(t / beatSec) % 4;
        const beatPhase = (t % beatSec) / beatSec;
        const step = Math.floor(t / stepSec) % bassPattern.length;
        const stepPhase = (t % stepSec) / stepSec;
        let s = 0;

        // kick på 1 och 3
        if ((beat === 0 || beat === 2) && beatPhase < 0.14) {
          const env = Math.exp(-beatPhase * 22);
          s += Math.sin(2 * Math.PI * 58 * t) * env * 0.85;
        }
        // klapp/snare på 2 och 4 (filtrerat brus)
        if ((beat === 1 || beat === 3) && beatPhase < 0.16) {
          const env = Math.exp(-beatPhase * 16);
          s += (Math.random() * 2 - 1) * env * 0.35;
        }
        // hi-hat varannan åttondel
        const hatPhase = (t % (beatSec / 2)) / (beatSec / 2);
        if (hatPhase < 0.045) {
          s += (Math.random() * 2 - 1) * Math.exp(-hatPhase * 90) * 0.14;
        }
        // shaker, sextondelar, mjukare
        if (stepPhase < 0.05) {
          s += (Math.random() * 2 - 1) * Math.exp(-stepPhase * 60) * 0.06;
        }
        // basslinje — plockad ton per steg
        const bassFreq = bassPattern[step];
        if (bassFreq > 0) {
          const env = Math.exp(-stepPhase * 6.5);
          s += Math.sin(2 * Math.PI * bassFreq * t) * env * 0.4;
          s += Math.sin(2 * Math.PI * bassFreq * 2 * t) * env * 0.08; // liten övertonsfärg
        }
        // svagt nålbrus för vinylkänsla
        s += (Math.random() * 2 - 1) * 0.008;

        data[i] = s * 0.95;
      }
    }
    return buffer;
  }

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      grooveBuffer = buildGrooveBuffer(audioCtx);
    }
  }

  function playGroove(rate) {
    ensureAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    stopGroove();
    grooveSource = audioCtx.createBufferSource();
    grooveSource.buffer = grooveBuffer;
    grooveSource.loop = true;
    grooveSource.playbackRate.value = rate;
    grooveGain = audioCtx.createGain();
    grooveGain.gain.value = 0;
    grooveSource.connect(grooveGain).connect(audioCtx.destination);
    grooveSource.start();
    grooveGain.gain.linearRampToValueAtTime(0.55, audioCtx.currentTime + 0.15);
  }

  function stopGroove() {
    if (grooveSource) {
      const src = grooveSource, gain = grooveGain;
      if (gain) gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.12);
      setTimeout(() => { try { src.stop(); } catch (e) {} src.disconnect(); }, 160);
      grooveSource = null;
    }
  }

  function currentRate() {
    const dur = pitchFader ? parseFloat(pitchFader.value) : 9;
    return 9 / dur; // 9s = normaltempo (rate 1.0)
  }

  if (platter) {
    platter.addEventListener('click', () => {
      const isPlaying = platter.classList.toggle('playing');
      if (isPlaying) playGroove(currentRate()); else stopGroove();
    });
  }

  // DJ-regel: styr skivans rotationshastighet OCH ljudets tonhöjd/tempo live
  const pitchFader = document.getElementById('pitchFader');
  const pitchReadout = document.getElementById('pitchReadout');
  if (platter && pitchFader) {
    const updateSpeed = (val) => {
      const dur = parseFloat(val);
      platter.style.setProperty('--spin-dur', dur + 's');
      if (pitchReadout) {
        const rpm = (33.3 * (9 / dur)).toFixed(1);
        pitchReadout.textContent = dur.toFixed(1) + 's / varv · ' + rpm + ' RPM';
      }
      if (grooveSource) grooveSource.playbackRate.value = 9 / dur;
    };
    updateSpeed(pitchFader.value);
    pitchFader.addEventListener('input', (e) => updateSpeed(e.target.value));
  }

  // Kontaktformulär (statisk sida — ingen backend, ger bara visuell bekräftelse)
  const contactBtn = document.querySelector('.contact-form button');
  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contactBtn.textContent = 'Tack! Vi hör av oss.';
      contactBtn.disabled = true;
    });
  }

  // Koppla "Köp nu"-knappar till Stripe Payment Links, se stripe-config.js
  document.querySelectorAll('.buy-btn[data-stripe]').forEach(btn => {
    const slug = btn.getAttribute('data-stripe');
    const url = (typeof STRIPE_LINKS !== 'undefined') ? STRIPE_LINKS[slug] : '';
    if (url && url.trim() !== '') {
      btn.href = url.trim();
      btn.target = '_blank';
      btn.rel = 'noopener';
    } else {
      btn.classList.add('soon');
      btn.textContent = 'Kommer snart';
      btn.addEventListener('click', (e) => e.preventDefault());
    }
  });

  // Markera aktiv sida i menyn
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.links a, .mobile-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Mobilmeny
  const toggle = document.querySelector('.mobile-toggle');
  const mobileLinks = document.querySelector('.mobile-links');
  if (toggle && mobileLinks) {
    toggle.addEventListener('click', () => mobileLinks.classList.toggle('open'));
  }
});
