// ============================================================
//   Club C — interactivity + Tweaks panel
// ============================================================

// --- FAQ ---
function toggleFaq(btn) {
  const item = btn.parentElement;
  item.classList.toggle('open');
}
window.toggleFaq = toggleFaq;

// --- Reveal on scroll ---
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.style.opacity = '';
      e.target.style.transform = '';
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.10 });
document.querySelectorAll('.pain-card, .audience-card, .fase, .include-card, .testimonial, .lograr-list li, .faq-item').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObs.observe(el);
});

// ============================================================
//   TWEAKS PANEL
// ============================================================
const COLOR_PRESETS = {
  primary:   ['#3a4f8f', '#1a2547', '#2a3a6b', '#4a6bc0', '#374b73'],
  secondary: ['#7db5e8', '#5a99d4', '#a8cef0', '#6fa9d8', '#b5d3ef'],
  tertiary:  ['#f4b8a3', '#e89a82', '#f9d7c8', '#d97f63', '#f5c1ad'],
  accessory: ['#f7f6f3', '#ffffff', '#f0ede5', '#ebe7da', '#fafaf7']
};

const TWEAKS_STATE = { ...window.TWEAKS };

function applyTweaks() {
  const t = TWEAKS_STATE;
  const root = document.documentElement;

  root.style.setProperty('--primary', t.primary);
  root.style.setProperty('--secondary', t.secondary);
  root.style.setProperty('--tertiary', t.tertiary);
  root.style.setProperty('--accessory', t.accessory);
  root.style.setProperty('--ink', t.ink);

  // headline scale
  root.style.setProperty('--headline-scale', t.headlineScale ?? t.headlineSize ?? 1);

  // button shape
  root.style.setProperty('--btn-radius', t.buttonShape === 'square' ? '6px' : (t.buttonShape === 'rounded' ? '16px' : '999px'));

  // Photo
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    const path = ({
      'team-beach': 'assets/team-beach.jpg',
      'team-park': 'assets/team-park.jpg',
      'community': 'assets/community-class.jpg',
      'cate': 'assets/cate-portrait.jpg'
    })[t.heroPhoto] || 'assets/team-beach.jpg';
    heroImg.src = path;
  }

  // headline text
  document.querySelectorAll('[data-tweak="headline"]').forEach(el => {
    el.innerHTML = htmlizeHeadline(t.headline);
  });
  document.querySelectorAll('[data-tweak="headlineScript"]').forEach(el => {
    el.innerHTML = t.headlineScript.replace(/\n/g, '<br/>');
  });
  document.querySelectorAll('[data-tweak="ctaPrimary"]').forEach(el => {
    el.textContent = t.ctaPrimary;
  });
  document.querySelectorAll('[data-tweak="duration"]').forEach(el => {
    const match = t.duration.match(/(\d+)\s*(\w+)?/);
    if (match) {
      el.innerHTML = `${match[1]}<small>${match[2] || 'sem.'}</small>`;
    } else { el.textContent = t.duration; }
  });

  // marquee toggle
  document.getElementById('marquee')?.classList.toggle('hidden', !t.showMarquee);

  // community section toggle
  document.querySelector('.lograr')?.classList.toggle('hidden', !t.showCommunity);
}

function htmlizeHeadline(text) {
  // Allow simple markup: *italic* and accent words remain as plain bold uppercase
  // Auto-detect last word as coral accent if it ends with period
  // Just keep text as-is but wrap last "word." in coral-em
  const trimmed = text.trim();
  // If contains <em> already, just return
  if (/<em/.test(trimmed)) return trimmed.replace(/\n/g, '<br/>');
  // wrap final word with period in em.accent-coral
  const m = trimmed.match(/^(.*?)(\S+\.)\s*$/s);
  if (m) {
    return (m[1] + `<em class="accent-coral">${m[2]}</em>`).replace(/\n/g, '<br/>');
  }
  return trimmed.replace(/\n/g, '<br/>');
}

function persistTweaks(partial) {
  Object.assign(TWEAKS_STATE, partial);
  applyTweaks();
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: partial }, '*');
  } catch(e){}
}

