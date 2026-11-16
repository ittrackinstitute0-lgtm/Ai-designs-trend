/**
 * AI DESIGN TREND RADAR - CLIENT APPLICATION & TELEMETRY ENGINE
 * Automates 6h trend sweeps, 12h inspiration drops, and 24h AI intelligence records.
 * Features 3D tilt cards, interactive constellation canvas, audio synthesizer, and radar acoustics.
 */

(function () {
  'use strict';

  // --- CONFIGURATION & TIME CONSTANTS ---
  const STORAGE_KEY = 'ai_design_trend_radar_telemetry_v1';

  // Real-world intervals (in milliseconds)
  const REALTIME_INTERVALS = {
    TRENDS: 6 * 60 * 60 * 1000,       // 6 hours
    INSPIRATIONS: 12 * 60 * 60 * 1000, // 12 hours
    RECORDS: 24 * 60 * 60 * 1000      // 24 hours
  };

  // Fast demo mode intervals (for testing and demonstration)
  const DEMO_INTERVALS = {
    TRENDS: 15 * 1000,                 // 15 seconds
    INSPIRATIONS: 30 * 1000,           // 30 seconds
    RECORDS: 60 * 1000                // 60 seconds
  };

  // --- AUDIO SYNTHESIZER (Web Audio API - Zero Asset Dependency) ---
  class RadarAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }

    playBlip(freq = 880, duration = 0.08) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playSonarEcho(freq = 1200) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
      } catch (e) {}
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.045, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.18);
        });
      } catch (e) {}
    }
  }

  const audio = new RadarAudio();

  // --- APPLICATION STATE ---
  let state = {
    engineMode: 'realtime', // 'realtime' or 'demo'
    soundEnabled: true,
    lastUpdate: Date.now() - (12 * 60 * 1000),
    lastTrendUpdate: Date.now() - (2 * 60 * 60 * 1000),
    lastInspirationUpdate: Date.now() - (5 * 60 * 60 * 1000),
    lastRecordUpdate: Date.now() - (14 * 60 * 60 * 1000),
    trends: [],
    inspirations: [],
    records: [],
    activeCategory: 'all',
    searchQuery: '',
    sortOrder: 'momentum-desc'
  };

  // --- INITIALIZE STATE FROM LOCALSTORAGE OR DATA SEEDS ---
  function loadPersistedState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state = { ...state, ...parsed };
      } else {
        resetStateToDefaults();
      }
    } catch (e) {
      resetStateToDefaults();
    }
  }

  function resetStateToDefaults() {
    const rawData = window.RADAR_DATA || {};
    state.trends = JSON.parse(JSON.stringify(rawData.INITIAL_TRENDS || []));
    state.inspirations = JSON.parse(JSON.stringify(rawData.INITIAL_INSPIRATIONS || []));
    state.records = JSON.parse(JSON.stringify(rawData.INITIAL_RECORDS || []));
    state.lastUpdate = Date.now() - (4 * 60 * 1000);
    state.lastTrendUpdate = Date.now() - (1.5 * 60 * 60 * 1000);
    state.lastInspirationUpdate = Date.now() - (4 * 60 * 60 * 1000);
    state.lastRecordUpdate = Date.now() - (11 * 60 * 60 * 1000);
    saveState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        engineMode: state.engineMode,
        soundEnabled: state.soundEnabled,
        lastUpdate: state.lastUpdate,
        lastTrendUpdate: state.lastTrendUpdate,
        lastInspirationUpdate: state.lastInspirationUpdate,
        lastRecordUpdate: state.lastRecordUpdate,
        trends: state.trends,
        inspirations: state.inspirations,
        records: state.records
      }));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // --- DATE & TIME FORMATTERS ---
  function formatFullDateTime(timestamp) {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', options);
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    const diffSecs = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSecs < 5) return '(Just now)';
    if (diffSecs < 60) return `(${diffSecs}s ago)`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `(${diffMins}m ago)`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `(${diffHours}h ${diffMins % 60}m ago)`;
    const diffDays = Math.floor(diffHours / 24);
    return `(${diffDays}d ago)`;
  }

  function formatCountdown(msRemaining) {
    if (msRemaining <= 0) return '00:00:00';
    const totalSecs = Math.floor(msRemaining / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // --- HIGH-FIDELITY ANIMATED SVG ARTWORK GENERATOR ---
  function renderSvgArtwork(type, colors = ['#00F5D4', '#7928CA', '#08090D']) {
    const c1 = colors[0] || '#00F5D4';
    const c2 = colors[1] || '#7928CA';
    const c3 = colors[2] || '#08090D';

    switch (type) {
      case 'logo-glass':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" class="animated-svg-glass">
            <defs>
              <linearGradient id="glassGrad-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${c1}" stop-opacity="0.9"/>
                <stop offset="60%" stop-color="${c2}" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2"/>
              </linearGradient>
              <filter id="causticsGlow-${type}" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>
            <circle cx="100" cy="60" r="46" fill="none" stroke="${c1}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4" style="animation: spinLattice 20s linear infinite; transform-origin: 100px 60px;"/>
            <polygon points="100,24 142,88 58,88" fill="url(#glassGrad-${type})" stroke="rgba(255,255,255,0.75)" stroke-width="1.8" filter="url(#causticsGlow-${type})" style="animation: floatCaustic 5s ease-in-out infinite; transform-origin: 100px 60px;"/>
            <circle cx="100" cy="54" r="14" fill="#ffffff" opacity="0.85" filter="drop-shadow(0 0 8px ${c1})"/>
            <line x1="58" y1="88" x2="142" y2="88" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
          </svg>`;

      case 'logo-chisel':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <polygon points="100,18 152,44 152,96 100,108 48,96 48,44" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
            <polygon points="100,18 152,44 100,66 48,44" fill="${c1}" opacity="0.95"/>
            <polygon points="152,44 152,96 100,108 100,66" fill="${c2}" opacity="0.85"/>
            <polygon points="48,44 48,96 100,108 100,66" fill="${c3}" opacity="0.95" stroke="rgba(255,255,255,0.25)"/>
            <line x1="100" y1="18" x2="100" y2="108" stroke="#ffffff" stroke-width="2" opacity="0.75"/>
            <circle cx="100" cy="66" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px ${c1})"/>
          </svg>`;

      case 'logo-lattice':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="${c1}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="animation: floatCaustic 6s ease-in-out infinite; transform-origin: 100px 60px;">
              <polygon points="100,22 138,44 138,82 100,104 62,82 62,44"/>
              <polygon points="100,40 122,52 122,74 100,86 78,74 78,52" stroke="${c2}"/>
              <line x1="100" y1="22" x2="100" y2="40"/>
              <line x1="138" y1="44" x2="122" y2="52"/>
              <line x1="138" y1="82" x2="122" y2="74"/>
              <line x1="100" y1="104" x2="100" y2="86"/>
              <line x1="62" y1="82" x2="78" y2="74"/>
              <line x1="62" y1="44" x2="78" y2="52"/>
            </g>
            <circle cx="100" cy="63" r="6" fill="${c1}" filter="drop-shadow(0 0 8px ${c1})"/>
          </svg>`;

      case 'poster-swiss':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="10" width="150" height="100" rx="4" fill="#0d111a" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
            <line x1="25" y1="36" x2="175" y2="36" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <line x1="85" y1="10" x2="85" y2="110" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <circle cx="55" cy="70" r="22" fill="${c1}" opacity="0.9"/>
            <text x="35" y="27" fill="#ffffff" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="800">SWISS // 2026</text>
            <text x="94" y="55" fill="${c2}" font-family="JetBrains Mono, monospace" font-size="7">SYSTEM: TELEMETRY</text>
            <text x="94" y="70" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="6">LAT: 35.6762° N</text>
            <rect x="94" y="80" width="68" height="14" fill="${c1}" rx="2" opacity="0.25"/>
            <rect x="94" y="80" width="38" height="14" fill="${c1}" rx="2"/>
          </svg>`;

      case 'poster-riso':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="82" cy="55" r="34" fill="${c1}" opacity="0.82" style="mix-blend-mode: screen;"/>
            <circle cx="118" cy="65" r="34" fill="${c2}" opacity="0.82" style="mix-blend-mode: screen;"/>
            <rect x="58" y="28" width="84" height="64" fill="none" stroke="#ffe600" stroke-width="2" stroke-dasharray="4,4"/>
            <text x="100" y="65" fill="#ffffff" font-family="Space Grotesk" font-size="13" font-weight="800" text-anchor="middle">RISO.DITHER</text>
          </svg>`;

      case 'poster-solar':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="48" r="32" fill="${c1}" opacity="0.85"/>
            <path d="M38,106 Q100,74 162,106 L162,110 L38,110 Z" fill="${c3}"/>
            <path d="M68,96 Q100,80 132,96" stroke="#ffffff" stroke-width="1.8" fill="none"/>
            <line x1="100" y1="12" x2="100" y2="84" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="3,3"/>
          </svg>`;

      case 'typo-grotesque':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <text x="100" y="55" fill="${c1}" font-family="Space Grotesk, sans-serif" font-size="28" font-weight="900" text-anchor="middle" letter-spacing="10" style="animation: pulseGlow 4s ease-in-out infinite;">EXPAND</text>
            <text x="100" y="80" fill="rgba(255,255,255,0.45)" font-family="Space Grotesk, sans-serif" font-size="14" font-weight="500" text-anchor="middle" letter-spacing="18">VARIABLE</text>
          </svg>`;

      case 'typo-serif':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <text x="100" y="72" fill="${c1}" font-family="Georgia, serif" font-size="54" font-style="italic" font-weight="700" text-anchor="middle">Ra</text>
            <circle cx="130" cy="46" r="4.5" fill="${c2}"/>
            <line x1="56" y1="88" x2="144" y2="88" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
          </svg>`;

      case 'typo-runic':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <g stroke="${c1}" stroke-width="3" stroke-linecap="round" fill="none">
              <line x1="78" y1="28" x2="78" y2="92"/>
              <line x1="78" y1="44" x2="105" y2="28"/>
              <line x1="78" y1="66" x2="105" y2="50"/>
              <line x1="122" y1="28" x2="122" y2="92"/>
              <line x1="122" y1="44" x2="95" y2="60"/>
              <line x1="95" y1="60" x2="122" y2="76"/>
            </g>
            <text x="100" y="106" fill="${c2}" font-family="JetBrains Mono" font-size="8" text-anchor="middle">RUNIC_MONO_0x9</text>
          </svg>`;

      case 'social-bento':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="14" width="92" height="92" rx="8" fill="#131b2e" stroke="rgba(255,255,255,0.18)"/>
            <rect x="126" y="14" width="50" height="42" rx="6" fill="${c1}" opacity="0.9"/>
            <rect x="126" y="64" width="50" height="42" rx="6" fill="#131b2e" stroke="rgba(255,255,255,0.18)"/>
            <circle cx="50" cy="44" r="14" fill="${c2}"/>
            <rect x="40" y="70" width="60" height="6" rx="2" fill="rgba(255,255,255,0.4)"/>
            <rect x="40" y="82" width="40" height="6" rx="2" fill="rgba(255,255,255,0.2)"/>
          </svg>`;

      case 'social-spatial':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="orbGrad-${type}" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="45%" stop-color="${c1}"/>
                <stop offset="100%" stop-color="${c2}"/>
              </radialGradient>
            </defs>
            <rect x="44" y="14" width="112" height="92" rx="10" fill="#0c101a" stroke="rgba(255,255,255,0.12)"/>
            <circle cx="100" cy="54" r="28" fill="url(#orbGrad-${type})" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.7))" style="animation: floatCaustic 4s ease-in-out infinite; transform-origin: 100px 54px;"/>
            <ellipse cx="100" cy="94" rx="22" ry="6" fill="rgba(0,0,0,0.5)"/>
          </svg>`;

      case 'social-brutal':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="25" width="130" height="70" fill="#000000"/>
            <rect x="30" y="20" width="130" height="70" fill="${c1}" stroke="#000000" stroke-width="3"/>
            <text x="95" y="55" fill="#000000" font-family="Space Grotesk" font-size="16" font-weight="900" text-anchor="middle">NEW DROP</text>
            <rect x="40" y="65" width="70" height="15" fill="${c2}" stroke="#000" stroke-width="2"/>
            <text x="75" y="76" fill="#ffffff" font-family="JetBrains Mono" font-size="7" font-weight="700" text-anchor="middle">BREAKING</text>
          </svg>`;

      default:
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="28" y="20" width="34" height="80" rx="4" fill="${c1}"/>
            <rect x="68" y="20" width="34" height="80" rx="4" fill="${c2}"/>
            <rect x="108" y="20" width="34" height="80" rx="4" fill="${c3}"/>
            <rect x="148" y="20" width="24" height="80" rx="4" fill="#ffffff" opacity="0.3"/>
          </svg>`;
    }
  }

  // --- SVG INSPIRATION PREVIEW GENERATOR ---
  function renderInspArtwork(type) {
    switch (type) {
      case 'glass-prism':
        return `
          <svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg">
            <polygon points="80,15 130,90 30,90" fill="none" stroke="#00F5D4" stroke-width="2"/>
            <line x1="10" y1="55" x2="55" y2="55" stroke="#ffffff" stroke-width="2"/>
            <line x1="105" y1="55" x2="150" y2="40" stroke="#f43f5e" stroke-width="2"/>
            <line x1="105" y1="55" x2="150" y2="55" stroke="#10b981" stroke-width="2"/>
            <line x1="105" y1="55" x2="150" y2="70" stroke="#8b5cf6" stroke-width="2"/>
          </svg>`;
      case 'cyber-orchid':
        return `
          <svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="55" r="30" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3,3"/>
            <path d="M80,20 C60,40 60,70 80,90 C100,70 100,40 80,20 Z" fill="#f43f5e" opacity="0.8"/>
            <circle cx="80" cy="55" r="8" fill="#00F5D4"/>
          </svg>`;
      case 'type-chronos':
        return `
          <svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg">
            <text x="80" y="65" fill="#00F5D4" font-family="Space Grotesk" font-size="36" font-weight="900" text-anchor="middle">CHRN</text>
            <line x1="20" y1="80" x2="140" y2="80" stroke="#f59e0b" stroke-width="2"/>
          </svg>`;
      case 'deep-sea':
      default:
        return `
          <svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="55" r="30" fill="#047857" opacity="0.6"/>
            <circle cx="80" cy="55" r="18" fill="#10B981"/>
            <circle cx="80" cy="55" r="7" fill="#ECFDF5"/>
          </svg>`;
    }
  }

  // --- 3D TILT PHYSICS FOR CARDS ---
  function init3DTiltCards() {
    const cards = document.querySelectorAll('.trend-card');
    cards.forEach(card => {
      let glare = card.querySelector('.card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  // --- RENDERING FUNCTIONS ---

  // 1. Render Design Trends Grid
  function renderTrendsGrid() {
    const grid = document.getElementById('trendsGrid');
    const countBadge = document.getElementById('trendCountBadge');
    if (!grid) return;

    let filtered = state.trends.filter(item => {
      if (state.activeCategory !== 'all' && item.category !== state.activeCategory) {
        return false;
      }
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
        const matchesSummary = item.summary.toLowerCase().includes(query);
        const matchesTags = (item.tags || []).some(t => t.toLowerCase().includes(query));
        const matchesPrompt = (item.promptFormula || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubtitle && !matchesSummary && !matchesTags && !matchesPrompt) {
          return false;
        }
      }
      return true;
    });

    // Sort order
    filtered.sort((a, b) => {
      if (state.sortOrder === 'momentum-desc') return b.momentum - a.momentum;
      if (state.sortOrder === 'newest') return new Date(b.discoveredAt) - new Date(a.discoveredAt);
      if (state.sortOrder === 'confidence') return parseFloat(b.aiConfidence) - parseFloat(a.aiConfidence);
      if (state.sortOrder === 'title-asc') return a.title.localeCompare(b.title);
      return 0;
    });

    if (countBadge) {
      countBadge.textContent = `Tracking ${filtered.length} of ${state.trends.length} Signals`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.8rem; margin-bottom: 0.5rem;">🛰️</div>
          <h3 style="font-size: 1.3rem; color: var(--text-primary); margin-bottom: 0.3rem;">No Trend Signals Found</h3>
          <p>No active trends match your search or category filter. Try clearing your search.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const swatchesHtml = (item.colors || []).map(hex => `
        <div class="card-swatch-chip" style="background-color: ${hex};" title="Click to copy ${hex}" data-hex="${hex}"></div>
      `).join('');

      return `
        <article class="trend-card hud-box" id="${item.id}" data-id="${item.id}">
          <div class="card-glare"></div>
          <div class="card-preview-stage">
            <div class="preview-artwork">
              ${renderSvgArtwork(item.visualType, item.colors)}
            </div>
          </div>

          <div class="card-header-meta">
            <span class="card-category-pill">${item.category}</span>
            <span class="card-velocity-badge">🔥 ${item.momentum} Momentum (${item.velocity})</span>
          </div>

          <div class="card-title-group">
            <h3>${item.title}</h3>
            <div class="card-subtitle">${item.subtitle}</div>
          </div>

          <p class="card-summary">${item.summary}</p>

          <div class="card-swatches-row">
            ${swatchesHtml}
          </div>

          <div class="card-footer">
            <span class="card-confidence">AI Confidence: ${item.aiConfidence}</span>
            <div class="card-btn-group">
              <button class="mini-btn view-dossier-btn" data-id="${item.id}">
                Inspect Dossier
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click listeners to cards and swatches
    grid.querySelectorAll('.card-swatch-chip').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const hex = el.getAttribute('data-hex');
        copyToClipboard(hex, `Copied color ${hex} to clipboard!`);
      });
    });

    grid.querySelectorAll('.view-dossier-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openTrendModal(id);
      });
    });

    // Re-initialize 3D tilt
    init3DTiltCards();
  }

  // 2. Render Inspirations Grid (12-hour showcase)
  function renderInspirationsGrid() {
    const grid = document.getElementById('inspirationsGrid');
    if (!grid) return;

    grid.innerHTML = state.inspirations.map(item => {
      return `
        <div class="insp-card hud-box" id="${item.id}">
          <div class="insp-preview-box">
            ${renderInspArtwork(item.previewSvg)}
          </div>
          <div class="insp-header">
            <span class="insp-creator">${item.creator}</span>
            <span class="insp-tool-tag">${item.tool}</span>
          </div>
          <h4 class="insp-title">${item.title}</h4>
          <p class="insp-desc">${item.description}</p>
          <div class="insp-footer">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${formatRelativeTime(new Date(item.discoveredAt).getTime())}</span>
            <button class="like-btn" data-id="${item.id}">
              <span>❤️</span> <span>${item.likes}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = state.inspirations.find(x => x.id === id);
        if (target) {
          target.likes += 1;
          audio.playBlip(720, 0.05);
          renderInspirationsGrid();
          saveState();
        }
      });
    });
  }

  // 3. Render 24-Hour AI Design Trend Record (Daily Dossier)
  function renderDossierView() {
    const container = document.getElementById('dossierContainer');
    if (!container) return;

    const latest = state.records[0] || (window.RADAR_DATA && window.RADAR_DATA.INITIAL_RECORDS[0]);
    if (!latest) return;

    const macroTrendsHtml = (latest.macroTrends || []).map(m => `
      <div class="macro-trend-item">
        <div class="macro-title-row">
          <span>${m.name}</span>
          <span class="macro-velocity">${m.velocity}</span>
        </div>
        <div class="macro-desc">${m.description}</div>
      </div>
    `).join('');

    const dyingTrendsHtml = (latest.dyingTrends || []).map(d => `
      <div class="dying-trend-item">
        <span>📉</span>
        <span>${d}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="dossier-meta-header">
        <div>
          <span class="dossier-vol-badge">DAILY INTELLIGENCE DOSSIER</span>
          <h3 class="dossier-title">${latest.title}</h3>
          <div class="dossier-author">Author: ${latest.author}</div>
        </div>
        <div class="dossier-time-box">
          <div>Generated: ${formatFullDateTime(new Date(latest.generatedAt).getTime())}</div>
          <div style="color: var(--accent-cyan); margin-top: 0.2rem; font-weight: 700;">Record Date: ${latest.recordDate}</div>
        </div>
      </div>

      <div class="dossier-exec-summary">
        <strong>Executive Summary:</strong> ${latest.executiveSummary}
      </div>

      <div class="dossier-grid-sections">
        <div class="dossier-section-block">
          <h4>ACCELERATING MACRO DESIGN MOVEMENTS</h4>
          <div class="macro-trend-list">
            ${macroTrendsHtml}
          </div>
        </div>

        <div class="dossier-section-block">
          <h4>DYING PATTERNS FALLING OFF RADAR</h4>
          <div class="dying-trends-list">
            ${dyingTrendsHtml}
          </div>

          <div style="margin-top: 1.6rem;">
            <h4 style="margin-bottom: 0.7rem;">DOMINANT COLOR HARMONY FORECAST</h4>
            <div style="background: rgba(0,0,0,0.35); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.95rem; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; font-size: 0.95rem;">${latest.dominantColorForecast.name}</div>
                <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--text-secondary);">${latest.dominantColorForecast.contrastRatio}</div>
              </div>
              <div style="display: flex; gap: 0.45rem;">
                <div style="width: 24px; height: 24px; border-radius: 4px; background: ${latest.dominantColorForecast.primaryHex};" title="${latest.dominantColorForecast.primaryHex}"></div>
                <div style="width: 24px; height: 24px; border-radius: 4px; background: ${latest.dominantColorForecast.secondaryHex};" title="${latest.dominantColorForecast.secondaryHex}"></div>
                <div style="width: 24px; height: 24px; border-radius: 4px; background: ${latest.dominantColorForecast.baseHex}; border: 1px solid #444;" title="${latest.dominantColorForecast.baseHex}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dossier-prompt-box">
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-gold); letter-spacing: 0.1em; font-weight: 700;">
          RECOMMENDED AI PROMPT BLUEPRINT (MIDJOURNEY / FLUX.1)
        </div>
        <div class="prompt-code-wrap">
          <code>${latest.topPromptBlueprint}</code>
          <button class="mini-btn copy-prompt-btn" data-prompt="${encodeURIComponent(latest.topPromptBlueprint)}">
            Copy Prompt
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll('.copy-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.getAttribute('data-prompt'));
        copyToClipboard(text, 'Copied 24h AI Prompt Blueprint to clipboard!');
      });
    });
  }

  // 4. Render Palette Studio
  function renderPaletteStudio() {
    const container = document.getElementById('paletteStudioContainer');
    if (!container) return;

    const paletteTrends = state.trends.filter(t => t.colors && t.colors.length >= 3);

    container.innerHTML = paletteTrends.map(item => {
      const slicesHtml = item.colors.map(hex => `
        <div class="palette-slice" style="background-color: ${hex};" title="Copy ${hex}" data-hex="${hex}"></div>
      `).join('');

      const chipsHtml = item.colors.map(hex => `
        <button class="palette-hex-btn" data-hex="${hex}">
          <span class="swatch-pip" style="background-color: ${hex};"></span>
          <span>${hex}</span>
        </button>
      `).join('');

      return `
        <div class="palette-studio-card hud-box">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <h4 style="font-size: 1.15rem;">${item.title}</h4>
            <span style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-cyan); font-weight: 700;">${item.category}</span>
          </div>

          <div class="palette-bar">
            ${slicesHtml}
          </div>

          <div class="palette-chips-grid">
            ${chipsHtml}
          </div>

          <button class="secondary-btn copy-css-btn" data-colors="${item.colors.join(',')}" style="width: 100%; justify-content: center; font-size: 0.76rem; padding: 0.48rem;">
            Copy CSS Variables Snippet
          </button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-hex]').forEach(el => {
      el.addEventListener('click', () => {
        const hex = el.getAttribute('data-hex');
        copyToClipboard(hex, `Copied color ${hex} to clipboard!`);
      });
    });

    container.querySelectorAll('.copy-css-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const colors = btn.getAttribute('data-colors').split(',');
        const snippet = colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n');
        const fullCss = `:root {\n${snippet}\n}`;
        copyToClipboard(fullCss, 'Copied CSS variables palette to clipboard!');
      });
    });
  }

  // --- DETAIL MODAL LOGIC ---
  function openTrendModal(trendId) {
    const trend = state.trends.find(t => t.id === trendId);
    if (!trend) return;

    const modal = document.getElementById('trendModal');
    const body = document.getElementById('modalBody');
    if (!modal || !body) return;

    const rulesHtml = (trend.keyRules || []).map(r => `
      <li style="margin-bottom: 0.45rem; color: #cbd5e1;">${r}</li>
    `).join('');

    const colorsHtml = (trend.colors || []).map(hex => `
      <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.35); padding: 0.38rem 0.7rem; border-radius: 4px; border: 1px solid var(--border-subtle); cursor: pointer;" class="modal-color-chip" data-hex="${hex}">
        <span style="width: 18px; height: 18px; border-radius: 3px; background: ${hex}; display: inline-block;"></span>
        <span style="font-family: var(--font-mono); font-size: 0.78rem;">${hex}</span>
      </div>
    `).join('');

    body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.1rem;">
        <span class="card-category-pill">${trend.category}</span>
        <span class="card-velocity-badge">🔥 ${trend.momentum} Momentum (${trend.velocity})</span>
      </div>

      <h2 style="font-size: 2.2rem; margin-bottom: 0.35rem;">${trend.title}</h2>
      <div style="color: var(--text-secondary); margin-bottom: 1.6rem; font-size: 1.05rem;">${trend.subtitle}</div>

      <div style="height: 220px; background: radial-gradient(circle at center, #121828 0%, #070911 100%); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; margin-bottom: 1.6rem;">
        ${renderSvgArtwork(trend.visualType, trend.colors)}
      </div>

      <div style="margin-bottom: 1.6rem;">
        <h4 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 0.55rem; letter-spacing: 0.1em; font-weight: 800;">RADAR ANALYSIS & TELEMETRY</h4>
        <p style="font-size: 0.98rem; line-height: 1.7; color: #e2e8f0;">${trend.summary}</p>
      </div>

      <div style="margin-bottom: 1.6rem;">
        <h4 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 0.55rem; letter-spacing: 0.1em; font-weight: 800;">DESIGN RULES & CONSTRAINTS</h4>
        <ul style="padding-left: 1.3rem; font-size: 0.92rem;">
          ${rulesHtml}
        </ul>
      </div>

      <div style="margin-bottom: 1.6rem;">
        <h4 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); margin-bottom: 0.55rem; letter-spacing: 0.1em; font-weight: 800;">COLOR TELEMETRY (CLICK TO COPY)</h4>
        <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
          ${colorsHtml}
        </div>
      </div>

      <div class="dossier-prompt-box">
        <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-gold); letter-spacing: 0.1em; font-weight: 700;">
          AI GENERATION PROMPT FORMULA
        </div>
        <div class="prompt-code-wrap">
          <code>${trend.promptFormula || 'High-fidelity visual prompt generated by radar neural parser.'}</code>
          <button class="mini-btn modal-copy-prompt-btn" data-prompt="${encodeURIComponent(trend.promptFormula || '')}">
            Copy Prompt
          </button>
        </div>
      </div>
    `;

    body.querySelectorAll('.modal-color-chip').forEach(el => {
      el.addEventListener('click', () => {
        const hex = el.getAttribute('data-hex');
        copyToClipboard(hex, `Copied color ${hex} to clipboard!`);
      });
    });

    body.querySelectorAll('.modal-copy-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = decodeURIComponent(btn.getAttribute('data-prompt'));
        copyToClipboard(p, 'Copied AI prompt to clipboard!');
      });
    });

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    audio.playBlip(620, 0.06);
  }

  function closeModal() {
    const modal = document.getElementById('trendModal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, icon = '✨') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 320);
    }, 3800);
  }

  function copyToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage, '📋');
        audio.playBlip(960, 0.05);
      }).catch(() => fallbackCopy(text, successMessage));
    } else {
      fallbackCopy(text, successMessage);
    }
  }

  function fallbackCopy(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMessage, '📋');
      audio.playBlip(960, 0.05);
    } catch (err) {
      showToast('Could not copy to clipboard', '⚠️');
    }
    document.body.removeChild(textArea);
  }

  // --- AUTOMATED SCHEDULE ENGINE ---
  function getActiveIntervals() {
    return state.engineMode === 'demo' ? DEMO_INTERVALS : REALTIME_INTERVALS;
  }

  function updateScheduleClocks() {
    const now = Date.now();
    const intervals = getActiveIntervals();

    // 1. Update Last Updated Top Displays
    const cockpitLastUpdate = document.getElementById('cockpitLastUpdate');
    const cockpitRelativeTime = document.getElementById('cockpitRelativeTime');
    const metricLastSyncTime = document.getElementById('metricLastSyncTime');
    const footerClock = document.getElementById('footerClock');

    if (cockpitLastUpdate) cockpitLastUpdate.textContent = formatFullDateTime(state.lastUpdate);
    if (cockpitRelativeTime) cockpitRelativeTime.textContent = formatRelativeTime(state.lastUpdate);
    if (metricLastSyncTime) metricLastSyncTime.textContent = `Synced ${formatRelativeTime(state.lastUpdate).replace('(', '').replace(')', '')}`;
    if (footerClock) footerClock.textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // 2. 6-Hour Trend Update Countdown
    const elapsed6h = now - state.lastTrendUpdate;
    const remaining6h = Math.max(0, intervals.TRENDS - elapsed6h);
    const pct6h = Math.min(100, Math.floor((elapsed6h / intervals.TRENDS) * 100));

    const timer6h = document.getElementById('timer6h');
    const progress6h = document.getElementById('progress6h');
    const lastTrendTime = document.getElementById('lastTrendTime');
    if (timer6h) timer6h.textContent = formatCountdown(remaining6h);
    if (progress6h) progress6h.style.width = `${pct6h}%`;
    if (lastTrendTime) lastTrendTime.textContent = `Last: ${new Date(state.lastTrendUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (elapsed6h >= intervals.TRENDS) {
      triggerTrendDiscovery(true);
    }

    // 3. 12-Hour Inspiration Drop Countdown
    const elapsed12h = now - state.lastInspirationUpdate;
    const remaining12h = Math.max(0, intervals.INSPIRATIONS - elapsed12h);
    const pct12h = Math.min(100, Math.floor((elapsed12h / intervals.INSPIRATIONS) * 100));

    const timer12h = document.getElementById('timer12h');
    const progress12h = document.getElementById('progress12h');
    const lastInspTime = document.getElementById('lastInspTime');
    if (timer12h) timer12h.textContent = formatCountdown(remaining12h);
    if (progress12h) progress12h.style.width = `${pct12h}%`;
    if (lastInspTime) lastInspTime.textContent = `Last: ${new Date(state.lastInspirationUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (elapsed12h >= intervals.INSPIRATIONS) {
      triggerInspirationDrop(true);
    }

    // 4. 24-Hour Intelligence Record Countdown
    const elapsed24h = now - state.lastRecordUpdate;
    const remaining24h = Math.max(0, intervals.RECORDS - elapsed24h);
    const pct24h = Math.min(100, Math.floor((elapsed24h / intervals.RECORDS) * 100));

    const timer24h = document.getElementById('timer24h');
    const progress24h = document.getElementById('progress24h');
    const lastRecordTime = document.getElementById('lastRecordTime');
    if (timer24h) timer24h.textContent = formatCountdown(remaining24h);
    if (progress24h) progress24h.style.width = `${pct24h}%`;
    if (lastRecordTime) lastRecordTime.textContent = `Last: ${new Date(state.lastRecordUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (elapsed24h >= intervals.RECORDS) {
      triggerRecordGeneration(true);
    }
  }

  // --- PROCEDURAL GENERATORS ---
  function triggerTrendDiscovery(isAuto = false) {
    const pools = window.RADAR_DATA.GENERATIVE_POOLS;
    const categories = ['logos', 'posters', 'typography', 'palettes', 'social'];
    const visualTypes = ['logo-glass', 'logo-chisel', 'logo-lattice', 'poster-swiss', 'poster-riso', 'poster-solar', 'typo-grotesque', 'typo-serif', 'typo-runic', 'social-bento', 'social-spatial', 'social-brutal'];

    const chosenCat = categories[Math.floor(Math.random() * categories.length)];
    const adj = pools.adjectives[Math.floor(Math.random() * pools.adjectives.length)];
    const style = pools.styles[Math.floor(Math.random() * pools.styles.length)];
    const colorSet = pools.colors[Math.floor(Math.random() * pools.colors.length)];
    const visType = visualTypes[Math.floor(Math.random() * visualTypes.length)];

    const momentum = Math.floor(Math.random() * 15) + 85;
    const velocityNum = Math.floor(Math.random() * 35) + 15;

    const newTrend = {
      id: `trend-${Date.now()}`,
      category: chosenCat,
      title: `${adj} ${style}`,
      subtitle: `Discovered Vector: ${adj} aesthetic synthesis`,
      momentum: momentum,
      velocity: `+${velocityNum}% surge`,
      status: '✨ Just Discovered',
      aiConfidence: `${(94 + Math.random() * 5.9).toFixed(1)}%`,
      discoveredAt: new Date().toISOString(),
      tags: [adj, style, 'Autonomous Telemetry', 'Next-Gen'],
      summary: `Autonomous radar scan detected a rapid acceleration in ${adj.toLowerCase()} graphic treatments. Combining ${style.toLowerCase()} principles with AI-augmented workflows, offering exceptional clarity and visual retention.`,
      promptFormula: `High-fidelity ${adj.toLowerCase()} ${chosenCat} design, ${style.toLowerCase()} aesthetics, chromatic accents, clean vector curves, studio lighting, octane render --v 6.1`,
      keyRules: [
        `Strict aesthetic discipline in ${adj.toLowerCase()} geometry`,
        `Complementary high-contrast palette with primary accent ${colorSet[0]}`,
        `Optimized for modern OLED screens and high-DPI displays`
      ],
      colors: colorSet,
      visualType: visType
    };

    state.trends.unshift(newTrend);
    state.lastTrendUpdate = Date.now();
    state.lastUpdate = Date.now();
    saveState();

    renderTrendsGrid();
    renderPaletteStudio();
    audio.playSuccess();

    showToast(`🛰️ 6h Trend Sweep: Discovered "${newTrend.title}" (${newTrend.category})!`, '⚡');

    setTimeout(() => {
      const card = document.getElementById(newTrend.id);
      if (card) {
        card.classList.add('highlight-pulse');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  }

  function triggerInspirationDrop(isAuto = false) {
    const creators = ['@nova_graphics', '@studio_vector', '@cyber_typographer', '@future_craft', '@lumina_dsgn', '@solarpunk_lab'];
    const tools = ['Midjourney v6.1', 'Flux.1 Pro', 'Spline 3D', 'Recraft v3', 'Figma AI'];
    const categories = ['logos', 'posters', 'typography', 'social'];
    const svgs = ['glass-prism', 'cyber-orchid', 'type-chronos', 'deep-sea'];

    const chosenCreator = creators[Math.floor(Math.random() * creators.length)];
    const chosenTool = tools[Math.floor(Math.random() * tools.length)];
    const chosenCat = categories[Math.floor(Math.random() * categories.length)];
    const chosenSvg = svgs[Math.floor(Math.random() * svgs.length)];

    const newInsp = {
      id: `insp-${Date.now()}`,
      title: `Project Orbital: ${chosenCat.toUpperCase()} Evolution`,
      creator: chosenCreator,
      tool: chosenTool,
      category: chosenCat,
      likes: Math.floor(Math.random() * 400) + 120,
      discoveredAt: new Date().toISOString(),
      description: `Exploration of kinetic energy and high-contrast typography crafted with ${chosenTool}.`,
      previewSvg: chosenSvg
    };

    state.inspirations.unshift(newInsp);
    state.lastInspirationUpdate = Date.now();
    state.lastUpdate = Date.now();
    saveState();

    renderInspirationsGrid();
    audio.playSuccess();
    showToast(`🎨 12h Inspiration Drop: Added "${newInsp.title}" by ${chosenCreator}!`, '🎨');
  }

  function triggerRecordGeneration(isAuto = false) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const volNum = state.records.length + 42;

    const newRecord = {
      id: `record-${Date.now()}`,
      recordDate: dateStr,
      title: `Volume ${volNum}: Macro Telemetry & Visual Shift Briefing`,
      generatedAt: now.toISOString(),
      author: 'Radar Autonomous Neural Synthesis Engine v4.2',
      executiveSummary: `Telemetry consolidated across ${state.trends.length} active design vectors over the last 24 hours demonstrates elevated engagement (+42%) for tactile physical lighting, parametric typography, and bento-box layouts. Flat corporate graphics continue sharp descent.`,
      macroTrends: [
        {
          name: 'Kinetic Variable Typography Primacy',
          velocity: '+54% acceleration',
          description: 'Variable fonts reacting to user scroll velocity and viewport orientation have replaced static hero headers across top tier web releases.'
        },
        {
          name: 'Optical Refraction in Monograms',
          velocity: '+39% acceleration',
          description: '3D Caustics and glass chromatic dispersion have become the benchmark for next-generation AI and spatial computing brandmarks.'
        },
        {
          name: 'Micro-Grid Telemetry Annotation',
          velocity: '+29% acceleration',
          description: 'Posters and social reels are utilizing raw coordinates, timestamps, and sensor telemetry lines to communicate authenticity.'
        }
      ],
      dyingTrends: [
        'Monoline Thin-Stroke Generic Sans (-58%)',
        'Isometric Pastel 3D Clay Figures (-49%)',
        'Standard 3-Card Symmetrical Grid (-38%)'
      ],
      dominantColorForecast: {
        name: 'Electric Cyan & Obsidian Core',
        primaryHex: '#00F5D4',
        secondaryHex: '#8B5CF6',
        baseHex: '#07090E',
        contrastRatio: '15.6:1 (AAA certified)'
      },
      topPromptBlueprint: `Minimalist brand mark emblem, kinetic optical geometry, laser-milled acrylic glass, cyan and ultraviolet caustics, floating on dark carbon velvet background, Hasselblad 100c --v 6.1 --style raw`,
      stats: {
        signalsScanned: `${(490000 + Math.random() * 50000).toLocaleString('en-US')} visual assets`,
        confidenceScore: '99.4%',
        platformsAnalyzed: ['Behance', 'Dribbble', 'Are.na', 'Figma Community', 'Midjourney', 'X']
      }
    };

    state.records.unshift(newRecord);
    state.lastRecordUpdate = Date.now();
    state.lastUpdate = Date.now();
    saveState();

    renderDossierView();
    audio.playSuccess();
    showToast(`📊 24h AI Trend Record: Generated "${newRecord.title}"!`, '📑');
  }

  // --- INTERACTIVE RADAR CANVAS ENGINE WITH SONAR ACOUSTICS ---
  function initRadarCanvas() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let sweepAngle = 0;
    let hoveredBlip = null;
    let ripples = [];
    let lastPlayedBlipId = null;

    const catColors = {
      logos: '#00F5D4',
      posters: '#F43F5E',
      typography: '#C084FC',
      palettes: '#FBBF24',
      social: '#38BDF8'
    };

    function getBlipCoordinates() {
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = (width / 2) - 34;

      return state.trends.map((trend, idx) => {
        const catOffset = {
          logos: 0,
          posters: Math.PI * 0.4,
          typography: Math.PI * 0.8,
          palettes: Math.PI * 1.2,
          social: Math.PI * 1.6
        }[trend.category] || 0;

        const jitter = ((idx * 37) % 100) / 100 * (Math.PI * 0.35);
        const angle = (catOffset + jitter) % (Math.PI * 2);

        const normalizedDist = (trend.momentum - 60) / 40;
        const distance = Math.max(32, Math.min(maxRadius, normalizedDist * maxRadius));

        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        return {
          id: trend.id,
          title: trend.title,
          category: trend.category,
          momentum: trend.momentum,
          color: catColors[trend.category] || '#00F5D4',
          angle,
          distance,
          x,
          y,
          radius: 5.5
        };
      });
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const blips = getBlipCoordinates();
      hoveredBlip = blips.find(b => {
        const dx = b.x - mouseX;
        const dy = b.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) < 16;
      });

      canvas.style.cursor = hoveredBlip ? 'pointer' : 'crosshair';
    });

    canvas.addEventListener('click', () => {
      if (hoveredBlip) {
        audio.playBlip(750, 0.08);
        openTrendModal(hoveredBlip.id);
        const targetCard = document.getElementById(hoveredBlip.id);
        if (targetCard) {
          targetCard.classList.add('highlight-pulse');
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = (width / 2) - 22;

      // 1. Concentric Range Rings
      [0.25, 0.5, 0.75, 1.0].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 2. Crosshair Grid Lines
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.15)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Rotating Sweep Beam
      sweepAngle += 0.019;
      if (sweepAngle > Math.PI * 2) sweepAngle = 0;

      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      sweepGrad.addColorStop(0, 'rgba(0, 245, 212, 0.28)');
      sweepGrad.addColorStop(1, 'rgba(0, 245, 212, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sweepAngle - 0.48, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Sharp Leading Edge
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 4. Sonar Ripples & Blip Sweep Intersection
      const blips = getBlipCoordinates();

      blips.forEach(b => {
        // Check if sweep line currently passes through blip's angle
        let angleDiff = Math.abs(sweepAngle - b.angle);
        if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

        if (angleDiff < 0.035 && lastPlayedBlipId !== b.id) {
          lastPlayedBlipId = b.id;
          ripples.push({ x: b.x, y: b.y, r: 4, maxR: 24, alpha: 0.9, color: b.color });
          audio.playSonarEcho(900 + (b.momentum * 4));
        }
      });

      // Update & Render Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 0.9;
        rp.alpha -= 0.035;

        if (rp.alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = rp.color;
        ctx.globalAlpha = Math.max(0, rp.alpha);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // 5. Render Active Blips
      blips.forEach(b => {
        // Glowing halo
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = b.color + '33';
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 6. Targeting Reticle on Hover
      if (hoveredBlip) {
        ctx.save();
        // Target Reticle Box
        ctx.strokeStyle = hoveredBlip.color;
        ctx.lineWidth = 1.5;
        const boxR = 14;
        ctx.strokeRect(hoveredBlip.x - boxR, hoveredBlip.y - boxR, boxR * 2, boxR * 2);

        // Tooltip
        const text = `${hoveredBlip.title} (${hoveredBlip.momentum}m)`;
        ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
        const textWidth = ctx.measureText(text).width;
        const boxW = textWidth + 20;
        const boxH = 26;
        let boxX = hoveredBlip.x + 16;
        let boxY = hoveredBlip.y - 12;

        if (boxX + boxW > width) boxX = hoveredBlip.x - boxW - 16;

        ctx.fillStyle = 'rgba(5, 7, 11, 0.94)';
        ctx.strokeStyle = hoveredBlip.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, boxX + 10, boxY + 17);
        ctx.restore();
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  // --- BACKGROUND INTERACTIVE CONSTELLATION CANVAS ---
  function initConstellationBackground() {
    const canvas = document.getElementById('bgConstellationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(65, Math.floor((width * height) / 22000));
    let mouse = { x: -1000, y: -1000 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const aura = document.getElementById('cursorAura');
      if (aura) {
        aura.style.left = `${e.clientX}px`;
        aura.style.top = `${e.clientY}px`;
      }
    });

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(0, 245, 212, ' : 'rgba(157, 78, 221, '
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.6)';
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${0.14 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect to mouse if close
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 245, 212, ${0.22 * (1 - mDist / 140)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // --- LIVE AUDIO WAVEFORM VISUALIZER SIMULATION ---
  function initWaveformVisualizer() {
    const canvas = document.getElementById('waveformCanvas');
    const hzLabel = document.getElementById('waveformHz');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    function renderWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      phase += 0.08;
      const mid = canvas.height / 2;

      for (let x = 0; x < canvas.width; x += 3) {
        const y = mid + Math.sin(x * 0.045 + phase) * 8 + Math.cos(x * 0.09 - phase * 1.5) * 4;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#00F5D4';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (Math.random() < 0.05 && hzLabel) {
        hzLabel.textContent = `${(138 + Math.random() * 24).toFixed(1)} Hz`;
      }

      requestAnimationFrame(renderWave);
    }

    requestAnimationFrame(renderWave);
  }

  // --- KINETIC TYPOGRAPHY LAB INTERACTION ---
  function initTypeLab() {
    const textInput = document.getElementById('typeInputText');
    const trackingSlider = document.getElementById('typeTrackingSlider');
    const weightSlider = document.getElementById('typeWeightSlider');
    const styleSelect = document.getElementById('typeStyleSelect');

    const previewText = document.getElementById('typePreviewText');
    const trackingVal = document.getElementById('trackingVal');
    const weightVal = document.getElementById('weightVal');

    if (!previewText) return;

    function updatePreview() {
      const text = textInput ? textInput.value || 'KINETIC INTELLIGENCE' : 'KINETIC INTELLIGENCE';
      const tracking = trackingSlider ? trackingSlider.value : 12;
      const weight = weightSlider ? weightSlider.value : 700;
      const style = styleSelect ? styleSelect.value : 'grotesque';

      if (trackingVal) trackingVal.textContent = `${tracking}px`;
      if (weightVal) weightVal.textContent = weight;

      previewText.textContent = text;
      previewText.style.letterSpacing = `${tracking}px`;
      previewText.style.fontWeight = weight;

      if (style === 'grotesque') {
        previewText.style.fontFamily = 'Space Grotesk, sans-serif';
        previewText.style.textTransform = 'uppercase';
        previewText.style.fontStyle = 'normal';
      } else if (style === 'chisel') {
        previewText.style.fontFamily = 'Space Grotesk, sans-serif';
        previewText.style.textTransform = 'uppercase';
        previewText.style.fontStyle = 'italic';
      } else if (style === 'serif') {
        previewText.style.fontFamily = 'Georgia, serif';
        previewText.style.textTransform = 'none';
        previewText.style.fontStyle = 'italic';
      } else if (style === 'mono') {
        previewText.style.fontFamily = 'JetBrains Mono, monospace';
        previewText.style.textTransform = 'uppercase';
        previewText.style.fontStyle = 'normal';
      }
    }

    if (textInput) textInput.addEventListener('input', updatePreview);
    if (trackingSlider) trackingSlider.addEventListener('input', updatePreview);
    if (weightSlider) weightSlider.addEventListener('input', updatePreview);
    if (styleSelect) styleSelect.addEventListener('change', updatePreview);

    updatePreview();
  }

  // --- EXPORT & PRINT DOSSIER FEATURES ---
  function exportDossierJSON() {
    const latest = state.records[0];
    if (!latest) return;
    const blob = new Blob([JSON.stringify(latest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Design-Trend-Record-${latest.recordDate || 'latest'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded 24h Trend Dossier JSON!', '📥');
  }

  function exportDossierMarkdown() {
    const latest = state.records[0];
    if (!latest) return;

    let md = `# ${latest.title}\n\n`;
    md += `**Record Date:** ${latest.recordDate}\n`;
    md += `**Generated:** ${latest.generatedAt}\n`;
    md += `**Author:** ${latest.author}\n\n`;
    md += `## Executive Summary\n${latest.executiveSummary}\n\n`;
    md += `## Accelerating Macro Movements\n`;
    (latest.macroTrends || []).forEach(m => {
      md += `- **${m.name}** (${m.velocity}): ${m.description}\n`;
    });
    md += `\n## Dying Patterns Falling Off Radar\n`;
    (latest.dyingTrends || []).forEach(d => {
      md += `- ${d}\n`;
    });
    md += `\n## Dominant Color Forecast\n`;
    md += `**${latest.dominantColorForecast.name}**\n`;
    md += `- Primary: \`${latest.dominantColorForecast.primaryHex}\`\n`;
    md += `- Secondary: \`${latest.dominantColorForecast.secondaryHex}\`\n`;
    md += `- Base: \`${latest.dominantColorForecast.baseHex}\`\n`;
    md += `- Ratio: ${latest.dominantColorForecast.contrastRatio}\n\n`;
    md += `## Top AI Prompt Blueprint\n\`\`\`\n${latest.topPromptBlueprint}\n\`\`\`\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Design-Trend-Record-${latest.recordDate || 'latest'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded 24h Trend Dossier Markdown!', '📄');
  }

  // --- ATTACH EVENT LISTENERS ---
  function attachEventListeners() {
    // Navigation smooth scrolling
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });

    const brandNav = document.getElementById('brandNav');
    if (brandNav) {
      brandNav.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Sound Toggle
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        audio.enabled = state.soundEnabled;
        soundBtn.querySelector('.btn-icon').textContent = state.soundEnabled ? '🔊' : '🔇';
        showToast(state.soundEnabled ? 'Audio telemetry enabled' : 'Audio telemetry muted', '🔊');
        saveState();
      });
    }

    // Open Cockpit Hub Shortcut
    const openCockpitBtn = document.getElementById('openCockpitBtn');
    if (openCockpitBtn) {
      openCockpitBtn.addEventListener('click', () => {
        const cockpit = document.getElementById('schedule-cockpit');
        if (cockpit) {
          cockpit.scrollIntoView({ behavior: 'smooth' });
          cockpit.style.boxShadow = '0 0 40px var(--accent-cyan-glow)';
          setTimeout(() => { cockpit.style.boxShadow = ''; }, 1600);
        }
      });
    }

    // Engine Mode Toggle (Real-time vs Fast Demo)
    const modeRealtimeBtn = document.getElementById('modeRealtimeBtn');
    const modeFastDemoBtn = document.getElementById('modeFastDemoBtn');

    if (modeRealtimeBtn && modeFastDemoBtn) {
      modeRealtimeBtn.addEventListener('click', () => {
        state.engineMode = 'realtime';
        modeRealtimeBtn.classList.add('active');
        modeFastDemoBtn.classList.remove('active');
        saveState();
        showToast('Schedule Engine set to REAL-TIME (6h, 12h, 24h cadences)', '⏱️');
      });

      modeFastDemoBtn.addEventListener('click', () => {
        state.engineMode = 'demo';
        modeFastDemoBtn.classList.add('active');
        modeRealtimeBtn.classList.remove('active');
        saveState();
        showToast('Schedule Engine set to FAST DEMO (15s, 30s, 60s test cycles)', '⚡');
      });

      if (state.engineMode === 'demo') {
        modeFastDemoBtn.classList.add('active');
        modeRealtimeBtn.classList.remove('active');
      }
    }

    // Force Triggers in Cockpit
    const trigger6hBtn = document.getElementById('trigger6hBtn');
    if (trigger6hBtn) {
      trigger6hBtn.addEventListener('click', () => triggerTrendDiscovery(false));
    }

    const trigger12hBtn = document.getElementById('trigger12hBtn');
    if (trigger12hBtn) {
      trigger12hBtn.addEventListener('click', () => triggerInspirationDrop(false));
    }

    const trigger24hBtn = document.getElementById('trigger24hBtn');
    if (trigger24hBtn) {
      trigger24hBtn.addEventListener('click', () => triggerRecordGeneration(false));
    }

    const simulateAllBtn = document.getElementById('simulateAllBtn');
    if (simulateAllBtn) {
      simulateAllBtn.addEventListener('click', () => {
        triggerTrendDiscovery(false);
        setTimeout(() => triggerInspirationDrop(false), 400);
        setTimeout(() => triggerRecordGeneration(false), 800);
        showToast('Running Full Radar Synchronous Cycle (All 3 cadences)...', '🚀');
      });
    }

    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('Reset radar database to default initial state?')) {
          localStorage.removeItem(STORAGE_KEY);
          resetStateToDefaults();
          renderTrendsGrid();
          renderInspirationsGrid();
          renderDossierView();
          renderPaletteStudio();
          showToast('Radar telemetry reset to defaults.', '🔄');
        }
      });
    }

    // Category Filter Pills
    const categoryPills = document.querySelectorAll('.category-pills .pill');
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeCategory = pill.getAttribute('data-category');
        audio.playBlip(650, 0.04);
        renderTrendsGrid();
      });
    });

    // Search Input
    const searchInput = document.getElementById('trendSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        if (clearBtn) {
          clearBtn.style.display = state.searchQuery ? 'block' : 'none';
        }
        renderTrendsGrid();
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.searchQuery = '';
        clearBtn.style.display = 'none';
        renderTrendsGrid();
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('trendSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortOrder = e.target.value;
        audio.playBlip(700, 0.04);
        renderTrendsGrid();
      });
    }

    // Export Buttons for Dossier
    const exportJsonBtn = document.getElementById('exportDossierJsonBtn');
    const exportMdBtn = document.getElementById('exportDossierMdBtn');
    const printBtn = document.getElementById('printDossierBtn');

    if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportDossierJSON);
    if (exportMdBtn) exportMdBtn.addEventListener('click', exportDossierMarkdown);
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    // Modal Close Button & Backdrop Click
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modal = document.getElementById('trendModal');

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // --- APP BOOTSTRAP ---
  function init() {
    loadPersistedState();
    renderTrendsGrid();
    renderInspirationsGrid();
    renderDossierView();
    renderPaletteStudio();
    initRadarCanvas();
    initConstellationBackground();
    initWaveformVisualizer();
    initTypeLab();
    attachEventListeners();

    // Start background cron ticker (runs every 1000ms)
    updateScheduleClocks();
    setInterval(updateScheduleClocks, 1000);

    setTimeout(() => {
      showToast('AI Design Trend Radar online • Auto-sync active', '🛰️');
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
