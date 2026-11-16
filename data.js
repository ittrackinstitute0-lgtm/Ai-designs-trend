/**
 * AI DESIGN TREND RADAR - CORE DATA & PROCEDURAL ENGINE
 * Contains initial trend catalog, visual generators, and generative seed matrices.
 */

const INITIAL_TRENDS = [
  // --- 1. LOGOS & BRANDING ---
  {
    id: "trend-logo-1",
    category: "logos",
    title: "Liquid Glassmorph Identity",
    subtitle: "Refractive Caustics & Spatial 3D Optics",
    momentum: 94,
    velocity: "+38% this week",
    status: "Peak Wave",
    aiConfidence: "98.4%",
    discoveredAt: "2026-11-16T12:00:00Z",
    tags: ["Spatial UI", "Glassmorphism", "Refraction", "3D Tech"],
    summary: "Brands are abandoning flat minimalism for hyper-tactile, light-bending 3D glass marks that respond dynamically to device tilting and ambient light sensors.",
    promptFormula: "3D refractive glass monogram logo, chromatic dispersion, caustics, soft studio lighting, floating on dark obsidian matte background, 8k render, octane render style --v 6.1",
    keyRules: [
      "Subtle chromatic aberration at edges (1-2px)",
      "High refractive index with visible background distortion",
      "Pair with crisp, ultra-neutral sans-serif typography"
    ],
    colors: ["#00F5D4", "#7B2CBF", "#0F172A", "#E2E8F0"],
    visualType: "logo-glass"
  },
  {
    id: "trend-logo-2",
    category: "logos",
    title: "Cyber-Chisel Neo-Monogram",
    subtitle: "Precision Angular Facets & Hard-Surface Cuts",
    momentum: 89,
    velocity: "+27% this week",
    status: "Emerging",
    aiConfidence: "96.1%",
    discoveredAt: "2026-11-16T06:00:00Z",
    tags: ["Hard-Surface", "Cyberpunk", "Monogram", "Angular"],
    summary: "Precision-milled geometric bevels merging brutalist architecture with aerospace engineering. Popular in AI infrastructure, robotics, and next-gen fintech.",
    promptFormula: "Precision machined titanium emblem, chiseled bevel edges, stealth jet aesthetics, subtle glowing cyan panel seams, dark studio background, minimalist --v 6.1",
    keyRules: [
      "Strict 45° and 60° chamfered vertices",
      "Matte metallic textures with micro-contrast edge bevels",
      "Compact footprint with high legibility at 16x16 favicon scale"
    ],
    colors: ["#00E5FF", "#1E293B", "#64748B", "#F8FAFC"],
    visualType: "logo-chisel"
  },
  {
    id: "trend-logo-3",
    category: "logos",
    title: "Algorithmic Bio-Lattice",
    subtitle: "Cellular Voronoi & Generative Growth Forms",
    momentum: 82,
    velocity: "+19% this week",
    status: "Rising",
    aiConfidence: "94.8%",
    discoveredAt: "2026-11-15T18:00:00Z",
    tags: ["Biophilic", "Generative", "Voronoi", "DeepTech"],
    summary: "Emblems generated via biological growth algorithms, Voronoi tessellations, and biomimetic structures for biotech, synthetic biology, and ecological tech.",
    promptFormula: "Generative organic Voronoi vector logo, cellular growth pattern forming letter 'O', bioluminescent emerald gradient, clean vector lines, white negative space --v 6.1",
    keyRules: [
      "Smooth parametric curve blending between organic nodes",
      "Dual-tone gradient simulating deep sea or plant tissue",
      "Dynamic procedural variants for sub-brands"
    ],
    colors: ["#10B981", "#047857", "#064E3B", "#ECFDF5"],
    visualType: "logo-lattice"
  },

  // --- 2. POSTERS & EDITORIAL ---
  {
    id: "trend-poster-1",
    category: "posters",
    title: "Deconstructed Swiss Cyberpunk",
    subtitle: "Stark Asymmetric Grids & Telemetry Overlays",
    momentum: 96,
    velocity: "+44% this week",
    status: "Peak Wave",
    aiConfidence: "99.1%",
    discoveredAt: "2026-11-16T12:00:00Z",
    tags: ["Swiss Style", "Telemetry", "Deconstructed", "Grid"],
    summary: "Josef Müller-Brockmann meets orbital flight telemetry. Rigid modular grid systems broken purposefully by oversized glyphs, barcode strips, and sensor readouts.",
    promptFormula: "Exhibition poster design, Swiss international typographic style meets cyberpunk flight telemetry, stark black and neon vermillion, strict grid layout, technical crosshairs, macro typography --v 6.1",
    keyRules: [
      "Strict 12-column underlying grid with intentional overflow anchors",
      "Technical metadata, coordinates, and timestamp ribbons",
      "High-contrast duotone or tritone color palette"
    ],
    colors: ["#FF2A54", "#0A0D14", "#E2E8F0", "#38BDF8"],
    visualType: "poster-swiss"
  },
  {
    id: "trend-poster-2",
    category: "posters",
    title: "Hyper-Chroma Risograph Wave",
    subtitle: "Digital Halftone Grain & Vivid Analog Overprint",
    momentum: 88,
    velocity: "+22% this week",
    status: "Emerging",
    aiConfidence: "95.5%",
    discoveredAt: "2026-11-16T06:00:00Z",
    tags: ["Risograph", "Dither", "Analog Digital", "Halftone"],
    summary: "Tactile nostalgic printing imperfections recreated digitally: ink drum misalignment, stochastic halftone dithering, and fluorescent spot color layering.",
    promptFormula: "Risograph print poster, retro-futuristic botanical synthwave landscape, fluorescent pink and electric cyan ink overprint, heavy stipple texture, misregistered layers, museum paper grain --v 6.1",
    keyRules: [
      "Multiply blend modes simulating real physical ink layering",
      "Organic paper fiber texture and edge ink bleeds",
      "Limit to 2-3 hyper-saturated spot colors + paper base"
    ],
    colors: ["#FF007F", "#00F0FF", "#FFE600", "#1C1C24"],
    visualType: "poster-riso"
  },
  {
    id: "trend-poster-3",
    category: "posters",
    title: "Solarpunk Bio-Constructivism",
    subtitle: "Architectural Sunbeams & Living Kinetic Geometry",
    momentum: 85,
    velocity: "+18% this week",
    status: "Rising",
    aiConfidence: "93.7%",
    discoveredAt: "2026-11-15T18:00:00Z",
    tags: ["Solarpunk", "Ecology", "Constructivism", "Warmth"],
    summary: "Reimagining architectural constructive layouts with warm terracotta, lush algae greens, photovoltaic gold gradients, and regenerative flora motifs.",
    promptFormula: "Solarpunk architectural poster, brutalist concrete arches overgrown with cascading moss and solar glass, warm golden hour ambient lighting, bauhaus geometry, terracotta and sage green --v 6.1",
    keyRules: [
      "Warm ambient lighting with sharp architectural shadow cuts",
      "Harmonious balance between mechanical geometry and foliage",
      "Serif titles paired with ultra-condensed technical labels"
    ],
    colors: ["#E07A5F", "#3D405B", "#81B29A", "#F4F1DE"],
    visualType: "poster-solar"
  },

  // --- 3. TYPOGRAPHY & VARIABLE FONTS ---
  {
    id: "trend-typo-1",
    category: "typography",
    title: "Expanded Hyper-Grotesque",
    subtitle: "Extended Geometric Widths & Massive Tracking",
    momentum: 93,
    velocity: "+35% this week",
    status: "Peak Wave",
    aiConfidence: "97.8%",
    discoveredAt: "2026-11-16T12:00:00Z",
    tags: ["Variable Font", "Expanded Sans", "Brutalist", "Display"],
    summary: "Horizontally stretched grotesques dominating headline typography. Often animated dynamically on scroll or mouse proximity with responsive letter-spacing.",
    promptFormula: "Typographic specimen showcase of ultra-extended variable grotesque font, bold black letterforms, extreme horizontal proportions, architectural minimalism, black and cream --v 6.1",
    keyRules: [
      "Width axis exceeding 180% normal proportions",
      "Flat horizontal terminals and uniform optical stroke weights",
      "Wide tracking for display headers (+150 to +300)"
    ],
    colors: ["#FFFFFF", "#0A0E17", "#7000FF", "#94A3B8"],
    visualType: "typo-grotesque"
  },
  {
    id: "trend-typo-2",
    category: "typography",
    title: "Liquified High-Fashion Serif",
    subtitle: "Molten Tear Terminals & Hyper-Exaggerated Ink Traps",
    momentum: 87,
    velocity: "+24% this week",
    status: "Rising",
    aiConfidence: "95.0%",
    discoveredAt: "2026-11-16T06:00:00Z",
    tags: ["Liquid Serif", "Ink Traps", "Haute Couture", "Fluid"],
    summary: "Traditional Renaissance serifs injected with organic liquid flow: drooping terminals, flared stem joins, and deep surgical ink traps creating seductive rhythms.",
    promptFormula: "Macro typography detail of molten liquid serif typeface, voluptuous dripping teardrop serifs, high contrast hairline strokes, deep organic ink traps, iridescent obsidian finish --v 6.1",
    keyRules: [
      "Extreme contrast between hair-thin horizontal stems and swollen vertical stems",
      "Liquid teardrop terminals on letters like 'r', 'f', 'c', 'y'",
      "Inward-pinched ink traps engineered for high-fashion editorial"
    ],
    colors: ["#D4AF37", "#0D0D11", "#9333EA", "#F1F5F9"],
    visualType: "typo-serif"
  },
  {
    id: "trend-typo-3",
    category: "typography",
    title: "Cyber-Runic Monospace",
    subtitle: "Ancient Cryptographic Stems & Terminal Slashes",
    momentum: 81,
    velocity: "+17% this week",
    status: "Emerging",
    aiConfidence: "92.3%",
    discoveredAt: "2026-11-15T18:00:00Z",
    tags: ["Monospace", "Cyber Runic", "Code Aesthetic", "Terminal"],
    summary: "Coding terminal monospace meets Viking Futhark and sacred geometry. Diagonal cross-stems, slashed zeros, and runic ligature sets engineered for developers.",
    promptFormula: "Futuristic runic monospace typography specimen, glowing phosphor green characters on CRT terminal screen, scanlines, cryptographic symbols, modular cyber aesthetics --v 6.1",
    keyRules: [
      "Monospaced grid alignment with strict box geometry",
      "Angular terminal slash angles (typically 30° or 60°)",
      "Optional glow shaders or CRT scanline overlay"
    ],
    colors: ["#39FF14", "#050D05", "#133E1A", "#80FF72"],
    visualType: "typo-runic"
  },

  // --- 4. COLOR PALETTES & LIGHTING ---
  {
    id: "trend-palette-1",
    category: "palettes",
    title: "Bioluminescent Abyssal Space",
    subtitle: "Deep Trench Indigo with Pulsing Phosphor Glows",
    momentum: 95,
    velocity: "+41% this week",
    status: "Peak Wave",
    aiConfidence: "98.9%",
    discoveredAt: "2026-11-16T12:00:00Z",
    tags: ["Abyssal", "Bioluminescence", "Deep Space", "Dark Mode"],
    summary: "Midnight obsidian foundations illuminated by high-voltage neon cyan, ultraviolet, and radioactive magenta. The dominant dark mode theme of 2026.",
    promptFormula: "Deep underwater trench bioluminescence color scheme, glowing jellyfish cyan, ultraviolet neon corals, abyssal dark navy background, cinematic volumetric glow --v 6.1",
    keyRules: [
      "Background luminances between 3% to 6% (non-pure black for OLED comfort)",
      "Accent colors must exceed 7.5:1 contrast against background",
      "Soft multi-stage drop shadows using colored translucent alpha"
    ],
    colors: ["#050814", "#00F5D4", "#7B2CBF", "#F72585", "#3A86FF"],
    visualType: "palette-card"
  },
  {
    id: "trend-palette-2",
    category: "palettes",
    title: "Neo-Tokyo Acid Sunset",
    subtitle: "Ultraviolet Dusk with Electric Solar Citrus",
    momentum: 90,
    velocity: "+29% this week",
    status: "Rising",
    aiConfidence: "96.4%",
    discoveredAt: "2026-11-16T06:00:00Z",
    tags: ["Acid Gradient", "Sunset", "Vaporwave 3.0", "Warm Glow"],
    summary: "A dusk colorway blending melancholy deep twilight with explosive, optimistic citrus yellow and fluorescent dragonfruit magenta.",
    promptFormula: "Tokyo dusk cityscape sky color palette, gradient from deep royal purple to hot magenta and blazing neon yellow, dreamlike atmosphere, cybernetic sunset --v 6.1",
    keyRules: [
      "Smooth 3-stop linear and radial gradient transitions",
      "Pairs best with minimalist black typography and sharp vector lines",
      "High emotional energy suited for music festivals and creator brands"
    ],
    colors: ["#0B032D", "#843B62", "#F67E7D", "#FFB997", "#FFE600"],
    visualType: "palette-card"
  },
  {
    id: "trend-palette-3",
    category: "palettes",
    title: "Earthy Ceramic & Matcha Moss",
    subtitle: "Sensory Organic Calming Minerals & Terracotta",
    momentum: 84,
    velocity: "+16% this week",
    status: "Emerging",
    aiConfidence: "93.1%",
    discoveredAt: "2026-11-15T18:00:00Z",
    tags: ["Organic", "Matcha", "Ceramic", "Quiet Luxury"],
    summary: "Digital fatigue antidote: calming botanical matcha greens, unglazed stoneware ecru, and warm riverbed terracotta designed for wellness and mindful apps.",
    promptFormula: "Japanese ceramic tea studio color palette, powdered ceremonial matcha green, warm speckled beige ceramic, raw terracotta clay, natural morning light, peaceful aesthetic --v 6.1",
    keyRules: [
      "Low to medium saturation with rich warm undertones",
      "Warm off-white background (#F7F4EA) reduces eye fatigue",
      "Optimal for sustainable lifestyle, organic beauty, and zen productivity"
    ],
    colors: ["#1B2A1E", "#475B46", "#738670", "#D3CBB8", "#C87D55"],
    visualType: "palette-card"
  },

  // --- 5. SOCIAL MEDIA & MOTION ---
  {
    id: "trend-social-1",
    category: "social",
    title: "Kinetic Bento-Box Carousel",
    subtitle: "Modular Micro-Cards with Live UI Telemetry",
    momentum: 97,
    velocity: "+49% this week",
    status: "Peak Wave",
    aiConfidence: "99.5%",
    discoveredAt: "2026-11-16T12:00:00Z",
    tags: ["Bento Grid", "Carousel", "UI Layout", "Conversion"],
    summary: "The bento UI paradigm fully takes over social feeds. Asymmetrical grid cells packed with interactive toggles, micro-charts, and high-density product feature callouts.",
    promptFormula: "Instagram carousel bento-box design layout, modular rounded card system, dark glassmorphism, glowing micro charts, pill badges, clean typography, luxury tech product promo --v 6.1",
    keyRules: [
      "Consistent 16px-24px outer and inner card radius",
      "Visual hierarchy with 1 hero card (60% width) and 2-3 satellite cards",
      "Subtle 1px border gradient with luminous hover states"
    ],
    colors: ["#0F172A", "#38BDF8", "#818CF8", "#F472B6"],
    visualType: "social-bento"
  },
  {
    id: "trend-social-2",
    category: "social",
    title: "Spatial 3D Float Story",
    subtitle: "Zero-Gravity Objects Breaking Frame Boundaries",
    momentum: 89,
    velocity: "+26% this week",
    status: "Rising",
    aiConfidence: "96.2%",
    discoveredAt: "2026-11-16T06:00:00Z",
    tags: ["3D Motion", "Spatial", "Zero Gravity", "Vertical Video"],
    summary: "Social stories and reels where hyper-realistic 3D objects break out of their UI bounding frames with realistic parallax depth, casting soft colored drop shadows.",
    promptFormula: "Vertical social story background, floating iridescent zero-gravity chrome orb, subtle blurred frosted glass backdrop, floating typography layers with depth of field, 3D spatial feel --v 6.1",
    keyRules: [
      "Extreme depth-of-field with selective foreground blur",
      "Object overlaps both top and bottom safe zones",
      "Dynamic lighting cast onto underlying text cards"
    ],
    colors: ["#181824", "#A855F7", "#EC4899", "#E0E7FF"],
    visualType: "social-spatial"
  },
  {
    id: "trend-social-3",
    category: "social",
    title: "Neubrutalist Tech News Reel",
    subtitle: "Heavy Inked Stroke Frames & Raw Monospaced Tickers",
    momentum: 83,
    velocity: "+15% this week",
    status: "Emerging",
    aiConfidence: "94.0%",
    discoveredAt: "2026-11-15T18:00:00Z",
    tags: ["Neubrutalism", "Ticker", "Raw Ink", "Attention"],
    summary: "Cutting through polished social media noise with intentional raw crunch: 3px solid black outlines, unsoftened hard drop shadows, high-contrast neon stickers, and ticker tapes.",
    promptFormula: "Neubrutalist graphic design for social media post, bold 3px black borders, pastel lime and hot coral accents, retro computer stickers, chunky monospaced headline, raw sticker aesthetic --v 6.1",
    keyRules: [
      "No blur on drop shadows (strict 4px-8px offset black shadow)",
      "High-energy pastel and neon color clashes",
      "Sticker badges with rotation angles (-5° to +8°)"
    ],
    colors: ["#D4FF00", "#FF4365", "#00D1FF", "#111111"],
    visualType: "social-brutal"
  }
];

