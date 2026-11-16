/**
 * AI DESIGN TREND RADAR - CLIENT APPLICATION & TELEMETRY ENGINE
 * Configured with completely blank trend & design catalogs.
 * Ready for external AI automation pipeline ingestion.
 */

(function () {
  'use strict';

  // --- CONFIGURATION & TIME CONSTANTS ---
  const STORAGE_KEY = 'ai_design_trend_radar_telemetry_v2';

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

  // Clear legacy v1 mock cache if present
  try {
    localStorage.removeItem('ai_design_trend_radar_telemetry_v1');
  } catch (e) {}

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
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

  // --- APPLICATION STATE (Starts completely blank) ---
  let state = {
    engineMode: 'realtime',
    soundEnabled: true,
    lastUpdate: Date.now(),
    lastTrendUpdate: Date.now(),
    lastInspirationUpdate: Date.now(),
    lastRecordUpdate: Date.now(),
    trends: [],
    inspirations: [],
    records: [],
    activeCategory: 'all',
    searchQuery: '',
    sortOrder: 'momentum-desc'
  };

  // --- INITIALIZE STATE (Synchronizes with data.js published by pipeline) ---
  function loadPersistedState() {
    const rawData = window.RADAR_DATA || {};
    const publishedTrends = rawData.INITIAL_TRENDS || [];
    const publishedInspirations = rawData.INITIAL_INSPIRATIONS || [];
    const publishedRecords = rawData.INITIAL_RECORDS || [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state = { ...state, ...parsed };

        // Synchronize any newly published items from data.js
        if (publishedTrends.length > 0) {
          const existingIds = new Set(state.trends.map(t => t.id));
          const newItems = publishedTrends.filter(t => !existingIds.has(t.id));
          state.trends = [...newItems, ...state.trends];
        }
        if (publishedInspirations.length > 0) {
          const existingIds = new Set(state.inspirations.map(i => i.id));
          const newItems = publishedInspirations.filter(i => !existingIds.has(i.id));
          state.inspirations = [...newItems, ...state.inspirations];
        }
        if (publishedRecords.length > 0) {
          const existingIds = new Set(state.records.map(r => r.id));
          const newItems = publishedRecords.filter(r => !existingIds.has(r.id));
          state.records = [...newItems, ...state.records];
        }
      } else {
        state.trends = [...publishedTrends];
        state.inspirations = [...publishedInspirations];
        state.records = [...publishedRecords];
      }
    } catch (e) {
      state.trends = [...publishedTrends];
      state.inspirations = [...publishedInspirations];
      state.records = [...publishedRecords];
    }
  }

  function resetStateToDefaults() {
    const rawData = window.RADAR_DATA || {};
    state.trends = rawData.INITIAL_TRENDS ? [...rawData.INITIAL_TRENDS] : [];
    state.inspirations = rawData.INITIAL_INSPIRATIONS ? [...rawData.INITIAL_INSPIRATIONS] : [];
    state.records = rawData.INITIAL_RECORDS ? [...rawData.INITIAL_RECORDS] : [];
    state.lastUpdate = Date.now();
    state.lastTrendUpdate = Date.now();
    state.lastInspirationUpdate = Date.now();
    state.lastRecordUpdate = Date.now();
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
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
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
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glassGrad-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${c1}" stop-opacity="0.9"/>
                <stop offset="60%" stop-color="${c2}" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2"/>
              </linearGradient>
            </defs>
            <circle cx="100" cy="60" r="46" fill="none" stroke="${c1}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.4" style="animation: spinLattice 20s linear infinite; transform-origin: 100px 60px;"/>
            <polygon points="100,24 142,88 58,88" fill="url(#glassGrad-${type})" stroke="rgba(255,255,255,0.75)" stroke-width="1.8" style="animation: floatCaustic 5s ease-in-out infinite; transform-origin: 100px 60px;"/>
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
            <circle cx="100" cy="66" r="4" fill="#ffffff"/>
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
            <circle cx="100" cy="63" r="6" fill="${c1}"/>
          </svg>`;

      case 'poster-swiss':
        return `
          <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="10" width="150" height="100" rx="4" fill="#0d111a" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
            <line x1="25" y1="36" x2="175" y2="36" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <line x1="85" y1="10" x2="85" y2="110" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
            <circle cx="55" cy="70" r="22" fill="${c1}" opacity="0.9"/>
            <text x="35" y="27" fill="#ffffff" font-family="Space Grotesk, sans-serif" font-size="10" font-weight="800">SWISS // AI</text>
            <text x="94" y="55" fill="${c2}" font-family="JetBrains Mono, monospace" font-size="7">SYSTEM: TELEMETRY</text>
            <rect x="94" y="80" width="68" height="14" fill="${c1}" rx="2" opacity="0.25"/>
            <rect x="94" y="80" width="38" height="14" fill="${c1}" rx="2"/>
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

  function renderInspArtwork(type) {
    return `
      <svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg">
        <polygon points="80,15 130,90 30,90" fill="none" stroke="#00F5D4" stroke-width="2"/>
        <line x1="10" y1="55" x2="55" y2="55" stroke="#ffffff" stroke-width="2"/>
        <circle cx="80" cy="55" r="14" fill="#8b5cf6" opacity="0.8"/>
      </svg>`;
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

  // --- RENDERING FUNCTIONS (EMPTY STANDBY STATES) ---

  // 1. Render Trends Grid
  function renderTrendsGrid() {
    const grid = document.getElementById('trendsGrid');
    const countBadge = document.getElementById('trendCountBadge');
    const metricSignals = document.getElementById('metricSignals');
    const metricVelocity = document.getElementById('metricVelocity');
    const metricDominant = document.getElementById('metricDominant');
    if (!grid) return;

    let filtered = state.trends.filter(item => {
      if (state.activeCategory !== 'all' && item.category !== state.activeCategory) return false;
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(query) ||
               item.subtitle.toLowerCase().includes(query) ||
               item.summary.toLowerCase().includes(query);
      }
      return true;
    });

    // Update telemetry counters
    if (countBadge) countBadge.textContent = `Tracking ${state.trends.length} Signals`;
    if (metricSignals) metricSignals.textContent = state.trends.length.toLocaleString('en-US');
    if (metricVelocity) metricVelocity.textContent = state.trends.length > 0 ? '+38.6%' : '0.0% (Standby)';
    if (metricDominant) metricDominant.textContent = state.trends.length > 0 ? (state.trends[0].category.toUpperCase()) : 'Awaiting Ingestion';

    // Blank empty state for trends
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 5rem 1.5rem; background: var(--bg-card); border: 1px dashed var(--border-medium); border-radius: var(--radius-lg); backdrop-filter: blur(16px);" class="hud-box">
          <div style="font-size: 3rem; margin-bottom: 0.8rem; animation: pulseGlow 3s infinite;">🛰️</div>
          <h3 style="font-size: 1.45rem; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.01em;">RADAR OBSERVATORY STANDBY</h3>
          <p style="color: var(--text-secondary); max-width: 580px; margin: 0 auto 1.4rem; font-size: 0.95rem; line-height: 1.6;">
            The trends and designs catalog is currently blank and awaiting live ingestion from your AI automation pipeline. When your pipeline discovers fresh graphic design trends, they will automatically appear here with 3D tilt interaction, telemetry metrics, and AI prompts.
          </p>
          <div style="display: inline-flex; align-items: center; gap: 0.6rem; font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-cyan); background: rgba(0, 245, 212, 0.08); border: 1px solid rgba(0, 245, 212, 0.3); padding: 0.4rem 1rem; border-radius: var(--radius-full);">
            <span class="pulse-dot-green"></span>
            INGESTION PIPELINE CONTRACT READY: window.RadarPipeline.ingestTrend()
          </div>
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
        openTrendModal(btn.getAttribute('data-id'));
      });
    });

    init3DTiltCards();
  }

  // 2. Render Inspirations Grid (Empty Standby State)
  function renderInspirationsGrid() {
    const grid = document.getElementById('inspirationsGrid');
    if (!grid) return;

    if (state.inspirations.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-card); border: 1px dashed var(--border-medium); border-radius: var(--radius-lg); backdrop-filter: blur(16px);" class="hud-box">
          <div style="font-size: 2.8rem; margin-bottom: 0.6rem;">🎨</div>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 0.4rem;">INSPIRATION STREAM STANDBY</h4>
          <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto; font-size: 0.9rem;">
            Awaiting 12-hour design inspiration drops from your automation pipeline.
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = state.inspirations.map(item => `
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
    `).join('');
  }

  // 3. Render 24-Hour Dossier (Empty Standby State)
  function renderDossierView() {
    const container = document.getElementById('dossierContainer');
    if (!container) return;

    if (state.records.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4.5rem 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.8rem;">📑</div>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.4rem;">DAILY INTELLIGENCE DOSSIER STANDBY</h3>
          <p style="color: var(--text-secondary); max-width: 560px; margin: 0 auto 1.5rem; font-size: 0.95rem; line-height: 1.6;">
            No 24-hour macro intelligence records generated yet. When your AI automation pipeline generates the daily synthesis dossier, it will render here complete with macro trend velocities, dying patterns, and prompt engineering blueprints.
          </p>
          <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-gold); background: rgba(255, 190, 11, 0.08); border: 1px solid rgba(255, 190, 11, 0.3); padding: 0.4rem 1rem; border-radius: var(--radius-full); display: inline-block;">
            CONTRACT: window.RadarPipeline.ingestRecord(dossierObject)
          </div>
        </div>
      `;
      return;
    }

    const latest = state.records[0];
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
          <h4>ACCELERATING MACRO MOVEMENTS</h4>
          <div class="macro-trend-list">
            ${macroTrendsHtml}
          </div>
        </div>

        <div class="dossier-section-block">
          <h4>DYING PATTERNS FALLING OFF RADAR</h4>
          <div class="dying-trends-list">
            ${dyingTrendsHtml}
          </div>
        </div>
      </div>

      <div class="dossier-prompt-box">
        <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-gold); letter-spacing: 0.1em; font-weight: 700;">
          RECOMMENDED AI PROMPT BLUEPRINT
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
        copyToClipboard(decodeURIComponent(btn.getAttribute('data-prompt')), 'Copied prompt to clipboard!');
      });
    });
  }

  // 4. Render Palette Studio (Empty Standby State)
  function renderPaletteStudio() {
    const container = document.getElementById('paletteStudioContainer');
    if (!container) return;

    const paletteTrends = state.trends.filter(t => t.colors && t.colors.length >= 3);

    if (paletteTrends.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-card); border: 1px dashed var(--border-medium); border-radius: var(--radius-lg); backdrop-filter: blur(16px);" class="hud-box">
          <div style="font-size: 2.8rem; margin-bottom: 0.6rem;">🎨</div>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 0.4rem;">COLOR PALETTE STUDIO STANDBY</h4>
          <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto; font-size: 0.9rem;">
            Awaiting harmonized color palettes from your AI ingestion pipeline.
          </p>
        </div>
      `;
      return;
    }

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
          <div class="palette-bar">${slicesHtml}</div>
          <div class="palette-chips-grid">${chipsHtml}</div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-hex]').forEach(el => {
      el.addEventListener('click', () => {
        const hex = el.getAttribute('data-hex');
        copyToClipboard(hex, `Copied color ${hex} to clipboard!`);
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

    const rulesHtml = (trend.keyRules || []).map(r => `<li style="margin-bottom: 0.45rem; color: #cbd5e1;">${r}</li>`).join('');

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
      <p style="font-size: 0.98rem; line-height: 1.7; color: #e2e8f0; margin-bottom: 1.4rem;">${trend.summary}</p>
      <ul style="padding-left: 1.3rem; font-size: 0.92rem; margin-bottom: 1.4rem;">${rulesHtml}</ul>
      <div class="dossier-prompt-box">
        <code>${trend.promptFormula || ''}</code>
      </div>
    `;

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
      });
    }
  }

  // --- AUTOMATED SCHEDULE CLOCKS ---
  function getActiveIntervals() {
    return state.engineMode === 'demo' ? DEMO_INTERVALS : REALTIME_INTERVALS;
  }

  function updateScheduleClocks() {
    const now = Date.now();
    const intervals = getActiveIntervals();

    const cockpitLastUpdate = document.getElementById('cockpitLastUpdate');
    const cockpitRelativeTime = document.getElementById('cockpitRelativeTime');
    const metricLastSyncTime = document.getElementById('metricLastSyncTime');
    const footerClock = document.getElementById('footerClock');

    if (cockpitLastUpdate) cockpitLastUpdate.textContent = formatFullDateTime(state.lastUpdate);
    if (cockpitRelativeTime) cockpitRelativeTime.textContent = formatRelativeTime(state.lastUpdate);
    if (metricLastSyncTime) metricLastSyncTime.textContent = `Synced ${formatRelativeTime(state.lastUpdate).replace('(', '').replace(')', '')}`;
    if (footerClock) footerClock.textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // 6-Hour Trend Countdown
    const elapsed6h = now - state.lastTrendUpdate;
    const remaining6h = Math.max(0, intervals.TRENDS - elapsed6h);
    const pct6h = Math.min(100, Math.floor((elapsed6h / intervals.TRENDS) * 100));
    const timer6h = document.getElementById('timer6h');
    const progress6h = document.getElementById('progress6h');
    if (timer6h) timer6h.textContent = formatCountdown(remaining6h);
    if (progress6h) progress6h.style.width = `${pct6h}%`;

    // 12-Hour Inspiration Countdown
    const elapsed12h = now - state.lastInspirationUpdate;
    const remaining12h = Math.max(0, intervals.INSPIRATIONS - elapsed12h);
    const pct12h = Math.min(100, Math.floor((elapsed12h / intervals.INSPIRATIONS) * 100));
    const timer12h = document.getElementById('timer12h');
    const progress12h = document.getElementById('progress12h');
    if (timer12h) timer12h.textContent = formatCountdown(remaining12h);
    if (progress12h) progress12h.style.width = `${pct12h}%`;

    // 24-Hour Record Countdown
    const elapsed24h = now - state.lastRecordUpdate;
    const remaining24h = Math.max(0, intervals.RECORDS - elapsed24h);
    const pct24h = Math.min(100, Math.floor((elapsed24h / intervals.RECORDS) * 100));
    const timer24h = document.getElementById('timer24h');
    const progress24h = document.getElementById('progress24h');
    if (timer24h) timer24h.textContent = formatCountdown(remaining24h);
    if (progress24h) progress24h.style.width = `${pct24h}%`;
  }

  // --- PUBLIC AI AUTOMATION PIPELINE INGESTION API ---
  window.RadarPipeline = {
    // Ingest a newly discovered trend (6h pipeline)
    ingestTrend(trend) {
      if (!trend || !trend.title) return false;
      const formatted = {
        id: trend.id || `trend-${Date.now()}`,
        category: trend.category || 'logos',
        title: trend.title,
        subtitle: trend.subtitle || 'Autonomous AI Discovery',
        momentum: trend.momentum || 90,
        velocity: trend.velocity || '+30% surge',
        status: trend.status || '✨ Just Discovered',
        aiConfidence: trend.aiConfidence || '98.5%',
        discoveredAt: trend.discoveredAt || new Date().toISOString(),
        tags: trend.tags || ['AI Ingested'],
        summary: trend.summary || 'Trend ingested via AI automation pipeline.',
        promptFormula: trend.promptFormula || '',
        keyRules: trend.keyRules || [],
        colors: trend.colors || ['#00F5D4', '#7928CA', '#08090D'],
        visualType: trend.visualType || 'logo-glass'
      };

      state.trends.unshift(formatted);
      state.lastTrendUpdate = Date.now();
      state.lastUpdate = Date.now();
      saveState();

      renderTrendsGrid();
      renderPaletteStudio();
      audio.playSuccess();
      showToast(`🤖 Pipeline Ingested: "${formatted.title}" (${formatted.category})!`, '⚡');
      return true;
    },

    // Ingest a design inspiration (12h pipeline)
    ingestInspiration(insp) {
      if (!insp || !insp.title) return false;
      const formatted = {
        id: insp.id || `insp-${Date.now()}`,
        title: insp.title,
        creator: insp.creator || '@ai_generator',
        tool: insp.tool || 'Midjourney v6.1',
        category: insp.category || 'logos',
        likes: insp.likes || 100,
        discoveredAt: insp.discoveredAt || new Date().toISOString(),
        description: insp.description || 'Ingested from AI inspiration pipeline.',
        previewSvg: insp.previewSvg || 'glass-prism'
      };

      state.inspirations.unshift(formatted);
      state.lastInspirationUpdate = Date.now();
      state.lastUpdate = Date.now();
      saveState();

      renderInspirationsGrid();
      audio.playSuccess();
      showToast(`🎨 Pipeline Ingested Inspiration: "${formatted.title}"!`, '🎨');
      return true;
    },

    // Ingest a daily intelligence dossier (24h pipeline)
    ingestRecord(record) {
      if (!record || !record.title) return false;
      state.records.unshift(record);
      state.lastRecordUpdate = Date.now();
      state.lastUpdate = Date.now();
      saveState();

      renderDossierView();
      audio.playSuccess();
      showToast(`📑 Pipeline Ingested 24h Dossier: "${record.title}"!`, '📊');
      return true;
    },

    // Clear all trends and designs
    clearData() {
      resetStateToDefaults();
      renderTrendsGrid();
      renderInspirationsGrid();
      renderDossierView();
      renderPaletteStudio();
      showToast('Radar telemetry cleared to blank state.', '🔄');
    },

    // Get current live state
    getState() {
      return state;
    }
  };

  // --- MANUAL ON-DEMAND SYNTHESIS TRIGGERS ---
  function triggerTrendDiscovery() {
    const pools = window.RADAR_DATA.GENERATIVE_POOLS;
    const categories = ['logos', 'posters', 'typography', 'palettes', 'social'];
    const visualTypes = ['logo-glass', 'logo-chisel', 'logo-lattice', 'poster-swiss', 'poster-riso', 'poster-solar', 'typo-grotesque', 'typo-serif', 'typo-runic', 'social-bento', 'social-spatial', 'social-brutal'];

    const chosenCat = categories[Math.floor(Math.random() * categories.length)];
    const adj = pools.adjectives[Math.floor(Math.random() * pools.adjectives.length)];
    const style = pools.styles[Math.floor(Math.random() * pools.styles.length)];
    const colorSet = pools.colors[Math.floor(Math.random() * pools.colors.length)];
    const visType = visualTypes[Math.floor(Math.random() * visualTypes.length)];

    window.RadarPipeline.ingestTrend({
      category: chosenCat,
      title: `${adj} ${style}`,
      subtitle: `Pipeline Vector: ${adj} aesthetic synthesis`,
      momentum: Math.floor(Math.random() * 15) + 85,
      velocity: `+${Math.floor(Math.random() * 35) + 15}% surge`,
      status: '✨ Ingested',
      aiConfidence: `${(94 + Math.random() * 5.9).toFixed(1)}%`,
      tags: [adj, style, 'AI Pipeline'],
      summary: `Autonomous pipeline synthesized ${adj.toLowerCase()} graphic treatments. Combining ${style.toLowerCase()} principles.`,
      promptFormula: `High-fidelity ${adj.toLowerCase()} ${chosenCat} design, ${style.toLowerCase()} aesthetics, clean vector curves --v 6.1`,
      keyRules: [
        `Strict aesthetic discipline in ${adj.toLowerCase()} geometry`,
        `Complementary high-contrast palette with primary accent ${colorSet[0]}`
      ],
      colors: colorSet,
      visualType: visType
    });
  }

  function triggerInspirationDrop() {
    window.RadarPipeline.ingestInspiration({
      title: 'Project Orbital Synthesis',
      creator: '@ai_pipeline_agent',
      tool: 'Flux.1 Pro + Midjourney',
      category: 'logos',
      likes: Math.floor(Math.random() * 400) + 120,
      description: 'Ingested exploration of kinetic energy and high-contrast typography.',
      previewSvg: 'glass-prism'
    });
  }

  function triggerRecordGeneration() {
    window.RadarPipeline.ingestRecord({
      id: `record-${Date.now()}`,
      recordDate: new Date().toISOString().split('T')[0],
      title: `Volume ${state.records.length + 1}: Autonomous Macro Telemetry`,
      generatedAt: new Date().toISOString(),
      author: 'AI Automation Pipeline',
      executiveSummary: 'Telemetry consolidated across active design vectors demonstrates elevated adoption of tactile computation.',
      macroTrends: [
        { name: 'Kinetic Variable Typography', velocity: '+54%', description: 'Variable fonts reacting to user scroll velocity.' },
        { name: 'Optical Refraction in Monograms', velocity: '+39%', description: '3D caustics and glass dispersion in brandmarks.' }
      ],
      dyingTrends: ['Monoline Thin-Stroke Generic Sans (-58%)'],
      dominantColorForecast: {
        name: 'Electric Cyan & Obsidian Core',
        primaryHex: '#00F5D4',
        secondaryHex: '#8B5CF6',
        baseHex: '#07090E',
        contrastRatio: '15.6:1'
      },
      topPromptBlueprint: 'Minimalist brand mark emblem, kinetic optical geometry, laser-milled acrylic glass --v 6.1'
    });
  }

  // --- RADAR CANVAS ENGINE ---
  function initRadarCanvas() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let sweepAngle = 0;
    let hoveredBlip = null;
    let ripples = [];

    const catColors = { logos: '#00F5D4', posters: '#F43F5E', typography: '#C084FC', palettes: '#FBBF24', social: '#38BDF8' };

    function getBlipCoordinates() {
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = (width / 2) - 34;

      return state.trends.map((trend, idx) => {
        const catOffset = { logos: 0, posters: Math.PI * 0.4, typography: Math.PI * 0.8, palettes: Math.PI * 1.2, social: Math.PI * 1.6 }[trend.category] || 0;
        const angle = (catOffset + (((idx * 37) % 100) / 100 * (Math.PI * 0.35))) % (Math.PI * 2);
        const distance = Math.max(32, Math.min(maxRadius, ((trend.momentum - 60) / 40) * maxRadius));
        return {
          id: trend.id,
          title: trend.title,
          category: trend.category,
          momentum: trend.momentum,
          color: catColors[trend.category] || '#00F5D4',
          angle,
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          radius: 5.5
        };
      });
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
      const blips = getBlipCoordinates();
      hoveredBlip = blips.find(b => Math.hypot(b.x - mouseX, b.y - mouseY) < 16);
      canvas.style.cursor = hoveredBlip ? 'pointer' : 'crosshair';
    });

    canvas.addEventListener('click', () => {
      if (hoveredBlip) {
        audio.playBlip(750, 0.08);
        openTrendModal(hoveredBlip.id);
      }
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const maxR = (width / 2) - 22;

      // Range rings
      [0.25, 0.5, 0.75, 1.0].forEach(ratio => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.12)';
        ctx.stroke();
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR);
      ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy);
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.14)';
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sweep beam
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

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Blips
      const blips = getBlipCoordinates();
      blips.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (hoveredBlip) {
        ctx.save();
        ctx.strokeStyle = hoveredBlip.color;
        ctx.strokeRect(hoveredBlip.x - 14, hoveredBlip.y - 14, 28, 28);
        ctx.restore();
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  // --- BACKGROUND CONSTELLATION CANVAS ---
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

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 212, ${0.14 * (1 - dist / 115)})`;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // --- AUDIO WAVEFORM VISUALIZER SIMULATION ---
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

  // --- KINETIC TYPOGRAPHY LAB ---
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

      if (style === 'serif') {
        previewText.style.fontFamily = 'Georgia, serif';
        previewText.style.fontStyle = 'italic';
      } else if (style === 'mono') {
        previewText.style.fontFamily = 'JetBrains Mono, monospace';
        previewText.style.fontStyle = 'normal';
      } else {
        previewText.style.fontFamily = 'Space Grotesk, sans-serif';
        previewText.style.fontStyle = 'normal';
      }
    }

    if (textInput) textInput.addEventListener('input', updatePreview);
    if (trackingSlider) trackingSlider.addEventListener('input', updatePreview);
    if (weightSlider) weightSlider.addEventListener('input', updatePreview);
    if (styleSelect) styleSelect.addEventListener('change', updatePreview);

    updatePreview();
  }

  // --- ATTACH EVENT LISTENERS ---
  function attachEventListeners() {
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
    }

    // Force Triggers in Cockpit
    const trigger6hBtn = document.getElementById('trigger6hBtn');
    if (trigger6hBtn) trigger6hBtn.addEventListener('click', triggerTrendDiscovery);

    const trigger12hBtn = document.getElementById('trigger12hBtn');
    if (trigger12hBtn) trigger12hBtn.addEventListener('click', triggerInspirationDrop);

    const trigger24hBtn = document.getElementById('trigger24hBtn');
    if (trigger24hBtn) trigger24hBtn.addEventListener('click', triggerRecordGeneration);

    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('Clear all radar telemetry to empty blank state?')) {
          window.RadarPipeline.clearData();
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
        if (clearBtn) clearBtn.style.display = state.searchQuery ? 'block' : 'none';
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

  // --- BOOTSTRAP ---
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

    updateScheduleClocks();
    setInterval(updateScheduleClocks, 1000);

    setTimeout(() => {
      showToast('AI Design Trend Radar online • Standby for pipeline ingestion', '🛰️');
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