// ---- Panel UI ----
function buildPanel() {
  const root = document.getElementById('tweaks-root');
  root.innerHTML = `
    <div class="tweaks-panel" id="tweaks-panel">
      <div class="tweaks-header">
        <h3>Tweaks · Club C</h3>
        <button class="tweaks-close" id="tweaks-close" aria-label="Cerrar">✕</button>
      </div>
      <div class="tweaks-body">

        <div class="tweak-section">
          <div class="tweak-section-title">Colores de marca</div>

          <div class="tweak-row">
            <div class="tweak-label">Primario · Navy</div>
            <div class="color-swatches" data-key="primary">
              ${COLOR_PRESETS.primary.map(c => `<button class="color-swatch" data-color="${c}" style="background:${c}"></button>`).join('')}
            </div>
          </div>

          <div class="tweak-row">
            <div class="tweak-label">Secundario · Celeste</div>
            <div class="color-swatches" data-key="secondary">
              ${COLOR_PRESETS.secondary.map(c => `<button class="color-swatch" data-color="${c}" style="background:${c}"></button>`).join('')}
            </div>
          </div>

          <div class="tweak-row">
            <div class="tweak-label">Terciario · Coral</div>
            <div class="color-swatches" data-key="tertiary">
              ${COLOR_PRESETS.tertiary.map(c => `<button class="color-swatch" data-color="${c}" style="background:${c}"></button>`).join('')}
            </div>
          </div>

          <div class="tweak-row">
            <div class="tweak-label">Accesorio · Crema</div>
            <div class="color-swatches" data-key="accessory">
              ${COLOR_PRESETS.accessory.map(c => `<button class="color-swatch" data-color="${c}" style="background:${c}"></button>`).join('')}
            </div>
          </div>
        </div>

        <div class="tweak-section">
          <div class="tweak-section-title">Tipografía</div>
          <div class="tweak-row">
            <div class="tweak-label">Escala de titulares</div>
            <input type="range" min="0.7" max="1.25" step="0.05" id="t-scale" value="${TWEAKS_STATE.headlineSize || 1}" />
          </div>
          <div class="tweak-row">
            <div class="tweak-label">Forma de botón</div>
            <div class="tweak-radios" data-key="buttonShape">
              <button data-value="pill">Pill</button>
              <button data-value="rounded">Redondo</button>
              <button data-value="square">Recto</button>
            </div>
          </div>
        </div>

        <div class="tweak-section">
          <div class="tweak-section-title">Copy</div>
          <div class="tweak-row">
            <div class="tweak-label">Headline principal</div>
            <input type="text" id="t-headline" value="${escapeAttr(TWEAKS_STATE.headline)}" />
          </div>
          <div class="tweak-row">
            <div class="tweak-label">Subtítulo manuscrito</div>
            <input type="text" id="t-script" value="${escapeAttr(TWEAKS_STATE.headlineScript)}" />
          </div>
          <div class="tweak-row">
            <div class="tweak-label">Texto del CTA</div>
            <input type="text" id="t-cta" value="${escapeAttr(TWEAKS_STATE.ctaPrimary)}" />
          </div>
          <div class="tweak-row">
            <div class="tweak-label">Duración</div>
            <input type="text" id="t-duration" value="${escapeAttr(TWEAKS_STATE.duration)}" />
          </div>
        </div>

        <div class="tweak-section">
          <div class="tweak-section-title">Hero</div>
          <div class="tweak-row">
            <div class="tweak-label">Foto del hero</div>
            <div class="tweak-radios" data-key="heroPhoto">
              <button data-value="team-beach">Beach</button>
              <button data-value="team-park">Park</button>
              <button data-value="community">Clase</button>
              <button data-value="cate">Cate</button>
            </div>
          </div>
        </div>

        <div class="tweak-section">
          <div class="tweak-section-title">Secciones</div>
          <div class="tweak-toggle">
            <div class="tweak-label">Marquee de valores</div>
            <div class="tweak-switch ${TWEAKS_STATE.showMarquee ? 'on' : ''}" data-key="showMarquee"></div>
          </div>
          <div class="tweak-toggle">
            <div class="tweak-label">Sección "Qué vas a lograr"</div>
            <div class="tweak-switch ${TWEAKS_STATE.showCommunity ? 'on' : ''}" data-key="showCommunity"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // bind interactions
  root.querySelector('#tweaks-close').onclick = () => {
    root.querySelector('#tweaks-panel').classList.remove('open');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch(e){}
  };

  root.querySelectorAll('.color-swatches').forEach(group => {
    const key = group.dataset.key;
    const current = TWEAKS_STATE[key];
    group.querySelectorAll('.color-swatch').forEach(sw => {
      if (current && sw.dataset.color.toLowerCase() === String(current).toLowerCase()) sw.classList.add('active');
      sw.onclick = () => {
        group.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        persistTweaks({ [key]: sw.dataset.color });
      };
    });
  });

  root.querySelectorAll('.tweak-radios').forEach(group => {
    const key = group.dataset.key;
    const current = TWEAKS_STATE[key];
    group.querySelectorAll('button').forEach(b => {
      if (b.dataset.value === current) b.classList.add('active');
      b.onclick = () => {
        group.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        persistTweaks({ [key]: b.dataset.value });
      };
    });
  });

  root.querySelectorAll('.tweak-switch').forEach(sw => {
    const key = sw.dataset.key;
    sw.onclick = () => {
      const next = !TWEAKS_STATE[key];
      sw.classList.toggle('on', next);
      persistTweaks({ [key]: next });
    };
  });

  // sliders + text
  const scaleInput = root.querySelector('#t-scale');
  scaleInput.oninput = (e) => persistTweaks({ headlineSize: parseFloat(e.target.value) });
  const debounce = (fn, ms = 300) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  };
  root.querySelector('#t-headline').oninput = debounce((e) => persistTweaks({ headline: e.target.value }));
  root.querySelector('#t-script').oninput = debounce((e) => persistTweaks({ headlineScript: e.target.value }));
  root.querySelector('#t-cta').oninput = debounce((e) => persistTweaks({ ctaPrimary: e.target.value }));
  root.querySelector('#t-duration').oninput = debounce((e) => persistTweaks({ duration: e.target.value }));
}

function escapeAttr(s) {
  return String(s || '').replace(/"/g, '&quot;');
}

// ---- Edit mode protocol ----
window.addEventListener('message', (e) => {
  if (!e.data || !e.data.type) return;
  if (e.data.type === '__activate_edit_mode') {
    document.getElementById('tweaks-panel')?.classList.add('open');
  }
  if (e.data.type === '__deactivate_edit_mode') {
    document.getElementById('tweaks-panel')?.classList.remove('open');
  }
});

// init
buildPanel();
applyTweaks();
try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e){}

// ============================================================
//   TESTIMONIAL VIDEO MODAL (Panda Video)
// ============================================================
(function () {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('video-modal-player');
  if (!modal || !player) return;

  function open(library, videoId) {
    if (!library || !videoId || library.startsWith('REPLACE_') || videoId.startsWith('REPLACE_')) {
      console.warn('[Club C] Falta configurar el embed de Panda Video para este testimonio.');
      return;
    }
    const src = `https://player-${library}.tv.pandavideo.com.br/embed/?v=${encodeURIComponent(videoId)}`;
    player.innerHTML = `<iframe src="${src}" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('video-modal-open');
  }

  function close() {
    player.innerHTML = '';
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('video-modal-open');
  }

  document.querySelectorAll('.testimonial-video-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      open(btn.dataset.pandaLibrary, btn.dataset.pandaVideo);
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('video-modal-close')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();

// ============================================================
//   GHL POPUP BRIDGE
//   GHL's Popup element doesn't support an "On click" trigger.
//   Workaround: in the GHL page builder, add a hidden native Button
//   with action "On Click → Open Popup" and assign it the custom
//   class .gh-popup-trigger. The handler below intercepts clicks on
//   any [data-open-form] CTA and programmatically clicks the hidden
//   GHL button, so the popup opens through GHL's own handler and the
//   funnel records the conversion natively.
// ============================================================
(function () {
  function fireGhlPopup() {
    var wrappers = document.querySelectorAll('.gh-popup-trigger');
    for (var i = 0; i < wrappers.length; i++) {
      var w = wrappers[i];
      var clickable = w.matches('a, button') ? w : w.querySelector('a, button');
      if (clickable) { clickable.click(); return true; }
    }
    return false;
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-open-form]');
    if (!trigger) return;
    e.preventDefault();
    fireGhlPopup();
  });
})();