// --- INSPIRATIONS SHOWCASE (12-hour cadence) ---
const INITIAL_INSPIRATIONS = [
  {
    id: "insp-1",
    title: "AuraOS Spatial Spatial Interface",
    creator: "@studio_lumina",
    tool: "Spline 3D + Flux.1 Pro",
    category: "logos",
    likes: 1420,
    discoveredAt: "2026-11-16T08:00:00Z",
    description: "Multi-layered refractive glass brand identity for a visionOS ecosystem with dynamic chromatic prism dispersion.",
    previewSvg: "glass-prism"
  },
  {
    id: "insp-2",
    title: "Tokyo Cyber-Botanical Expo 2027",
    creator: "@kenji_graphics",
    tool: "Midjourney v6.1 + Figma",
    category: "posters",
    likes: 2180,
    discoveredAt: "2026-11-16T02:00:00Z",
    description: "Swiss telemetry typography fused with bioluminescent orchid root systems and Risograph ink layering.",
    previewSvg: "cyber-orchid"
  },
  {
    id: "insp-3",
    title: "Chronos Variable Type Specimen",
    creator: "@typefoundry_x",
    tool: "Glyphs 4 + CSS Kinetic",
    category: "typography",
    likes: 1890,
    discoveredAt: "2026-11-15T20:00:00Z",
    description: "Continuous variable font that morphs optical weight and serif teardrops based on audio frequencies and scroll velocity.",
    previewSvg: "type-chronos"
  },
  {
    id: "insp-4",
    title: "Deep Sea DeepTech Identity System",
    creator: "@marine_synth",
    tool: "Recraft v3 + Illustrator",
    category: "logos",
    likes: 980,
    discoveredAt: "2026-11-15T14:00:00Z",
    description: "Cellular algorithmic logo inspired by deep ocean hydrothermal vent organisms for autonomous underwater robotics.",
    previewSvg: "deep-sea"
  }
];

