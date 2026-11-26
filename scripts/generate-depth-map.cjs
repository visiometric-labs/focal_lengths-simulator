const fs = require('fs');
const path = require('path');
const sharp = require('../../filters-simulator/node_modules/sharp');

const outDir = path.resolve(__dirname, '../public/scenes');
const depthPngPath = path.join(outDir, 'office-depth.png');

async function generateDepthMap() {
  const width = 1024;
  const height = 571;

  // Creamos un mapa de profundidad fotográfico con SVG de gradientes y formas suaves:
  // Fondo lejano (>3m): valor 242-255 (blanco / gris muy claro)
  // Escritorio / Laptop intermedia (~70cm): valor 128 (gris medio)
  // Celular y mano en primer plano (~35cm): valor 38 (gris oscuro / casi negro)
  const depthSvg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradiente general de profundidad del espacio de oficina (fondo hacia mesa) -->
      <linearGradient id="office-room-depth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FAFAFA" />   <!-- Techo / fondo infinito: 250 -->
        <stop offset="42%" stop-color="#E8E8E8" />  <!-- Paredes y compañeros: 232 -->
        <stop offset="68%" stop-color="#B0B0B0" />  <!-- Borde lejano del escritorio: 176 -->
        <stop offset="100%" stop-color="#888888" /> <!-- Plano mesa general: 136 -->
      </linearGradient>

      <!-- Gradiente de la zona intermedia de la Laptop y escritorio -->
      <radialGradient id="laptop-depth" cx="58%" cy="56%" r="38%">
        <stop offset="0%" stop-color="#7C7C7C" />   <!-- Pantalla laptop (~70 cm): 124 -->
        <stop offset="65%" stop-color="#8E8E8E" />  <!-- Teclado y taza: 142 -->
        <stop offset="100%" stop-color="#A5A5A5" /> <!-- Transición al fondo -->
      </radialGradient>

      <!-- Gradiente de Smartphone en mano (Primer plano ~35 cm) -->
      <radialGradient id="phone-depth" cx="18%" cy="78%" r="35%">
        <stop offset="0%" stop-color="#242424" />   <!-- Celular (~35 cm): 36 -->
        <stop offset="45%" stop-color="#2E2E2E" />  <!-- Pantalla y mano: 46 -->
        <stop offset="75%" stop-color="#484848" />  <!-- Muñeca y antebrazo: 72 -->
        <stop offset="100%" stop-color="#808080" /> <!-- Unión con la mesa -->
      </radialGradient>

      <filter id="soft-blur" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>

    <!-- 1. Fondo completo de la oficina (Profundidad z ≈ 0.90 - 1.0) -->
    <rect width="${width}" height="${height}" fill="url(#office-room-depth)" />

    <!-- 2. Plano medio: Escritorio, Laptop y taza de café (Profundidad z ≈ 0.48 - 0.55) -->
    <g filter="url(#soft-blur)">
      <!-- Superficie de la mesa -->
      <path d="M 120 280 L 1024 240 L 1024 571 L 180 571 Z" fill="#8C8C8C" opacity="0.85" />
      <!-- Silueta amplia de laptop y área de trabajo central -->
      <ellipse cx="580" cy="330" rx="280" ry="180" fill="url(#laptop-depth)" />
    </g>

    <!-- 3. Primer plano: Brazo, mano y Smartphone (Profundidad z ≈ 0.12 - 0.20) -->
    <g filter="url(#soft-blur)">
      <!-- Antebrazo y mano que entra desde la esquina inferior izquierda -->
      <path d="M 0 320 
               C 100 320, 240 340, 290 410 
               C 340 470, 320 540, 240 571 
               L 0 571 Z" 
            fill="url(#phone-depth)" />
      <!-- Foco preciso en el cuerpo del smartphone -->
      <ellipse cx="170" cy="450" rx="140" ry="110" fill="#242424" opacity="0.95" />
    </g>
  </svg>`;

  console.log('Generating calibrated 8-bit grayscale depth map for office scene...');

  await sharp(Buffer.from(depthSvg))
    .resize(width, height)
    .grayscale()
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(depthPngPath);

  console.log('Depth map generated successfully at:', depthPngPath);
}

generateDepthMap().catch(console.error);
