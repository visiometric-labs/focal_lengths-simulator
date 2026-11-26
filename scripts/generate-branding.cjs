const fs = require('fs');
const path = require('path');
const sharp = require('../../filters-simulator/node_modules/sharp');

const brandingDir = path.resolve(__dirname, '../public/branding');
if (!fs.existsSync(brandingDir)) {
  fs.mkdirSync(brandingDir, { recursive: true });
}

// Opción 4 aprobada: Gafas POV Split con Doble Foco
const faviconSvg = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="24" fill="#070F1E"/>
  <rect x="2" y="2" width="96" height="96" rx="22" stroke="#00F2FE" stroke-width="2.5" stroke-opacity="0.4"/>
  <!-- Montura de Gafas con Puente -->
  <path d="M 16 38 C 24 30, 42 30, 48 38 C 50 40, 50 40, 52 38 C 58 30, 76 30, 84 38 C 88 52, 84 66, 72 70 C 58 72, 54 60, 52 54 C 48 54, 46 72, 28 70 C 16 66, 12 52, 16 38 Z" stroke="#38BDF8" stroke-width="5" fill="#0B1A30" stroke-linejoin="round"/>
  <!-- Puente Central -->
  <path d="M 47 40 C 50 36, 52 36, 55 40" stroke="#00F2FE" stroke-width="4" stroke-linecap="round"/>
  <!-- Pastilla / Zona de Cerca (Bifocal / Progresivo inferior iluminado) -->
  <path d="M 24 56 C 30 56, 40 56, 42 62 C 38 68, 28 68, 22 64 Z" fill="#00F2FE" opacity="0.85"/>
  <path d="M 76 56 C 70 56, 60 56, 58 62 C 62 68, 72 68, 78 64 Z" fill="#00F2FE" opacity="0.85"/>
  <!-- Destello de Reflejo Antirreflejo Superior -->
  <line x1="26" y1="38" x2="38" y2="38" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.85"/>
</svg>`;

const coverSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#070F1E"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="optix-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00F2FE"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg-grad)"/>
  <rect x="2" y="2" width="1196" height="626" rx="20" stroke="#1E293B" stroke-width="2"/>

  <circle cx="200" cy="150" r="180" fill="#00F2FE" opacity="0.06"/>
  <circle cx="950" cy="450" r="220" fill="#0284C7" opacity="0.08"/>

  <!-- Cabecera / Branding -->
  <g transform="translate(80, 70)">
    <rect width="210" height="34" rx="17" fill="#0B1E3B" stroke="#00F2FE" stroke-width="1.2" stroke-opacity="0.4"/>
    <circle cx="20" cy="17" r="4.5" fill="#00F2FE"/>
    <text x="34" y="22" fill="#00F2FE" font-family="system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="1.5">VISIOMETRIC LABS</text>
  </g>

  <text x="1120" y="92" fill="#64748B" font-family="monospace" font-size="13" text-anchor="end">JayzirTech • 60 FPS WebGL</text>

  <!-- Título Principal -->
  <g transform="translate(80, 200)">
    <text x="0" y="0" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="76" font-weight="900" letter-spacing="-1.5">
      Optix<tspan fill="#00F2FE" font-weight="400">™</tspan>
    </text>
    <text x="0" y="52" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="26" font-weight="700">
      Simulador de Diseños de Lente y Campos Visuales
    </text>
    <text x="0" y="96" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="16" font-weight="400">
      Monofocales (Lejos / Cerca) • Bifocales Flat-Top 28 • Progresivos Continuos de 4 Gamas
    </text>
  </g>

  <!-- Chips de Tecnología Óptica -->
  <g transform="translate(80, 370)">
    <g transform="translate(0, 0)">
      <rect width="260" height="48" rx="10" fill="#0B1A30" stroke="#0284C7" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="24" cy="24" r="5" fill="#38BDF8"/>
      <text x="40" y="29" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Monofocal Lejos / Cerca</text>
    </g>
    <g transform="translate(280, 0)">
      <rect width="280" height="48" rx="10" fill="#0B1A30" stroke="#00F2FE" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="24" cy="24" r="5" fill="#00F2FE"/>
      <text x="40" y="29" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Bifocal Flat-Top &amp; Image Jump</text>
    </g>
    <g transform="translate(580, 0)">
      <rect width="290" height="48" rx="10" fill="#0B1A30" stroke="#38BDF8" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="24" cy="24" r="5" fill="#38BDF8"/>
      <text x="40" y="29" fill="#F8FAFC" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Progresivo Continuo (4 Gamas)</text>
    </g>
  </g>

  <!-- Footer -->
  <g transform="translate(80, 540)">
    <line x1="0" y1="0" x2="1040" y2="0" stroke="#1E293B" stroke-width="1.5"/>
    <circle cx="6" cy="30" r="4" fill="#10B981"/>
    <text x="20" y="34" fill="#94A3B8" font-family="monospace" font-size="12">Calibración Clínica Fisiológica • Shader WebGL en Tiempo Real</text>
    <text x="1040" y="34" fill="#64748B" font-family="monospace" font-size="12" text-anchor="end">github.com/visiometric-labs/focal_lengths-simulator</text>
  </g>
</svg>`;

async function main() {
  fs.writeFileSync(path.join(brandingDir, 'favicon.svg'), faviconSvg, 'utf8');

  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(brandingDir, 'favicon-opt1.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(brandingDir, 'apple-touch-icon.png'));

  await sharp(Buffer.from(coverSvg))
    .jpeg({ quality: 92 })
    .toFile(path.join(brandingDir, 'og-cover.jpg'));

  console.log('Branding assets generated in public/branding/');
}

main().catch(console.error);