// --- 24-HOUR AI DESIGN TREND RECORDS (Daily Intelligence Dossiers) ---
const INITIAL_RECORDS = [
  {
    id: "record-2026-11-16",
    recordDate: "2026-11-16",
    title: "Volume 42: The Tactile Shift & Post-Flat Resurgence",
    generatedAt: "2026-11-16T00:00:00Z",
    author: "Radar Autonomous Neural Synthesis Engine v4.2",
    executiveSummary: "Global design telemetry over the last 24 hours confirms a decisive migration away from antiseptic flat design toward 'Tactile Computation'—characterized by optical refraction, physical-simulation lighting, and exaggerated kinetic typography.",
    macroTrends: [
      {
        name: "Spatial Refraction over Flat Gradients",
        velocity: "+48% acceleration",
        description: "Flat gradients are plummeting in engagement while glassmorphic caustic caustics with real-time dynamic light responsiveness are seeing unprecedented adoption across top tech redesigns."
      },
      {
        name: "Telemetry Overload in Editorial",
        velocity: "+32% acceleration",
        description: "Posters and digital campaigns are integrating flight data, barcode strings, GPS coordinates, and raw camera EXIF metadata as primary design ornamentation."
      },
      {
        name: "Bento-ization of Everything",
        velocity: "+61% acceleration",
        description: "The Apple-pioneered modular bento grid is now the de facto standard for landing pages, social reels, corporate decks, and resume designs."
      }
    ],
    dyingTrends: [
      "Sterile Corporate Memphis Flat Vector Characters (-64%)",
      "Pure Monochromatic Gray Minimalist Logos (-41%)",
      "Symmetrical Static 3-Column Social Grids (-53%)"
    ],
    dominantColorForecast: {
      name: "Bioluminescent Cyan & Obsidian Carbon",
      primaryHex: "#00F5D4",
      secondaryHex: "#7B2CBF",
      baseHex: "#08090D",
      contrastRatio: "14.2:1 (AAA certified)"
    },
    topPromptBlueprint: "Minimalist spatial brand identity, refractive 3D glass emblem, chromatic dispersion prism, matte obsidian surface, volumetric rim lighting, shot on 85mm f/1.4, clean luxury studio aesthetic --v 6.1 --style raw",
    stats: {
      signalsScanned: "482,910 visual assets",
      confidenceScore: "99.2%",
      platformsAnalyzed: ["Behance", "Dribbble", "X/Twitter Design", "Are.na", "Figma Community", "Midjourney Showcase"]
    }
  }
];

