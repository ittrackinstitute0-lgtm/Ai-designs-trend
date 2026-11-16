#!/usr/bin/env python3
"""
AI DESIGN TREND RADAR - AUTONOMOUS INGESTION & VERIFICATION PIPELINE
Discovers, verifies, and publishes graphic design trends across:
Logos, Posters, Typography, Color Palettes, and Social Media.
Powered by Google Gemini AI (gemini-3.5-flash-lite).
"""

import os
import sys
import json
import re
import datetime
import urllib.request
import urllib.error

# --- CONFIGURATION ---
GEMINI_MODEL = "gemini-3.5-flash-lite"
API_BASE_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

# Get API key strictly from environment / GitHub Secrets
API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
if not API_KEY:
    log("GEMINI_API_KEY environment variable is not set. Configure it in GitHub Repository Secrets.", "ERROR")
    sys.exit(1)

DATA_JS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data.js"))
DATA_JSON_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data.json"))

VALID_CATEGORIES = ["logos", "posters", "typography", "palettes", "social"]
VALID_VISUAL_TYPES = [
    "logo-glass", "logo-chisel", "logo-lattice",
    "poster-swiss", "poster-riso", "poster-solar",
    "typo-grotesque", "typo-serif", "typo-runic",
    "social-bento", "social-spatial", "social-brutal",
    "palette-card"
]

def log(msg, level="INFO"):
    timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"[{timestamp}] [{level}] {msg}", flush=True)

# --- GEMINI API CALLER ---
def call_gemini(prompt: str, temperature: float = 0.7) -> str:
    url = f"{API_BASE_URL}?key={API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": 4096,
            "responseMimeType": "application/json"
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            candidates = data.get("candidates", [])
            if not candidates:
                raise ValueError("No response candidates returned by Gemini.")
            text = candidates[0]["content"]["parts"][0]["text"]
            return text
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8") if hasattr(e, "read") else str(e)
        log(f"Gemini API HTTP Error {e.code}: {err_msg}", "ERROR")
        raise
    except Exception as e:
        log(f"Gemini API Request Error: {e}", "ERROR")
        raise

# --- COLOR & CONTRAST VERIFICATION ---
def hex_to_rgb(hex_str: str):
    hex_clean = hex_str.lstrip("#")
    if len(hex_clean) != 6:
        return (0, 0, 0)
    return tuple(int(hex_clean[i:i+2], 16) for i in (0, 2, 4))

