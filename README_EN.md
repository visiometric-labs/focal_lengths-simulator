# 📐 Optix™ — Focal Lengths Simulator by Visiometric Labs

> **Interactive clinical and pedagogical first-person simulator for ophthalmic lens designs across visual fields and focal distances: Single Vision, Bifocal Flat-Top 28, and Progressive (Multifocal) lenses across 4 quality tiers, rendered in real-time with WebGL at 60 FPS.**

🌐 **Live Demo:** [visiometric-labs.github.io/focal_lengths-simulator](https://visiometric-labs.github.io/focal_lengths-simulator/)
📦 **Repository:** [github.com/visiometric-labs/focal_lengths-simulator](https://github.com/visiometric-labs/focal_lengths-simulator)

---

## 🎯 Clinical Purpose

In the optometric consultation and optical store counter, lens design selection generates the most confusion and uncertainty for presbyopic patients:

| Design | Classic patient question |
|---|---|
| **Single Vision** | *"Why can't I see the TV with my reading glasses without everything going blurry?"* |
| **Bifocal** | *"Why is my computer screen blurry if I can read my phone perfectly in the lower segment?"* |
| **Progressive** | *"Why did my friend say multifocals make you dizzy when you move your eyes sideways?"* |

**Optix™** answers these questions **in first person**: the patient directly experiences, through a realistic eyeglass frame rendered in WebGL, how each optical design behaves across everyday distances.

---

## 👓 Implemented Lens Designs

### 1. Single Vision Lens (Homogeneous Dioptric Power)
- Constant power across the entire lens surface.
- **Distance Mode (>3 m):** Background sharp, laptop and phone blurred.
- **Near Mode (~35 cm):** Phone sharp, everything else out of focus.

### 2. Bifocal Flat-Top 28
- Two focal fields separated by a straight horizontal line.
- Demonstrates **Image Jump** (prismatic displacement) at the segment boundary.
- Demonstrates the **intermediate blind spot** (~70 cm): the laptop stays blurry in both zones.

### 3. Progressive / Multifocal Lens (4 Tiers)
- Continuous smooth dioptric gradation from top to bottom.
- **4-tier corridor selector:**

| Tier | Usable Corridor | Lateral Aberrations |
|---|---|---|
| Basic (Traditional) | ~30% | Noticeable and early |
| Standard (Digital Conventional) | ~45% | Moderate and smoothed |
| Premium (Free-Form) | ~65% | Reduced and ergonomic |
| Ultra (Custom Panoramic) | ~85% | Minimal at extreme edges |

---

## ⚡ Technical Architecture

### WebGL Rendering Engine
Unlike simulators based on swapping static photos, **Optix™ uses a single sharp master image and computes blur in real-time** via a GLSL fragment shader.

**Rendering Pipeline:**
1. **Texture 0:** 4K master scene (`skyline-workstation-4k.jpg`)
2. **Texture 1:** Depth map (`skyline-workstation-depth.png`)
3. **Texture 2:** Binocular aperture mask (dynamically generated from SVG frame geometry)
4. **Per-pixel computation:** CoC (Circle of Confusion) based on depth vs. lens focal target
5. **Bokeh sampling:** Golden Spiral pattern with 12 samples
6. **Minkwitz aberration:** Lateral astigmatism outside the progressive corridor
7. **Image Jump:** Prismatic UV offset inside bifocal segments
8. **Peripheral vision:** Presbyopic blur outside the eyeglass frame

### Circle of Confusion Formula

$$\text{CoC} = |Z_{\text{pixel}} - F_{\text{lens}}| \times 28 + \text{LateralAberration} \times 24$$

### Scene Assets

| Asset | Resolution | Description |
|---|---|---|
| `skyline-workstation-4k.jpg` | 3840 × 2160 | AI-expanded panoramic desk scene with urban skyline |
| `skyline-workstation-depth.png` | 3840 × 2160 | Calibrated 8-bit grayscale depth map |

**Depth value ranges:**

| Scene Zone | Value (0-255) | Normalized Depth |
|---|---|---|
| Open sky | ~247 | 0.97 (infinity) |
| Skyline / skyscrapers | ~232 | 0.91 |
| Laptop screen | ~187 | 0.73 |
| Keyboard | ~80 | 0.31 |
| Desk bottom edge | ~58 | 0.23 |
| Near objects (notebook, tablet, mug) | ~40-55 | 0.16-0.22 |

---

## 🏛️ Project Structure

```
focal_lengths-simulator/
├── .github/workflows/deploy.yml       # CI/CD: Vite build + GitHub Pages deploy (main branch)
├── public/
│   ├── manifest.json                  # PWA Web App Manifest
│   ├── branding/                      # Favicon SVG/PNG, Apple Touch Icon, OG Cover
│   └── scenes/                        # 4K scene image + calibrated depth map
├── scripts/
│   ├── generate-depth-map.cjs         # Depth map generator (Node + Sharp)
│   └── generate-branding.cjs          # Favicon and OG cover generator (Node + Sharp)
├── src/
│   ├── main.js                        # App orchestrator
│   ├── components/                    # UI: preloader, landing, glasses HUD, lens selector, card
│   ├── core/                          # Camera controller, event bus, idle manager, lens data
│   ├── engine/
│   │   ├── webgl-renderer.js          # WebGL engine: textures, quad, uniforms, render loop
│   │   └── shaders/
│   │       ├── focal-vertex.glsl      # Vertex shader: fullscreen UV coordinates
│   │       └── focal-fragment.glsl    # Fragment shader: CoC, Bokeh, Minkwitz, Image Jump
│   └── styles/                        # CSS: theme, layout, landing, components
├── index.html                         # Main HTML with SEO/OG metadata
├── package.json                       # Dependencies: Vite 6, Sharp (dev)
└── vite.config.js                     # Vite config: dynamic base, ES2020, port 3000
```

---

## 🚀 Setup & Development

### Requirements
- **Node.js** ≥ 18 (v22 recommended)
- **npm** ≥ 9

### Install

```bash
git clone https://github.com/visiometric-labs/focal_lengths-simulator.git
cd focal_lengths-simulator
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000` with Vite HMR (Hot Module Replacement).

### Production Build

```bash
npm run build
```

Outputs optimized bundle to `dist/` with base path `/focal_lengths-simulator/` for GitHub Pages.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run generate:depth` | Regenerate depth map via SVG/Sharp pipeline |
| `npm run generate:branding` | Regenerate favicon, touch icon, and OG cover |

---

## 🌐 Deployment (CI/CD)

Automatic deployment to **GitHub Pages** via GitHub Actions:

1. **Trigger:** Every push to `main` branch (or manual dispatch).
2. **Build:** `npm ci && npx vite build --base=/focal_lengths-simulator/`
3. **Deploy:** `actions/deploy-pages@v4` publishes the `dist/` directory.

**Production URL:** https://visiometric-labs.github.io/focal_lengths-simulator/

### Branch Workflow

```
dev (active development) ──► main (production merge) ──► GitHub Pages (auto-deploy)
```

---

## 🎛️ Application Flow

```
Circular Preloader ──► Welcome Landing ──► POV Simulator (WebGL + HUD)
  (GPU preload)         (Landing Screen)       (Interactive Experience)
                              │                        │
                              │  "Start Experience"    │  Drag = Move gaze
                              │  → requestFullscreen() │  Bottom selector = Switch lens
                              │                        │  Optical Map = X-Ray toggle
                              │                        │  Logo = Return to landing
                              │                        │
                              │◄── 5 min idle ─────────│
                              │◄── Logo click ─────────│
```

### Kiosk / Counter Mode
- After **5 minutes** of inactivity, the app automatically returns to the landing screen.
- For quick testing, append `?timeout=2000` to the URL (value in milliseconds).

---

## 🎨 Visual Identity

| Element | Specification |
|---|---|
| **Brand Name** | Optix™ |
| **Favicon** | POV Split Glasses with dual focus (pure SVG) |
| **Typography** | Plus Jakarta Sans (UI) + JetBrains Mono (technical data) |
| **Color Palette** | Abyssal background `#070F1E`, photonic cyan `#00F2FE`, clinical blue `#38BDF8` |
| **Iconography** | 100% SVG vector — zero emojis in the interface |
| **Open Graph** | 1200 × 630 px card for WhatsApp, Telegram, LinkedIn |

---

## ✅ Quality Checklist

| Criterion | Status |
|---|---|
| 60 FPS rendering on desktop and tablets | ✅ |
| Automatic fullscreen on experience start | ✅ |
| Dynamic SVG circular preloader | ✅ |
| Counter mode with 5-minute auto-return | ✅ |
| Single Vision: demonstrates two-distance impossibility | ✅ |
| Bifocal: Image Jump + intermediate blind spot | ✅ |
| Progressive: 4 tiers with widening corridor | ✅ |
| Depth map calibrated to actual 4K scene | ✅ |
| AI-expanded panorama without mirrored edges | ✅ |
| Pure SVG iconography (zero emojis) | ✅ |
| Zero price mentions in the UI | ✅ |
| DPR capped at 2.0 for thermal performance | ✅ |
| WebGL context loss tolerance | ✅ |
| PWA manifest with `display: fullscreen` | ✅ |
| Complete OG metadata for social sharing | ✅ |
| Automated CI/CD to GitHub Pages | ✅ |

---

## 🏢 Authorship & License

- **Organization:** Visiometric Labs
- **Author:** JayzirTech
- **License:** Private / All Rights Reserved
- **Year:** 2026

---

*Document generated November 27, 2026. For the full optical design specification and shader architecture, see [CONCEPT.md](./CONCEPT.md).*