// --- PROCEDURAL ENGINE SEED MATRICES ---
// Generates fresh trends every 6 hours, inspirations every 12 hours, records every 24 hours
const GENERATIVE_POOLS = {
  adjectives: ["Kinetic", "Bioluminescent", "Chiseled", "Liquid", "Tactile", "Quantum", "Solarpunk", "Hyper-Chroma", "Spectral", "Monolithic", "Algorithmic", "Deconstructed", "Neubrutalist", "Thermal", "Anisotropic"],
  styles: ["Glassmorphism 3.0", "Swiss Telemetry", "Organic Voronoi", "Cyber-Chisel", "Risograph Halftone", "Bento Modular", "Kinetic Serif", "Acid Typography", "Spatial Refraction", "Optical Moiré"],
  domains: ["Logos & Identity", "Editorial Posters", "Kinetic Typography", "Color & Lighting", "Social Feed Systems"],
  tags: ["Spatial UI", "Variable Type", "AI-Assisted", "Tactile UI", "High-Contrast", "Generative", "Analog Warmth", "Sub-Atomic", "OLED Deep", "Micro-Motion"],
  colors: [
    ["#00F5D4", "#7928CA", "#0E131F", "#F72585"],
    ["#39FF14", "#0A0F0D", "#1C3A27", "#80FF72"],
    ["#FF3366", "#330066", "#050510", "#FFCC00"],
    ["#00D4FF", "#091921", "#5C24FF", "#F1F5F9"],
    ["#F77F00", "#D62828", "#003049", "#EAE2B7"],
    ["#8338EC", "#3A86FF", "#FF006E", "#FB5607"],
    ["#E0A96D", "#201E20", "#EEC373", "#F5F5F5"]
  ]
};

window.RADAR_DATA = {
  INITIAL_TRENDS,
  INITIAL_INSPIRATIONS,
  INITIAL_RECORDS,
  GENERATIVE_POOLS
};