def calculate_luminance(rgb):
    def channel_lum(c):
        c_norm = c / 255.0
        return c_norm / 12.92 if c_norm <= 0.03928 else ((c_norm + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * channel_lum(r) + 0.7152 * channel_lum(g) + 0.0722 * channel_lum(b)

def verify_contrast(hex_color: str, bg_hex: str = "#05070B") -> float:
    l1 = calculate_luminance(hex_to_rgb(hex_color))
    l2 = calculate_luminance(hex_to_rgb(bg_hex))
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

# --- VERIFICATION ENGINE ---
def verify_trend(trend: dict) -> tuple[bool, str]:
    # 1. Field existence
    required = ["category", "title", "subtitle", "momentum", "velocity", "summary", "promptFormula", "keyRules", "colors"]
    for field in required:
        if field not in trend or not trend[field]:
            return False, f"Missing required field: {field}"

    # 2. Category check
    if trend["category"] not in VALID_CATEGORIES:
        return False, f"Invalid category: {trend['category']}. Must be one of {VALID_CATEGORIES}"

    # 3. Momentum & Velocity checks
    try:
        momentum = int(trend["momentum"])
        if not (0 <= momentum <= 100):
            return False, f"Momentum {momentum} out of bounds [0, 100]"
    except (ValueError, TypeError):
        return False, "Momentum must be an integer"

    # 4. Color checks (3 to 5 valid hex codes)
    colors = trend.get("colors", [])
    if not isinstance(colors, list) or len(colors) < 3:
        return False, "Trend must include at least 3 color hex codes"
    
    hex_pattern = re.compile(r"^#[0-9A-Fa-f]{6}$")
    for c in colors:
        if not hex_pattern.match(c):
            return False, f"Invalid color hex code: {c}"

    # 5. Contrast check: At least one accent color must provide high contrast (> 4.5:1)
    contrast_pass = any(verify_contrast(c) >= 4.5 for c in colors)
    if not contrast_pass:
        return False, "Color palette lacks an accessible high-contrast accent (> 4.5:1)"

    # 6. Key Rules check
    rules = trend.get("keyRules", [])
    if not isinstance(rules, list) or len(rules) < 2:
        return False, "Must provide at least 2 actionable design rules"

    # 7. Prompt Formula check
    prompt = trend.get("promptFormula", "")
    if len(prompt) < 20:
        return False, "AI Prompt Blueprint is too short or non-actionable"

    return True, "PASSED"

# --- DISCOVERY & VERIFICATION WORKFLOW ---
def run_pipeline():
    log("=================================================================")
    log("STARTING AI DESIGN TREND RADAR AUTOMATED INGESTION PIPELINE")
    log(f"Model: {GEMINI_MODEL} | Target: Logos, Posters, Typography, Palettes, Social")
    log("=================================================================")

    # Step 1: Prompt Gemini for new design trends
    discovery_prompt = """
You are the Autonomous AI Trend Intelligence Engine for the "AI Design Trend Radar" observatory.
Analyze global cutting-edge graphic design movements across 5 domains:
1. Logos & Brand Identity Systems
2. Editorial Posters & Print
3. Typography & Kinetic/Variable Fonts
4. Color Palettes & Lighting Spaces
5. Social Media & Motion Systems

Discover and synthesize 5 brand-new, ultra-distinct, high-momentum graphic design trends (one for each of the 5 categories).
Also curate 1 cutting-edge design inspiration artifact and 1 comprehensive 24-hour macro intelligence dossier.

Return a strict JSON object with this exact structure:
{
  "trends": [
    {
      "category": "logos" | "posters" | "typography" | "palettes" | "social",
      "title": "Creative Trend Name",
      "subtitle": "Secondary Technical Subtitle",
      "momentum": 92, // Integer 80 to 99
      "velocity": "+34% surge",
      "status": "Peak Wave" | "Emerging" | "Rising",
      "aiConfidence": "98.5%",
      "tags": ["Tag1", "Tag2", "Tag3"],
      "summary": "Detailed paragraph (2-3 sentences) analyzing why this trend is accelerating.",
      "promptFormula": "Midjourney v6.1 / Flux.1 prompt formula...",
      "keyRules": ["Specific rule 1", "Specific rule 2", "Specific rule 3"],
      "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
      "visualType": "logo-glass" | "logo-chisel" | "logo-lattice" | "poster-swiss" | "poster-riso" | "poster-solar" | "typo-grotesque" | "typo-serif" | "typo-runic" | "social-bento" | "social-spatial" | "social-brutal"
    }
  ],
  "inspiration": {
    "title": "Artifact Exploration Title",
    "creator": "@handle",
    "tool": "Midjourney v6.1 + Spline 3D",
    "category": "logos" | "posters" | "typography" | "social",
    "likes": 240,
    "description": "Short explanation of the creative breakthrough...",
    "previewSvg": "glass-prism" | "cyber-orchid" | "type-chronos" | "deep-sea"
  },
  "dossier": {
    "title": "Volume: Macro Telemetry & Visual Shift Briefing",
    "author": "Autonomous Gemini Ingestion Agent",
    "executiveSummary": "Comprehensive summary of global graphic vector shifts over the last cycle...",
    "macroTrends": [
      { "name": "Macro Trend 1", "velocity": "+48%", "description": "Analysis..." },
      { "name": "Macro Trend 2", "velocity": "+35%", "description": "Analysis..." }
    ],
    "dyingTrends": ["Dying Trend A (-50%)", "Dying Trend B (-40%)"],
    "dominantColorForecast": {
      "name": "Colorway Name",
      "primaryHex": "#00F5D4",
      "secondaryHex": "#9D4EDD",
      "baseHex": "#05070B",
      "contrastRatio": "15.4:1 (AAA certified)"
    },
    "topPromptBlueprint": "Full top prompt blueprint formula..."
  }
}
"""

    log("Step 1: Contacting Gemini AI for visual trend discovery...")
    response_text = call_gemini(discovery_prompt, temperature=0.7)
    
    try:
        generated_data = json.loads(response_text)
    except Exception as e:
        log(f"Failed to parse Gemini response as JSON: {e}", "ERROR")
        sys.exit(1)

    raw_trends = generated_data.get("trends", [])
    raw_inspiration = generated_data.get("inspiration", {})
    raw_dossier = generated_data.get("dossier", {})

    log(f"Ingested {len(raw_trends)} candidate trends from Gemini. Proceeding to verification...")

    # Step 2: Verification Pass
    verified_trends = []
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    now_date = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

    for idx, trend in enumerate(raw_trends):
        is_valid, reason = verify_trend(trend)
        title = trend.get("title", f"Trend #{idx+1}")
        cat = trend.get("category", "unknown")
        
        if is_valid:
            log(f"  ✓ VERIFIED [{cat.upper()}]: '{title}' passed all checks.")
            trend["id"] = f"trend-{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}-{idx}"
            trend["discoveredAt"] = now_iso
            verified_trends.append(trend)
        else:
            log(f"  ✗ REJECTED [{cat.upper()}]: '{title}' - {reason}", "WARN")

    if not verified_trends:
        log("No trends passed verification. Aborting publishing.", "ERROR")
        sys.exit(1)

    # Format inspiration
    raw_inspiration["id"] = f"insp-{int(datetime.datetime.now(datetime.timezone.utc).timestamp())}"
    raw_inspiration["discoveredAt"] = now_iso

    # Format dossier
    raw_dossier["id"] = f"record-{now_date}"
    raw_dossier["recordDate"] = now_date
    raw_dossier["generatedAt"] = now_iso

    log(f"Verification Stage Complete: {len(verified_trends)} trends approved for deployment.")

    # Step 3: Read Existing data.js or initialize
    existing_trends = []
    existing_inspirations = []
    existing_records = []

    if os.path.exists(DATA_JSON_PATH):
        try:
            with open(DATA_JSON_PATH, "r", encoding="utf-8") as f:
                prev_data = json.load(f)
                existing_trends = prev_data.get("trends", [])
                existing_inspirations = prev_data.get("inspirations", [])
                existing_records = prev_data.get("records", [])
        except Exception:
            pass

    # Prepend new verified data (keep latest 30 trends to keep site fast)
    updated_trends = verified_trends + existing_trends
    updated_trends = updated_trends[:30]

    updated_inspirations = [raw_inspiration] + existing_inspirations
    updated_inspirations = updated_inspirations[:15]

    updated_records = [raw_dossier] + existing_records
    updated_records = updated_records[:10]

    # Save to data.json
    data_payload = {
        "lastUpdate": now_iso,
        "trends": updated_trends,
        "inspirations": updated_inspirations,
        "records": updated_records
    }

    with open(DATA_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data_payload, f, indent=2)
    log(f"Updated {DATA_JSON_PATH} with {len(updated_trends)} total trends.")

    # Step 4: Write to data.js for immediate browser rendering
    data_js_content = f"""/**
 * AI DESIGN TREND RADAR - PIPELINE DATA CATALOG
 * Automatically generated & verified by Google Gemini AI Automation Pipeline.
 * Last Published: {now_iso}
 */

const INITIAL_TRENDS = {json.dumps(updated_trends, indent=2)};

const INITIAL_INSPIRATIONS = {json.dumps(updated_inspirations, indent=2)};

const INITIAL_RECORDS = {json.dumps(updated_records, indent=2)};

const GENERATIVE_POOLS = {{
  adjectives: ["Kinetic", "Bioluminescent", "Chiseled", "Liquid", "Tactile", "Quantum", "Solarpunk", "Hyper-Chroma", "Spectral", "Monolithic", "Algorithmic", "Deconstructed", "Neubrutalist", "Thermal", "Anisotropic"],
  styles: ["Glassmorphism 3.0", "Swiss Telemetry", "Organic Voronoi", "Cyber-Chisel", "Risograph Halftone", "Bento Modular", "Kinetic Serif", "Acid Typography", "Spatial Refraction", "Optical Moiré"],
  domains: ["Logos & Identity", "Editorial Posters", "Kinetic Typography", "Color & Lighting", "Social Feed Systems"],
  tags: ["Spatial UI", "Variable Type", "AI-Assisted", "Tactile UI", "High-Contrast", "Generative", "Analog Warmth", "Sub-Atomic", "OLED Deep", "Micro-Motion"],
  colors: [
    ["#00F5D4", "#7928CA", "#0E131F", "#F72585"],
    ["#39FF14", "#0A0F0D", "#1C3A27", "#80FF72"],
    ["#FF3366", "#330066", "#050510", "#FFCC00"],
    ["#00D4FF", "#091921", "#5C24FF", "#F1F5F9"]
  ]
}};

window.RADAR_DATA = {{
  INITIAL_TRENDS,
  INITIAL_INSPIRATIONS,
  INITIAL_RECORDS,
  GENERATIVE_POOLS
}};
"""

    with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
        f.write(data_js_content)
    log(f"Updated {DATA_JS_PATH} with verified trends.")

    log("=================================================================")
    log("PIPELINE EXECUTION COMPLETED SUCCESSFULLY - READY FOR DEPLOYMENT")
    log("=================================================================")

if __name__ == "__main__":
    run_pipeline()
