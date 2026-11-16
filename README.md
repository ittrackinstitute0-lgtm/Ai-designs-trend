# 🛰️ AI Design Trend Radar

An autonomous, professional graphic design intelligence observatory powered by **Google Gemini AI** and **GitHub Actions**. Continuously tracks, verifies, and publishes emerging visual design trends across **Logos**, **Posters**, **Typography**, **Color Palettes**, and **Social Media**.

---

## ⚡ Autonomous GitHub Actions Pipeline

The website is powered by an automated GitHub Actions pipeline located in [`.github/workflows/ai_trend_pipeline.yml`](.github/workflows/ai_trend_pipeline.yml):

- **Actions Dashboard**: [https://github.com/ittrackinstitute0-lgtm/Ai-designs-trend/actions](https://github.com/ittrackinstitute0-lgtm/Ai-designs-trend/actions)
- **Automatic Execution Cadence**:
  - **9:00 AM Pakistan Standard Time (PKT)** (`04:00 UTC`)
  - **6:00 PM Pakistan Standard Time (PKT)** (`13:00 UTC`)
  - **On-Demand Manual Trigger**: You can trigger a run anytime by navigating to the **Actions** tab on GitHub and clicking **"Run workflow"**.

---

## 🧠 AI Discovery & Verification Architecture

The automation script [`.github/scripts/ai_pipeline.py`](.github/scripts/ai_pipeline.py) runs on Google Gemini (`gemini-3.5-flash-lite`) through a 4-stage pipeline:

```
┌─────────────────────────────────┐
│  1. GEMINI AI VECTOR DISCOVERY  │
│  Scans global design shifts     │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  2. AUTOMATED VERIFICATION PASS │
│  • Schema & type integrity      │
│  • WCAG color contrast checks   │
│  • Actionable prompt validation │
│  • Design rules quality checks  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  3. ATOMIC DATA INGESTION       │
│  Updates data.js & data.json    │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  4. GIT COMMIT & DEPLOYMENT     │
│  Pushes to main & GitHub Pages  │
└─────────────────────────────────┘
```

### Verification Criteria Before Publishing
Every candidate trend discovered by Gemini must pass **100% of these validation checks**:
1. **Schema Completeness**: Enforces valid `category`, `title`, `subtitle`, `momentum` (0-100), `velocity`, `status`, `summary`, and `keyRules`.
2. **Color Palette Accessibility**: Validates 3 to 5 hexadecimal color codes (`#RRGGBB`) and verifies WCAG contrast compliance (> 4.5:1) against the dark obsidian theme.
3. **Actionable Prompt Blueprints**: Ensures Midjourney v6.1 / Flux.1 prompt syntax contains concrete lighting, geometry, and stylistic tokens.
4. **Actionable Design Constraints**: Requires at least 2 distinct vector rules per trend.

---

## 🔐 How to Configure Your Gemini API Key on GitHub

To securely manage your Gemini API key in GitHub:

1. Go to your repository settings:  
   👉 **`https://github.com/ittrackinstitute0-lgtm/Ai-designs-trend/settings/secrets/actions`**
2. Click **"New repository secret"**.
3. Set the **Name** to: `GEMINI_API_KEY`
4. Set the **Value** to your Gemini API key (e.g. paste your key from Google AI Studio)
5. Click **"Add secret"**.

---

## 🎨 Covered Graphic Design Categories

1. **💠 Logos & Brand Identity Systems** (Liquid Glassmorphism, Cyber-Chisel Monograms, Algorithmic Bio-Lattices)
2. **📐 Editorial Posters & Print** (Deconstructed Swiss Cyberpunk, Risograph Halftones, Solarpunk Bio-Constructivism)
3. **🔤 Typography & Variable Fonts** (Expanded Neo-Grotesque, Molten Liquid Serifs, Cyber-Runic Monospace)
4. **🎨 Color Palettes & Lighting Spaces** (Bioluminescent Abyssal, Acid Sunset, Earthy Ceramic & Matcha)
5. **📱 Social Media & Motion Systems** (Kinetic Bento-Box Carousels, Spatial 3D Float, Neubrutalist Reels)

---

## 📁 Repository Structure

```
ai-design-trend-radar/
├── .github/
│   ├── workflows/
│   │   └── ai_trend_pipeline.yml  # Cron schedule (9am & 6pm PKT) & GitHub Pages deployer
│   └── scripts/
│       └── ai_pipeline.py         # Gemini AI discovery, verification & publishing engine
├── index.html                     # Responsive HUD observatory interface & radar scope
├── styles.css                     # Glassmorphism, 3D tilt physics & animation styles
├── app.js                         # Radar telemetry engine, Web Audio synth & event system
├── data.js                        # Published trend catalog consumed by client
├── data.json                      # Machine-readable JSON endpoint of all verified trends
└── README.md                      # Documentation & configuration guide
```
